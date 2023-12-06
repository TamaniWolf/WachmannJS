const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.GuildEmojiUpdate,
	description: "Log edited Emojis.",
	once: false,
	async execute(oldEmoji, newEmoji) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(newEmoji.guild.id);
		if (logChannel === "0") return;
		const { Application } = require("../../core/application/Application");
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(newEmoji.guild.id);
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.EmojiUpdate
		});
		const log = fetchedLogs.entries.first();
		// Data Check
		if (logChannel === "100000000000000000") {
			return;
		}
		// Context
		const { Get } = require("../../tools/functions/sqlite/prepare");
		const getBotConfigID = `${guild.id}-${guild.shard.id}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { LanguageConvert } = require("../../tools/functions/languageConvert");
		if (log == null) {
			return;
		}
		const { actionType, executor, target } = log;
		let icon2 = executor.avatarURL();
		if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
		if (actionType === "Update") {
			const emoji = await guild.emojis.fetch(target.id);
			const channelName = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.update);
			if (target.animated === false) {
				channelName.setDescription(LanguageConvert.lang(lang.logs.editemoji, emoji))
					.addFields(
						{ name: `${lang.logs.before}:`, value: `\`:${oldEmoji.name}:\`` },
						{ name: `${lang.logs.after}:`, value: `\`:${newEmoji.name}:\`` }
					)
					.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [channelName] });
			}
			if (target.animated === true) {
				const channelName = new EmbedBuilder()
					.setDescription(LanguageConvert.lang(lang.logs.editanimatedemoji, emoji))
					.addFields(
						{ name: `${lang.logs.before}:`, value: `\`:${oldEmoji.name}:\`` },
						{ name: `${lang.logs.after}:`, value: `\`:${newEmoji.name}:\`` }
					)
					.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [channelName] });
			}
		}
	}
};