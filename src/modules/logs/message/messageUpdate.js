const { EmbedBuilder, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.MessageUpdate,
	description: "Log edited Messages.",
	once: false,
	async execute(oldMessage, newMessage) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		// const { Get } = require("../../../tools/db.js");
		// let mumid;
		// const getGuildIDOld = oldMessage.guildId;
		// const getGuildIDNew = newMessage.guildId;
		// if (getGuildIDOld != null) {mumid = getGuildIDNew;} else {mumid = getGuildIDOld;}
		// if (getGuildIDNew != null) {mumid = getGuildIDOld;} else {mumid = getGuildIDNew;}
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(newMessage.guildId);
		if (logChannel == null || logChannel === "0") return;
		// Language
		// const getBotConfigID = `${mumid.id}-${mumid.shardId}`;
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Main Body
		// Data Check
		if (process.env.LOG_BOTS === "false") {
			if (oldMessage.author.bot === true || newMessage.author.bot === true) return;
		}
		// Old Message
		if (oldMessage.content) {
			if (newMessage.content == null || oldMessage.content === newMessage.content) return;
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
				after = `*${langLogs.message.uncached}*`;
			}
			let icon2 = oldMessage.author.avatarURL();
			if (oldMessage.author.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			const embed = new EmbedBuilder()
				.setAuthor({ name: `${oldMessage.author.tag} (ID: ${oldMessage.author.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.update)
				// eslint-disable-next-line max-len
				.setDescription(LanguageConvert.lang(langLogs.message.edit, oldMessage.guild.id, oldMessage.channel.id, oldMessage.id, oldMessage.author.username, oldMessage.channel))
				.addFields([
					{ name: `${langLogs.all.before}`, value: `${before}` },
					{ name: `${langLogs.all.after}`, value: `${after}` }
				])
				.setFooter({ text: "MessageUpdate" })
				.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [embed] });
		} else
		// New Message
			if (newMessage.content) {
				if (newMessage.content == null || newMessage.content === oldMessage.content) return;
				let before = oldMessage.content || "";
				let after = newMessage.content || "";
				if (before) return;
				if (after) return;
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
					before = `*${langLogs.message.uncached}*`;
				}
				let icon2 = newMessage.author.avatarURL();
				if (newMessage.author.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
				const embed = new EmbedBuilder()
					.setAuthor({ name: `${newMessage.author.tag} (ID: ${newMessage.author.id})`, iconURL: `${icon2}` })
					.setColor(Application.colors().logEmbedColor.update)
					// eslint-disable-next-line max-len
					.setDescription(LanguageConvert.lang(langLogs.message.edit, newMessage.guild.id, newMessage.channel.id, newMessage.id, newMessage.author.username, newMessage.channel))
					.addFields([
						{ name: `${langLogs.all.before}`, value: `${before}`, inline: true },
						{ name: `${langLogs.all.after}`, value: `${after}`, inline: true }
					])
					.setFooter({ text: "MessageUpdate" })
					.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [embed] });
			}
	}
};