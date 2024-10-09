const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.GuildBanAdd,
	description: "Log created Bans.",
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
			type: AuditLogEvent.MemberBanAdd
		});
		const log = fetchedLogs.entries.first();

		// Main Body
		const { reason, executor, target } = log;
		// eslint-disable-next-line no-undef
		let icon2 = executor.avatarURL();
		if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
		const embedBanAdd = new EmbedBuilder()
			.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
			.setColor(Application.colors().logEmbedColor.ban)
			.setDescription(LanguageConvert.lang(langLogs.member.ban, target.id, target.id, reason))
			.setFooter({ text: "BanAdd" })
			.setTimestamp(new Date());
		if (target.id === ban.user.id) {
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [embedBanAdd] });
		}
	}
};