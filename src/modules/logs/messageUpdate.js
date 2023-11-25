const { EmbedBuilder, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.MessageUpdate,
	description: "Log edited Messages.",
	call: "on",
	async execute(oldMessage, newMessage) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(newMessage.guildId);
		if (logChannel === "0") return;
		const { Application } = require("../../core/application/Application");
		// Data Get
		let mumid;
		const getGuildIDOld = oldMessage.guildId;
		const getGuildIDNew = newMessage.guildId;
		if (getGuildIDOld != null) {mumid = getGuildIDNew;} else {mumid = getGuildIDOld;}
		// eslint-disable-next-line no-unused-vars
		if (getGuildIDNew != null) {mumid = getGuildIDOld;} else {mumid = getGuildIDNew;}
		// Data Check
		const { Get } = require("../../tools/functions/sqlite/prepare");
		const getBotConfigID = `${mumid.id}-${mumid.shardId}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { LanguageConvert } = require("../../tools/functions/languageConvert");
		if (process.env.LOGGING_BOTS === "false") {
			if (oldMessage.author.bot === true || newMessage.author.bot === true) {
				return;
			}
		}
		// Old Message
		if (oldMessage.content) {
			if (newMessage.content == null || oldMessage.content === newMessage.content) {
				return;
			}
			let before = oldMessage.content;
			let after = newMessage.content;
			if (before.length > 1024) {
				const slcbef = before.slice(1020);
				const rplcbef = before.replace(slcbef, "...");
				before = rplcbef;
			}
			if (after.length > 1024) {
				const slcaft = after.slice(1020);
				const rplcaft = after.replace(slcaft, "...");
				after = rplcaft;
			}
			if (newMessage.content == null) {
				after = `*${lang.logs.uncached}*`;
			}
			let icon2 = oldMessage.author.avatarURL();
			if (oldMessage.author.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			const embed = new EmbedBuilder()
				.setAuthor({ name: `${oldMessage.author.tag} (ID: ${oldMessage.author.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.update)
				// eslint-disable-next-line max-len
				.setDescription(LanguageConvert.lang(lang.logs.msgedited, oldMessage.guild.id, oldMessage.channel.id, oldMessage.id, oldMessage.author.username, oldMessage.channel))
				.addFields([
					{ name: `${lang.logs.before}`, value: `${before}` },
					{ name: `${lang.logs.after}`, value: `${after}` }
				])
				.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [embed] });
		} else
		// New Message
			if (newMessage.content) {
				if (newMessage.content == null || newMessage.content === oldMessage.content) {
					return;
				}
				let before = oldMessage.content || "";
				let after = newMessage.content || "";
				if (before) {return;}
				if (after) {return;}
				if (before.length > 1024) {
					const slcbef = before.slice(1020);
					const rplcbef = before.replace(slcbef, "...");
					before = rplcbef;
				}
				if (after.length > 1024) {
					const slcaft = after.slice(1020);
					const rplcaft = after.replace(slcaft, "...");
					after = rplcaft;
				}
				if (oldMessage.content == null) {
					before = `*${lang.logs.uncached}*`;
				}
				let icon2 = newMessage.author.avatarURL();
				if (newMessage.author.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
				const embed = new EmbedBuilder()
					.setAuthor({ name: `${newMessage.author.tag} (ID: ${newMessage.author.id})`, iconURL: `${icon2}` })
					.setColor(Application.colors().logEmbedColor.update)
					// eslint-disable-next-line max-len
					.setDescription(LanguageConvert.lang(lang.logs.msgedited, newMessage.guild.id, newMessage.channel.id, newMessage.id, newMessage.author.username, newMessage.channel))
					.addFields([
						{ name: `${lang.logs.before}`, value: `${before}`, inline: true },
						{ name: `${lang.logs.after}`, value: `${after}`, inline: true }
					])
					.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [embed] });
			}
	}
};