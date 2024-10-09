const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.ChannelPinsUpdate,
	description: "Log Created/Deleted Pins.",
	once: false,
	// eslint-disable-next-line no-unused-vars
	async execute(channel, time) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(channel.guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Fetch AuditLog
		// MessagePin
		const pinLogs = await channel.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MessagePin
		});
		const firstEntriePin = pinLogs.entries.first();
		// MessageUnpin
		const unpinLogs = await channel.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MessageUnpin
		});
		const firstEntrieUnpin = unpinLogs.entries.first();

		// Main Body
		const logembed = new EmbedBuilder()
			.setColor(Application.colors().logEmbedColor.update)
			.setFooter({ text: "ChannelPinsUpdate" })
			.setTimestamp(new Date());

		let cpup;
		let cpuup;
		// eslint-disable-next-line no-unused-vars
		if (firstEntriePin != null) {cpup = 0;} else {cpup = firstEntriePin;}
		// eslint-disable-next-line no-unused-vars
		if (firstEntrieUnpin != null) {cpuup = 0;} else {cpuup = firstEntrieUnpin;}

		if (firstEntriePin.createdTimestamp > firstEntrieUnpin.createdTimestamp) {
			const { executor, extra, target } = firstEntriePin;
			let iconPin = executor.avatarURL();
			if (executor.avatar == null) iconPin = "https://i.imgur.com/CN6k8gB.png";
			logembed.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${iconPin}` })
				// eslint-disable-next-line max-len
				.setDescription(LanguageConvert.lang(langLogs.channel.pin, langLogs.channel.message, channel.guild.id, extra.channel.id, extra.messageId, target, channel.guild.id));
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [logembed] });
		}
		if (firstEntriePin.createdTimestamp < firstEntrieUnpin.createdTimestamp) {
			const { executor, extra, target } = firstEntrieUnpin;
			let iconUnpin = executor.avatarURL();
			if (executor.avatar == null) iconUnpin = "https://i.imgur.com/CN6k8gB.png";
			logembed.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${iconUnpin}` })
				// eslint-disable-next-line max-len
				.setDescription(LanguageConvert.lang(langLogs.channel.unpin, langLogs.channel.message, channel.guild.id, extra.channel.id, extra.messageId, target, channel.guild.id));
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [logembed] });
		}
	}
};