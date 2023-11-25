const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.GuildStickerDelete,
	description: "Log deleted Stickers.",
	call: "on",
	async execute(sticker) {
		const { Application } = require("../../core/application/Application");
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(sticker.guild.id);
		if (logChannel === "0") return;
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(sticker.guild.id);
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.StickerDelete
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
		const { actionType, executor } = log;
		let icon2 = executor.avatarURL();
		if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
		if (actionType === "Delete") {
			const channelName = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.delete)
				.setDescription(LanguageConvert.lang(lang.logs.deleteemoji, `\`${sticker.name}\` (ID: ${sticker.id})`))
				.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [channelName] });
		}
	}
};