const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.GuildMemberRemove,
	description: "Log kicked/lefting Members.",
	once: false,
	async execute(member) {
		const { Application } = require("../../core/application/Application");
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(member.guild.id);
		if (logChannel === "0") return;
		// SQLite
		const { DateTime } = require("luxon");
		const { Get, Set, Del } = require("../../tools/functions/sqlite/prepare");
		// Fetch Auditlog
		// eslint-disable-next-line no-undef
		if (member.user.id === globalclient.user.id) return;
		const fetchedLogs = await member.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MemberKick
		});
		const kickLog = fetchedLogs.entries.first();
		// Data Null
		let dataAuditLogID;
		const getBotConfigID = `${member.guild.id}-${member.guild.shard.id}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { LanguageConvert } = require("../../tools/functions/languageConvert");
		// Embed
		const memberLeave = new EmbedBuilder()
			.setColor(Application.colors().logEmbedColor.delete)
			.setTimestamp(new Date());
		// Member no AuditLog
		if (kickLog == null) {
			let icon2 = member.user.avatarURL();
			if (member.user.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			let oldNewTag;
			if (member.user.discriminator === "0") oldNewTag = `@${member.user.username}`;
			if (member.user.discriminator !== "0") oldNewTag = `@${member.user.username}#${member.user.discriminator}`;
			memberLeave.setAuthor({ name: oldNewTag, iconURL: icon2 })
				.setDescription(LanguageConvert.lang(lang.logs.lefted, member.user.id));
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
			return;
		}
		// Data Get
		dataAuditLogID = Get.auditLogs(kickLog.id);
		// Context
		const { reason, executor, id, target } = kickLog;
		const createdTimestampLog = kickLog.createdTimestamp;
		const dt = DateTime.now().minus({ seconds: 5 });
		const time = dt.toMillis();
		if (time > createdTimestampLog) {
			dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${member.guild.id}`, Type: "Kick", Date: `${kickLog.createdTimestamp}` };
		}

		// Member
		if (target.id !== member.user.id || dataAuditLogID != null) {
			let icon2 = member.user.avatarURL();
			if (member.user.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			memberLeave.setAuthor({ name: `${member.user.username}${member.user.discriminator}`, iconURL: `${icon2}` })
				.setDescription(LanguageConvert.lang(lang.logs.lefted, member.user.id));
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
		}
		if (target.id === member.user.id && dataAuditLogID == null) {
			let icon2 = executor.avatarURL();
			if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			memberLeave.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setDescription(LanguageConvert.lang(lang.logs.kicked, target, reason));
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
			dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${member.guild.id}`, Type: "Kick", Date: `${kickLog.createdTimestamp}` };
			Set.auditLogs(dataAuditLogID);
		}
		let dataAuditLogDate;
		// eslint-disable-next-line prefer-const
		dataAuditLogDate = Get.allAuditLogs("Kick");
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