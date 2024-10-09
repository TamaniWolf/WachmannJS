const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.ChannelUpdate,
	description: "Log edited Channels.",
	once: false,
	async execute(oldChannel, newChannel) {
		const { Application } = require("../../../tools/core.js");
		const { Utils, DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		const { DateTime } = require("luxon");
		const { Get, Set, Del } = require("../../../tools/db.js");
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(newChannel.guild.id);
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(newChannel.guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// AuditLog Fetch
		const fetchedLogsCU = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.ChannelUpdate
		});
		const fetchedLogsCOU = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.ChannelOverwriteUpdate
		});
		const channelUpdateLog = fetchedLogsCU.entries.first();
		const channelOverwriteUpdate = fetchedLogsCOU.entries.first();

		// Main Body
		let dataAuditLogIDCU;
		let dataAuditLogIDCOU;
		let culogs = 2;
		if (channelUpdateLog != null) {
			culogs = channelUpdateLog.createdTimestamp;
		}
		let coulogs = 2;
		if (channelOverwriteUpdate != null) {
			coulogs = channelOverwriteUpdate.createdTimestamp;
		}
		if (culogs > coulogs) {
			if (channelUpdateLog != null) {
				dataAuditLogIDCU = Get.auditLogsByID("auditlog", channelUpdateLog.id);
			}
			const { targetType, actionType, executor, changes, id, target } = channelUpdateLog;
			if (dataAuditLogIDCU == null || id !== dataAuditLogIDCU.AuditLogID) {
				if (targetType === "Channel" && actionType === "Update") {
					const changeName = changes.filter(function(obj) {
						return obj.key === "name";
					});
					const changeTopic = changes.filter(function(obj) {
						return obj.key === "topic";
					});
					const changeType = changes.filter(function(obj) {
						return obj.key === "type";
					});
					const changeNsfw = changes.filter(function(obj) {
						return obj.key === "nsfw";
					});
					const changeRLPU = changes.filter(function(obj) {
						return obj.key === "rate_limit_per_user";
					});
					const changeDAAD = changes.filter(function(obj) {
						return obj.key === "default_auto_archive_duration";
					});
					// Channel Update Old
					let cuo = "";
					// Channel Update New
					let cun = "";
					// Embed
					let icon2 = executor.avatarURL();
					if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
					const embedCU = new EmbedBuilder()
						.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
						.setColor(Application.colors().logEmbedColor.update)
						.setDescription(LanguageConvert.lang(langLogs.channel.editchannel, target))
						.setFooter({ text: "ChannelUpdate" });
					// Old
					if (changeName && changeName.length !== 0) { cuo += `**${langLogs.channel.name}:** ${changeName[0].old}\n`; }
					if (changeTopic && changeTopic.length !== 0) { cuo += `**${langLogs.channel.topic}:** ${changeTopic[0].old}\n`; }
					if (changeType && changeType.length !== 0) {
						const chaType = await Utils.channel_type_name(changeType[0].old);
						cuo += `**${langLogs.channel.type}:** ${chaType}\n`;
					}
					if (changeNsfw && changeNsfw.length !== 0) { cuo += `**${langLogs.channel.nsfw}:** ${changeNsfw[0].old}\n`; }
					if (changeRLPU && changeRLPU.length !== 0) {
						const rateLimit = await Utils.rateLimitPerUser(changeRLPU[0].old);
						cuo += `**${langLogs.channel.slowmode}:** ${rateLimit}\n`;
					}
					if (changeDAAD && changeDAAD.length !== 0) {
						const dad = await Utils.defaultArchiveDuration(changeDAAD[0].old);
						cuo += `**${langLogs.channel.activethreads}:** ${dad}\n`;
					}
					// New
					if (changeName && changeName.length !== 0) { cun += `**${langLogs.channel.name}:** ${changeName[0].new}\n`; }
					if (changeTopic && changeTopic.length !== 0) { cun += `**${langLogs.channel.topic}:** ${changeTopic[0].new}\n`; }
					if (changeType && changeType.length !== 0) {
						const chaType = await Utils.channel_type_name(changeType[0].new);
						cun += `**${langLogs.channel.type}:** ${chaType}\n`;
					}
					if (changeNsfw && changeNsfw.length !== 0) { cun += `**${langLogs.channel.nsfw}:** ${changeNsfw[0].new}\n`; }
					if (changeRLPU && changeRLPU.length !== 0) {
						const rateLimit = await Utils.rateLimitPerUser(changeRLPU[0].new);
						cun += `**${langLogs.channel.slowmode}:** ${rateLimit}\n`;
					}
					if (changeDAAD && changeDAAD.length !== 0) {
						const dad = await Utils.defaultArchiveDuration(changeDAAD[0].old);
						cun += `**${langLogs.channel.activethreads}:** ${dad}\n`;
					}
					// AddFileds
					if (cuo && cuo.length !== 0) {
						embedCU.addFields(
							{ name: langLogs.all.old, value: `${cuo}`, inline: true }
						);
					}
					if (cun && cun.length !== 0) {
						embedCU.addFields(
							{ name: langLogs.all.new, value: `${cun}`, inline: true }
						);
					}
					if (dataAuditLogIDCU == null) {
						// Bot
						if (executor.bot === true) {
							embedCU.setTimestamp(new Date());
							dataAuditLogIDCU = { AuditLogID: `${id}`, GuildID: `${newChannel.guild.id}`, ShardID: `${newChannel.guild.shardId}`, Type: "Channel_Update", Date: `${channelUpdateLog.createdTimestamp}` };
							Set.auditLogsByData("auditlog", dataAuditLogIDCU);
							// eslint-disable-next-line no-undef
							globalclient.channels.cache.get(logChannel).send({ embeds: [embedCU] });
						} else
						// Member
							if (executor.bot != true) {
								embedCU.setTimestamp(new Date());
								dataAuditLogIDCU = { AuditLogID: `${id}`, GuildID: `${newChannel.guild.id}`, ShardID: `${newChannel.guild.shardId}`, Type: "Channel_Update", Date: `${channelUpdateLog.createdTimestamp}` };
								Set.auditLogsByData("auditlog", dataAuditLogIDCU);
								// eslint-disable-next-line no-undef
								globalclient.channels.cache.get(logChannel).send({ embeds: [embedCU] });
							}
					}
				}
			}
		}
		if (coulogs > culogs) {
			if (channelOverwriteUpdate != null) {
				dataAuditLogIDCOU = Get.auditLogsByID("auditlog", channelOverwriteUpdate.id);
			}
			const { targetType, actionType, executor, id, target } = channelOverwriteUpdate;
			// const { targetType, actionType, executor, changes, id, extra, target } = channelOverwriteUpdate;
			if (dataAuditLogIDCOU == null || id != dataAuditLogIDCOU.AuditLogID) {
				if (targetType === "Channel" && actionType === "Update") {
					// console.log(channelOverwriteUpdate);
					// return;
					// const changeCOUAllow = changes.filter(function(obj) {
					// 	return obj.key === "allow";
					// });
					// const changeCOUDeny = changes.filter(function(obj) {
					// 	return obj.key === "deny";
					// });
					// console.log(changes);
					// let permAllow = "";
					// let permDeny = "";
					// if (changeCOUAllow != null) permAllow = changeCOUAllow[0].new;
					// if (changeCOUAllow == null) permAllow = 0n;
					// if (changeCOUDeny != null) permDeny = changeCOUDeny[0].new;
					// if (changeCOUDeny == null) permDeny = 0n;
					// const PermissionConvert = require("../../tools/functions/permissionConvert.js");
					// const coua = await PermissionConvert.permissionsNames(permAllow); // Channel Update Allow
					// const coud = await PermissionConvert.permissionsNames(permDeny); // Channel Update Deny
					// Embed
					let icon2 = executor.avatarURL();
					if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
					const embedCOU = new EmbedBuilder()
						.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
						.setColor(Application.colors().logEmbedColor.update)
						.setDescription(LanguageConvert.lang(langLogs.channel.editpermoverwrite, target));
					// AddFileds
					// if (coua && coua.length !== 0) {
					// 	embedCOU.addFields(
					// 		{ name: langLogs.all.granted, value: `${coua}`, inline: true }
					// 	);
					// }
					// if (coud && coud.length !== 0) {
					// 	embedCOU.addFields(
					// 		{ name: langLogs.all.revoked, value: `${coud}`, inline: true }
					// 	);
					// }
					// if (changeCOUAllow[0].new === 0 || changeCOUDeny[0].new === 0) {
					// 	embedCOU.addFields(
					// 		{ name: langLogs.channel.resettodefault, value: ".", inline: true }
					// 	);
					// }
					if (dataAuditLogIDCOU == null) {
						embedCOU.setTimestamp(new Date());
						dataAuditLogIDCOU = { AuditLogID: `${id}`, GuildID: `${newChannel.guild.id}`, ShardID: `${newChannel.guild.shardId}`, Type: "Channel_Update", Date: `${channelOverwriteUpdate.createdTimestamp}` };
						Set.auditLogsByData("auditlog", dataAuditLogIDCOU);
						// eslint-disable-next-line no-undef
						globalclient.channels.cache.get(logChannel).send({ embeds: [embedCOU] });
					}
				}
			}
		}
		let dataAuditLogDate;
		// eslint-disable-next-line prefer-const
		dataAuditLogDate = Get.auditLogsAllByType("auditlog", "Channel_Update");
		if (dataAuditLogDate != null && dataAuditLogDate.length < 4) {
			return;
		} else {
			dataAuditLogDate.forEach(date => {
				const dtRemove = DateTime.now().minus({ days: 20 });
				const timeNew = dtRemove.toMillis();
				if (timeNew >= date.Date) {
					Del.auditLogsByID("auditlog", date.AuditLogID);
				}
			});
		}
	}
};