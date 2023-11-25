const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.ChannelPinsUpdate,
	description: "Log Created/Deleted Pins.",
	call: "on",
	async execute(channel) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(channel.guild.id);
		if (logChannel === "0") return;
		const { Application } = require("../../core/application/Application");
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
		// Context
		const { Get } = require("../../tools/functions/sqlite/prepare");
		const getBotConfigID = `${channel.guild.id}-${channel.guild.shard.id}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { LanguageConvert } = require("../../tools/functions/languageConvert");
		const logembed = new EmbedBuilder()
			.setColor(Application.colors().logEmbedColor.update)
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
				.setDescription(LanguageConvert.lang(lang.logs.pin, lang.logs.message, channel.guild.id, extra.channel.id, extra.messageId, target, channel.guild.id));
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [logembed] });
		}
		if (firstEntriePin.createdTimestamp < firstEntrieUnpin.createdTimestamp) {
			const { executor, extra, target } = firstEntrieUnpin;
			let iconUnpin = executor.avatarURL();
			if (executor.avatar == null) iconUnpin = "https://i.imgur.com/CN6k8gB.png";
			logembed.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${iconUnpin}` })
				// eslint-disable-next-line max-len
				.setDescription(LanguageConvert.lang(lang.logs.unpin, lang.logs.message, channel.guild.id, extra.channel.id, extra.messageId, target, channel.guild.id));
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [logembed] });
		}
	}
};