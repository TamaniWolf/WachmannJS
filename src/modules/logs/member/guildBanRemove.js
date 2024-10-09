const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.GuildBanRemove,
	description: "Log deleted Bans.",
	once: false,
	async execute(ban) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(ban.guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Fetch AuditLog
		const fetchedLogs = await ban.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MemberBanRemove
		});
		const banLog = fetchedLogs.entries.first();

		// Main Body
		const { executor, target } = banLog;
		let icon2 = executor.avatarURL();
		if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";

		const embedBanRemove = new EmbedBuilder()
			.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
			.setColor(Application.colors().logEmbedColor.unban)
			.setDescription(LanguageConvert.lang(langLogs.member.unban, target))
			.setFooter({ text: "BanRemove" })
			.setTimestamp(new Date());
		if (target.id === ban.user.id) {
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [embedBanRemove] });
		}
	}
};