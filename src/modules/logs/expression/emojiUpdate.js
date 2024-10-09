const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.GuildEmojiUpdate,
	description: "Log edited Emojis.",
	once: false,
	async execute(oldEmoji, newEmoji) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(newEmoji.guild.id);
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(newEmoji.guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Fetch AuditLog
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.EmojiUpdate
		});
		const log = fetchedLogs.entries.first();

		// Main Body
		if (log == null) return;
		const { actionType, executor, target } = log;
		let icon2 = executor.avatarURL();
		if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
		if (actionType === "Update") {
			const emoji = await guild.emojis.fetch(target.id);
			const channelName = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.update)
				.setFooter({ text: "EmojiUpdate" });
			if (target.animated === false) {
				channelName.setDescription(LanguageConvert.lang(langLogs.expression.editemoji, emoji))
					.addFields(
						{ name: `${langLogs.all.before}:`, value: `\`:${oldEmoji.name}:\`` },
						{ name: `${langLogs.all.after}:`, value: `\`:${newEmoji.name}:\`` }
					)
					.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [channelName] });
			}
			if (target.animated === true) {
				const channelName = new EmbedBuilder()
					.setDescription(LanguageConvert.lang(langLogs.expression.editanimatedemoji, emoji))
					.addFields(
						{ name: `${langLogs.all.before}:`, value: `\`:${oldEmoji.name}:\`` },
						{ name: `${langLogs.all.after}:`, value: `\`:${newEmoji.name}:\`` }
					)
					.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [channelName] });
			}
		}
	}
};