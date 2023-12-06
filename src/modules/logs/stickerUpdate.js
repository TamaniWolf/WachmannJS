const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.GuildStickerUpdate,
	description: "Log edited Stickers.",
	once: false,
	async execute(oldSticker, newSticker) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(newSticker.guild.id);
		if (logChannel === "0") return;
		const { Application } = require("../../core/application/Application");
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(newSticker.guild.id);
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.StickerUpdate
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
		// console.log(changes);
		let icon2 = executor.avatarURL();
		if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
		if (actionType === "Update") {
			const changeName = changes.filter(function(obj) {
				return obj.key === "name";
			});
			const changeDescription = changes.filter(function(obj) {
				return obj.key === "description";
			});
			const changeTags = changes.filter(function(obj) {
				return obj.key === "tags";
			});
			let suo = "";
			let sun = "";
			if (changeName && changeName.length !== 0) { suo += `**${lang.logs.name}** ${changeName[0].old}\n`; }
			if (changeDescription && changeDescription.length !== 0) { suo += `**${lang.logs.description}** ${changeDescription[0].old}\n`; }
			if (changeTags && changeTags.length !== 0) { suo += `**${lang.logs.tag}** ${changeTags[0].old}\n`; }
			if (changeName && changeName.length !== 0) { sun += `**${lang.logs.name}** ${changeName[0].new}\n`; }
			if (changeDescription && changeDescription.length !== 0) { sun += `**${lang.logs.description}** ${changeDescription[0].new}\n`; }
			if (changeTags && changeTags.length !== 0) { sun += `**${lang.logs.tag}** ${changeTags[0].new}\n`; }
			const sticker = await guild.stickers.fetch(target.id);
			const threadUpdate = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.update);

			threadUpdate.setDescription(LanguageConvert.lang(lang.logs.editemoji, `\`${sticker.name}\` (ID: ${sticker.id})`))
				.addFields(
					{ name: lang.logs.before, value: suo, inline: true },
					{ name: lang.logs.after, value: sun, inline: true }
				)
				.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [threadUpdate] });

		}
	}
};