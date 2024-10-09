const { EmbedBuilder, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.GuildScheduledEventUserRemove,
	description: "Log removed Event interest.",
	once: false,
	async execute(guildScheduledEvent, user) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(guildScheduledEvent.guildId);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Main Body
		let icon2 = user.avatarURL();
		if (user.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
		const memberLeave = new EmbedBuilder()
			.setAuthor({ name: `${user.tag} (ID: ${user.id})`, iconURL: `${icon2}` })
			.setColor(Application.colors().logEmbedColor.update)
			.setDescription(LanguageConvert.lang(langLogs.event.isnotinterested, user, guildScheduledEvent.name))
			.setFooter({ text: "EventUserRemove" })
			.setTimestamp(new Date());
		// eslint-disable-next-line no-undef
		globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
	}
};