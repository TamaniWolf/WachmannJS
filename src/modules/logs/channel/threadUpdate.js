/* eslint-disable max-len */
const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.ThreadUpdate,
	description: "Log edited Threads.",
	once: false,
	async execute(oldThread, newThread) {
		const { Application } = require("../../../tools/core.js");
		const { Utils, DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		const { DateTime } = require("luxon");
		const { Get, Set, Del } = require("../../../tools/db.js");
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(newThread.guild.id);
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(newThread.guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// AuditLog Fetch
		const fetchedLogsTU = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.ThreadUpdate
		});
		const threadUpdateLog = fetchedLogsTU.entries.first();

		// Main Body
		let dataAuditLogIDCU;
		if (threadUpdateLog != null) {
			dataAuditLogIDCU = Get.auditLogsByID("auditlog", threadUpdateLog.id);
		}
		const { targetType, actionType, executor, changes, id, target } = threadUpdateLog;
		if (dataAuditLogIDCU == null || id !== dataAuditLogIDCU.AuditLogID) {
			if (targetType === "Thread" && actionType === "Update") {
				const changeName = changes.filter(function(obj) {
					return obj.key === "name";
				});
				const changeLocked = changes.filter(function(obj) {
					return obj.key === "locked";
				});
				const changeType = changes.filter(function(obj) {
					return obj.key === "type";
				});
				const changeArchived = changes.filter(function(obj) {
					return obj.key === "archived";
				});
				const changeRLPU = changes.filter(function(obj) {
					return obj.key === "rate_limit_per_user";
				});
				const changeDAAD = changes.filter(function(obj) {
					return obj.key === "auto_archive_duration";
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
					.setDescription(LanguageConvert.lang(langLogs.channel.editthread, target))
					.setFooter({ text: "ThreadUpdate" });
				// Old
				if (changeName && changeName.length !== 0) { cuo += `**${langLogs.channel.name}:** ${changeName[0].old}\n`; }
				if (changeLocked && changeLocked.length !== 0) { cuo += `**${langLogs.channel.locked}:** ${changeLocked[0].old}\n`; }
				if (changeType && changeType.length !== 0) {
					const chaType = await Utils.channel_type_name(changeType[0].old);
					cuo += `**${langLogs.channel.type}:** ${chaType}\n`;
				}
				if (changeArchived && changeArchived.length !== 0) { cuo += `**${langLogs.channel.archived}:** ${changeArchived[0].old}\n`; }
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
				if (changeLocked && changeLocked.length !== 0) { cun += `**${langLogs.channel.locked}:** ${changeLocked[0].new}\n`; }
				if (changeType && changeType.length !== 0) {
					const chaType = await Utils.channel_type_name(changeType[0].new);
					cun += `**${langLogs.channel.type}:** ${chaType}\n`;
				}
				if (changeArchived && changeArchived.length !== 0) { cun += `**${langLogs.channel.archived}:** ${changeArchived[0].new}\n`; }
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
						dataAuditLogIDCU = { AuditLogID: `${id}`, GuildID: `${newThread.guild.id}`, ShardID: `${newThread.guild.shardId}`, Type: "Thread_Update", Date: `${threadUpdateLog.createdTimestamp}` };
						Set.auditLogsByData("auditlog", dataAuditLogIDCU);
						// eslint-disable-next-line no-undef
						globalclient.channels.cache.get(logChannel).send({ embeds: [embedCU] });
					} else
						// Member
						if (executor.bot != true) {
							embedCU.setTimestamp(new Date());
							dataAuditLogIDCU = { AuditLogID: `${id}`, GuildID: `${newThread.guild.id}`, ShardID: `${newThread.guild.shardId}`, Type: "Thread_Update", Date: `${threadUpdateLog.createdTimestamp}` };
							Set.auditLogsByData("auditlog", dataAuditLogIDCU);
							// eslint-disable-next-line no-undef
							globalclient.channels.cache.get(logChannel).send({ embeds: [embedCU] });
						}
				}
			}
		}
		let dataAuditLogDate;
		// eslint-disable-next-line prefer-const
		dataAuditLogDate = Get.auditLogsAllByType("auditlog", "Thread_Update");
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