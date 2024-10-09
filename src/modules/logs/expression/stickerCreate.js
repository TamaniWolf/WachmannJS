const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.GuildStickerCreate,
	description: "Log created Stickers.",
	once: false,
	async execute(sticker) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		const getGuildID = sticker.guild.id;
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(getGuildID);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Fetch AuditLog
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(getGuildID);
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.StickerCreate
		});
		const log = fetchedLogs.entries.first();

		// Main Body
		if (log == null) return;
		const { actionType, executor, target } = log;
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
			// if (changeName && changeName.length !== 0) { sun += `**${langLogs.all.name}:** ${changeName[0].new}\n`; }
			// if (changeDescription && changeDescription.length !== 0) { sun += `**${langLogs.all.description}:** ${changeDescription[0].new}\n`; }
			// if (changeTags && changeTags.length !== 0) { sun += `**${langLogs.all.tag}:** ${changeTags[0].new}\n`; }
			const sticker = await guild.stickers.fetch(target.id);
			// console.log(sticker);
			const channelName = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.create)
				.setDescription(LanguageConvert.lang(langLogs.expression.createsticker, `\`${sticker.name}\` (ID: ${sticker.id})`))
				.setFooter({ text: "StickerCreate" })
				.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [channelName] });
		}
	}
};