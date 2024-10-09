const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.GuildStickerUpdate,
	description: "Log edited Stickers.",
	once: false,
	async execute(oldSticker, newSticker) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(newSticker.guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Fetch AuditLog
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(newSticker.guild.id);
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.StickerUpdate
		});
		const log = fetchedLogs.entries.first();

		// Main Body
		if (log == null) return;
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
			if (changeName && changeName.length !== 0) { suo += `**${langLogs.all.name}** ${changeName[0].old}\n`; }
			if (changeDescription && changeDescription.length !== 0) { suo += `**${langLogs.all.description}** ${changeDescription[0].old}\n`; }
			if (changeTags && changeTags.length !== 0) { suo += `**${langLogs.all.tag}** ${changeTags[0].old}\n`; }
			if (changeName && changeName.length !== 0) { sun += `**${langLogs.all.name}** ${changeName[0].new}\n`; }
			if (changeDescription && changeDescription.length !== 0) { sun += `**${langLogs.all.description}** ${changeDescription[0].new}\n`; }
			if (changeTags && changeTags.length !== 0) { sun += `**${langLogs.all.tag}** ${changeTags[0].new}\n`; }
			const sticker = await guild.stickers.fetch(target.id);
			const threadUpdate = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.update);

			threadUpdate.setDescription(LanguageConvert.lang(langLogs.expression.editsticker, `\`${sticker.name}\` (ID: ${sticker.id})`))
				.addFields(
					{ name: langLogs.all.before, value: suo, inline: true },
					{ name: langLogs.all.after, value: sun, inline: true }
				)
				.setFooter({ text: "StickerUpdate" })
				.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [threadUpdate] });

		}
	}
};