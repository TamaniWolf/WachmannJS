const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.GuildMemberRemove,
	description: "Log kicked/lefting Members.",
	once: false,
	async execute(member) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		const { DateTime } = require("luxon");
		const { Get, Set, Del } = require("../../../tools/db.js");
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(member.guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Fetch Auditlog
		// eslint-disable-next-line no-undef
		if (member.user.id === globalclient.user.id) return;
		const fetchedLogs = await member.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MemberKick
		});
		const kickLog = fetchedLogs.entries.first();

		// Main Body
		let dataAuditLogID;
		// Embed
		const memberLeave = new EmbedBuilder()
			.setColor(Application.colors().logEmbedColor.delete)
			.setFooter({ text: "MemberRemove" })
			.setTimestamp(new Date());
		// Member no AuditLog
		if (kickLog == null) {
			let icon2 = member.user.avatarURL();
			if (member.user.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			let oldNewTag;
			if (member.user.discriminator === "0") oldNewTag = `@${member.user.username}`;
			if (member.user.discriminator !== "0") oldNewTag = `@${member.user.username}#${member.user.discriminator}`;
			memberLeave.setAuthor({ name: oldNewTag, iconURL: icon2 })
				.setDescription(LanguageConvert.lang(langLogs.member.lefted, member.user.id));
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
			return;
		}
		// Data Get
		dataAuditLogID = Get.auditLogsByID("auditlog", kickLog.id);
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
				.setDescription(LanguageConvert.lang(langLogs.member.lefted, member.user.id));
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
		}
		if (target.id === member.user.id && dataAuditLogID == null) {
			let icon2 = executor.avatarURL();
			if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			memberLeave.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setDescription(LanguageConvert.lang(langLogs.member.kicked, target, reason));
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
			dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${member.guild.id}`, ShardID: `${member.guild.shardId}`, Type: "Kick", Date: `${kickLog.createdTimestamp}` };
			Set.auditLogsByData("auditlog", dataAuditLogID);
		}
		let dataAuditLogDate;
		// eslint-disable-next-line prefer-const
		dataAuditLogDate = Get.auditLogsAllByType("auditlog", "Kick");
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