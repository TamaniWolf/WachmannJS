const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.MessageBulkDelete,
	description: "Log bulk deleted Messages.",
	once: false,
	async execute(messages) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		const { DateTime } = require("luxon");
		const { Get, Set, Del } = require("../../../tools/db.js");
		const msgs = messages.map(function(obj) {
			return obj;
		});
		const getGuildID = msgs[0].guildId;
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(getGuildID);
		// Log channel
		const logChannel = await DevCheck.forLogChannel(getGuildID);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Fetch AuditLog
		// eslint-disable-next-line no-undef
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MessageBulkDelete
		});
		const botLog = fetchedLogs.entries.first();

		// Main Body
		const { executor, id, extra } = botLog;
		// Data Null
		let dataAuditLog;
		// Data Get
		dataAuditLog = Get.auditLogsByID("auditlog", botLog.id);
		const MessageDelEmbed = new EmbedBuilder()
			.setColor(Application.colors().logEmbedColor.delete)
			.setFooter({ text: "MessageDeleteBulk" })
			.setTimestamp(new Date());

		let icon2 = executor.avatarURL();
		if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
		if (dataAuditLog.AuditLogID === id && dataAuditLog.Count < extra.count) {
			// Highter counter + New Message
			MessageDelEmbed.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setDescription(LanguageConvert.lang(langLogs.message.deletebulk, messages.size, msgs[0].channelId));
			dataAuditLog = { AuditLogID: `${id}`, GuildID: `${getGuildID}`, ShardID: `${guild.shardId}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
			Set.auditLogsByData("auditlog", dataAuditLog);
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [MessageDelEmbed] });
		}
		if (dataAuditLog == null) {
			// New AuditLog Entry + New Message
			MessageDelEmbed.setAuthor({ name: `@${executor.username} (ID ${executor.id})`, iconURL: icon2 })
				.setDescription(LanguageConvert.lang(langLogs.message.deletebulk, messages.size, msgs[0].channelId));
			dataAuditLog = { AuditLogID: `${id}`, GuildID: `${getGuildID}`, ShardID: `${guild.shardId}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
			Set.auditLogsByData("auditlog", dataAuditLog);
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [MessageDelEmbed] });
		}
		const dataAuditLogDate = Get.auditLogsAllByType("message_delete", "Message_Delete");
		if (dataAuditLogDate.length < 4) {
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