const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.MessageBulkDelete,
	description: "Log bulk deleted Messages.",
	call: "on",
	async execute(messages) {
		const { Application } = require("../../core/application/Application");
		const { DevCheck } = require("../../tools/functions/devCheck");
		const { DateTime } = require("luxon");
		// SQLite
		const { Get, Set, Del } = require("../../tools/functions/sqlite/prepare");
		const msgs = messages.map(function(obj) {
			return obj;
		});
		const getGuildID = msgs[0].guildId;
		const logChannel = await DevCheck.LogChannel(getGuildID);
		if (logChannel === "0") return;
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(getGuildID);
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MessageBulkDelete
		});
		const botLog = fetchedLogs.entries.first();
		const getBotConfigID = `${guild.id}-${guild.shard.id}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { LanguageConvert } = require("../../tools/functions/languageConvert");
		const { executor, id, extra } = botLog;
		// Data Null
		let dataAuditLog;
		// Data Get
		dataAuditLog = Get.auditLogs(botLog.id);
		const MessageDelEmbed = new EmbedBuilder()
			.setColor(Application.colors().logEmbedColor.delete)
			.setTimestamp(new Date());

		let icon2 = executor.avatarURL();
		if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
		if (dataAuditLog.AuditLogID === id && dataAuditLog.Count < extra.count) {
			// Highter counter + New Message
			MessageDelEmbed.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setDescription(LanguageConvert.lang(lang.logs.bulkdeleted2, messages.size, msgs[0].channelId));
			dataAuditLog = { AuditLogID: `${id}`, GuildID: `${getGuildID}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
			Set.auditLogs(dataAuditLog);
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [MessageDelEmbed] });
		}
		if (dataAuditLog == null) {
			// New AuditLog Entry + New Message
			MessageDelEmbed.setAuthor({ name: `@${executor.username} (ID ${executor.id})`, iconURL: icon2 })
				.setDescription(LanguageConvert.lang(lang.logs.bulkdeleted1, messages.size, msgs[0].channelId));
			dataAuditLog = { AuditLogID: `${id}`, GuildID: `${getGuildID}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
			Set.auditLogs(dataAuditLog);
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [MessageDelEmbed] });
		}
		const dataAuditLogDate = Get.allAuditLogs("Message_Delete");
		if (dataAuditLogDate.length < 4) {
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