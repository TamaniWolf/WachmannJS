const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.GuildScheduledEventDelete,
	description: "Log deleted Event.",
	call: "on",
	async execute(guildScheduledEvent) {
		const { Application } = require("../../core/application/Application");
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(guildScheduledEvent.guildId);
		if (logChannel === "0") return;
		// Fetch Auditlog
		const fetchedLogs = await guildScheduledEvent.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.GuildScheduledEventDelete
		});
		const botLog = fetchedLogs.entries.first();
		// Data Check
		const { Get } = require("../../tools/functions/sqlite/prepare");
		const getBotConfigID = `${guildScheduledEvent.guild.id}-${guildScheduledEvent.guild.shard.id}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { LanguageConvert } = require("../../tools/functions/languageConvert");
		const { targetType, actionType, executor, target } = botLog;
		if (targetType === "GuildScheduledEvent" && actionType === "Delete") {
			let icon2 = executor.avatarURL();
			if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			let location;
			// STAGE_INSTANCE
			if (target.entityType === 1) {
				// eslint-disable-next-line no-undef
				const channel = await globalclient.channels.fetch(target.channelId);
				location = channel;
			} else
			// VOICE
				if (target.entityType === 2) {
					// eslint-disable-next-line no-undef
					const channel = await globalclient.channels.fetch(target.channelId);
					location = channel;
				} else
				// EXTERNAL
					if (target.entityType === 3) {
						location = `${lang.logs.externalevent}`;
					}
			const memberLeave = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.delete)
				.setDescription(LanguageConvert.lang(lang.logs.cancelevent, target.name))
				.addFields(
					{ name: `${lang.logs.description}`, value: `${target.description}` },
					{ name: `${lang.logs.location}`, value: `${location}` }
				)
				.setFooter({ text: `${lang.logs.memberid} ${target.id}` })
				.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
		}
	}
};