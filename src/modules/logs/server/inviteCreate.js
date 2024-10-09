const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.InviteCreate,
	description: "Log created Invites.",
	once: false,
	async execute(invite) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		// Log channel
		const logChannel = await DevCheck.forLogChannel(invite.guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		// const getBotConfigID = `${invite.guild.id}-${invite.guild.shard.id}`;
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Fetch AuditLog
		const fetchedLogs = await invite.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.InviteCreate
		});
		const botLog = fetchedLogs.entries.first();

		// Main Body
		const { executor, target } = botLog;
		let icon2 = executor.avatarURL();
		if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
		const memberLeave = new EmbedBuilder()
			.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
			.setColor(Application.colors().logEmbedColor.create)
			.setDescription(LanguageConvert.lang(langLogs.server.invitecode, langLogs.all.create, target.code, target.channel))
			.setFooter({ text: "InviteDelete" })
			.setTimestamp(new Date());
		// eslint-disable-next-line no-undef
		globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
	}
};