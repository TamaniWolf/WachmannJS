const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.GuildEmojiDelete,
	description: "Log deleted Emojis.",
	once: false,
	async execute(emoji) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(emoji.guild.id);
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(emoji.guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Fetch AuditLog
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.EmojiDelete
		});
		const log = fetchedLogs.entries.first();

		// Main Body
		if (log == null) return;
		const { actionType, executor } = log;
		let icon2 = executor.avatarURL();
		if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
		if (actionType === "Delete") {
			const channelName = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.delete)
				.setDescription(LanguageConvert.lang(langLogs.expression.deleteemoji, emoji.name))
				.setFooter({ text: "EmojiDelete" })
				.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [channelName] });
		}
	}
};