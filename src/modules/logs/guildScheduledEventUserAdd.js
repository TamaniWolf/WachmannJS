const { EmbedBuilder, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.GuildScheduledEventUserAdd,
	description: "Log Added Event interest.",
	once: false,
	async execute(guildScheduledEvent, user) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(guildScheduledEvent.guildId);
		if (logChannel === "0") return;
		const { Application } = require("../../core/application/Application");
		// SQLite
		const { Get } = require("../../tools/functions/sqlite/prepare");
		const getBotConfigID = `${guildScheduledEvent.guild.id}-${guildScheduledEvent.guild.shard.id}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { LanguageConvert } = require("../../tools/functions/languageConvert");
		let icon2 = user.avatarURL();
		if (user.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
		const memberLeave = new EmbedBuilder()
			.setAuthor({ name: `${user.tag} (ID: ${user.id})`, iconURL: `${icon2}` })
			.setColor(Application.colors().logEmbedColor.update)
			.setDescription(LanguageConvert.lang(lang.logs.isinterested, user, guildScheduledEvent.name))
			.setTimestamp(new Date());
		// eslint-disable-next-line no-undef
		globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
	}
};