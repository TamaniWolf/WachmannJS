/* eslint-disable no-inline-comments */
const { EmbedBuilder, AuditLogEvent } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: "channelUpdate",
	description: "t",
	call: "on",
	async execute(oldChannel, newChannel) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel();
		if (newChannel.guild.id !== process.env.SERVER_ID) return;
		const { DateTime } = require("luxon");
		// SQLite
		const { Get, Set, Del } = require("../../tools/functions/sqlite/prepare");
		// AuditLog Fetch
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(newChannel.guild.id);
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
		// Data Null
		let dataAuditLogIDCU;
		let dataAuditLogIDCOU;
		// Context
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
				dataAuditLogIDCU = Get.auditLogs(channelUpdateLog.id);
			}
			const { targetType, actionType, executor, changes, id, target } = channelUpdateLog;
			if (dataAuditLogIDCU == null || id !== dataAuditLogIDCU.AuditLogID) {
				if(targetType === "Channel" && actionType === "Update") {
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
					let cuo = ""; // Channel Update Old
					let cun = ""; // Channel Update New
					// Embed
					let icon2 = executor.avatarURL();
					if(executor.avatar == null) {
						icon2 = "attachment://discord_logo_gray.png";
					}
					const embedCU = new EmbedBuilder()
						.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
						.setColor("Blue")
						.setDescription(`${executor} **Changed** Channel ${target}'s settings`);
					const ChannelTypeConvert = require("../../tools/functions/channelTypeConvert.js");
					let chaTypeOld;
					if (changeType && changeType.length !== 0) {
						chaTypeOld = await ChannelTypeConvert.channelTypeNumber(changeType[0].old);
					}
					let chaTypeNew;
					if (changeType && changeType.length !== 0) {
						chaTypeNew = await ChannelTypeConvert.channelTypeNumber(changeType[0].new);
					}
					// Old
					if (changeName && changeName.length !== 0) { cuo += `**Name:** ${changeName[0].old}\n`; }
					if (changeTopic && changeTopic.length !== 0) { cuo += `**Topic:** ${changeTopic[0].old}\n`; }
					if (changeType && changeType.length !== 0) { cuo += `**Type:** ${chaTypeOld}\n`; }
					if (changeNsfw && changeNsfw.length !== 0) { cuo += `**Nsfw:** ${changeNsfw[0].old}\n`; }
					if (changeRLPU && changeRLPU.length !== 0) { cuo += `**Slowmode:** ${changeRLPU[0].old}s\n`; }
					if (changeDAAD && changeDAAD.length !== 0) {
						let dAAD_Old = "";
						if (changeDAAD[0].old === 60) { dAAD_Old += "1 Hour"; }
						if (changeDAAD[0].old === 1440) { dAAD_Old += "24 Hours"; }
						if (changeDAAD[0].old === 4320) { dAAD_Old += "3 Days"; }
						if (changeDAAD[0].old === 10080) { dAAD_Old += "1 Week"; }
						cuo += `**Hide Inactive Threads:** ${dAAD_Old}\n`;
					}
					// New
					if (changeName && changeName.length !== 0) { cun += `**Name:** ${changeName[0].new}\n`; }
					if (changeTopic && changeTopic.length !== 0) { cun += `**Topic:** ${changeTopic[0].new}\n`; }
					if (changeType && changeType.length !== 0) { cun += `**Type:** ${chaTypeNew}\n`; }
					if (changeNsfw && changeNsfw.length !== 0) { cun += `**Nsfw:** ${changeNsfw[0].new}\n`; }
					if (changeRLPU && changeRLPU.length !== 0) { cun += `**Slowmode:** ${changeRLPU[0].new}s\n`; }
					if (changeDAAD && changeDAAD.length !== 0) {
						let dAAD_New = "";
						if (changeDAAD[0].new === 60) { dAAD_New += "1 Hour"; }
						if (changeDAAD[0].new === 1440) { dAAD_New += "24 Hours"; }
						if (changeDAAD[0].new === 4320) { dAAD_New += "3 Days"; }
						if (changeDAAD[0].new === 10080) { dAAD_New += "1 Week"; }
						cun += `**Hide Inactive Threads:** ${dAAD_New}\n`;
					}
					// AddFileds
					if (cuo && cuo.length !== 0) {
						embedCU.addFields(
							{ name: "Old:", value: `${cuo}`, inline: true }
						);
					}
					if (cun && cun.length !== 0) {
						embedCU.addFields(
							{ name: "New:", value: `${cun}`, inline: true }
						);
					}
					if (dataAuditLogIDCU == null) {
						// Bot
						if (executor.bot === true) {
							embedCU.setFooter({ text: `BotID: ${executor.id}` })
								.setTimestamp(new Date());
							dataAuditLogIDCU = { AuditLogID: `${id}`, GuildID: `${newChannel.guild.id}`, Type: "Channel_Update", Date: `${channelUpdateLog.createdTimestamp}` };
							Set.auditLogs(dataAuditLogIDCU);
							// eslint-disable-next-line no-undef
							globalclient.channels.cache.get(logChannel).send({ embeds: [embedCU] });
						} else
						// Member
							if (executor.bot != true) {
								embedCU.setFooter({ text: `MemberID: ${executor.id}` })
									.setTimestamp(new Date());
								dataAuditLogIDCU = { AuditLogID: `${id}`, GuildID: `${newChannel.guild.id}`, Type: "Channel_Update", Date: `${channelUpdateLog.createdTimestamp}` };
								Set.auditLogs(dataAuditLogIDCU);
								// eslint-disable-next-line no-undef
								globalclient.channels.cache.get(logChannel).send({ embeds: [embedCU] });
							}
					}
				}
			}
		}
		if (coulogs > culogs) {
			if (channelOverwriteUpdate != null) {
				dataAuditLogIDCOU = Get.auditLogs(channelOverwriteUpdate.id);
			}
			const { targetType, actionType, executor, changes, id, extra, target } = channelOverwriteUpdate;
			if (dataAuditLogIDCOU == null || id != dataAuditLogIDCOU.AuditLogID) {
				if(targetType === "Channel" && actionType === "Update") {
					const changeCOUAllow = changes.filter(function(obj) {
						return obj.key === "allow";
					});
					const changeCOUDeny = changes.filter(function(obj) {
						return obj.key === "deny";
					});
					const PermissionConvert = require("../../tools/functions/permissionConvert.js");
					const coua = await PermissionConvert.permissionsBitField(changeCOUAllow[0].new); // Channel Update Allow
					const coud = await PermissionConvert.permissionsBitField(changeCOUDeny[0].new); // Channel Update Deny
					// Embed
					let icon2 = executor.avatarURL();
					if(executor.avatar == null) {
						icon2 = "attachment://discord_logo_gray.png";
					}
					const embedCOU = new EmbedBuilder()
						.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
						.setColor("Blue")
						.setDescription(`${executor} **Changed** Permissions for ${extra} in Channel ${target}`);
					// AddFileds
					if (coua && coua.length !== 0) {
						embedCOU.addFields(
							{ name: "Granted:", value: `${coua}`, inline: true }
						);
					}
					if (coud && coud.length !== 0) {
						embedCOU.addFields(
							{ name: "Revoked:", value: `${coud}`, inline: true }
						);
					}
					if (changeCOUAllow[0].new === 0 || changeCOUDeny[0].new === 0) {
						embedCOU.addFields(
							{ name: "Resetted to Default:", value: ".", inline: true }
						);
					}
					if (dataAuditLogIDCOU == null) {
						// Bot
						if (executor.bot === true) {
							embedCOU.setFooter({ text: `BotID: ${executor.id}` })
								.setTimestamp(new Date());
							dataAuditLogIDCOU = { AuditLogID: `${id}`, GuildID: `${newChannel.guild.id}`, Type: "Channel_Update", Date: `${channelOverwriteUpdate.createdTimestamp}` };
							Set.auditLogs(dataAuditLogIDCOU);
							// eslint-disable-next-line no-undef
							globalclient.channels.cache.get(logChannel).send({ embeds: [embedCOU] });
						} else
						// Member
							if (executor.bot != true) {
								embedCOU.setFooter({ text: `MemberID: ${executor.id}` })
									.setTimestamp(new Date());
								dataAuditLogIDCOU = { AuditLogID: `${id}`, GuildID: `${newChannel.guild.id}`, Type: "Channel_Update", Date: `${channelOverwriteUpdate.createdTimestamp}` };
								Set.auditLogs(dataAuditLogIDCOU);
								// eslint-disable-next-line no-undef
								globalclient.channels.cache.get(logChannel).send({ embeds: [embedCOU] });
							}
					}
				}
			}
		}
		let dataAuditLogDate;
		// eslint-disable-next-line prefer-const
		dataAuditLogDate = Get.allAuditLogs("Channel_Update");
		if (dataAuditLogDate != null && dataAuditLogDate.length < 4) {
			return;
		} else {
			dataAuditLogDate.forEach(date => {
				const dtRemove = DateTime.now().minus({ days: 20 });
				const timeNew = dtRemove.toMillis();
				if (timeNew >= date.Date) {
					Del.auditLogs(date.AuditLogID);
				}
			});
		}
	}
};