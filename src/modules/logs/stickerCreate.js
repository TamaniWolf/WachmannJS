const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.GuildStickerCreate,
	description: "Log created Stickers.",
	call: "on",
	async execute(sticker) {
		const { Application } = require("../../core/application/Application");
		const { DevCheck } = require("../../tools/functions/devCheck");
		const getGuildID = sticker.guild.id;
		const logChannel = await DevCheck.LogChannel(getGuildID);
		if (logChannel === "0") return;
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(getGuildID);
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.StickerCreate
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
		const { actionType, executor, changes, target } = log;
		let icon2 = executor.avatarURL();
		if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
		if (actionType === "Create") {
			// const changeName = changes.filter(function(obj) {
			// 	return obj.key === "name";
			// });
			// const changeDescription = changes.filter(function(obj) {
			// 	return obj.key === "description";
			// });
			// const changeTags = changes.filter(function(obj) {
			// 	return obj.key === "tags";
			// });
			// let sun;
			// if (changeName && changeName.length !== 0) { sun += `**${lang.logs.name}:** ${changeName[0].new}\n`; }
			// if (changeDescription && changeDescription.length !== 0) { sun += `**${lang.logs.description}:** ${changeDescription[0].new}\n`; }
			// if (changeTags && changeTags.length !== 0) { sun += `**${lang.logs.tag}:** ${changeTags[0].new}\n`; }
			const sticker = await guild.stickers.fetch(target.id);
			// console.log(sticker);
			const channelName = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.create)
				.setDescription(LanguageConvert.lang(lang.logs.createemoji, `\`${sticker.name}\` (ID: ${sticker.id})`))
				.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [channelName] });
		}
	}
};