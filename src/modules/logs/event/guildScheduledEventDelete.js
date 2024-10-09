const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.GuildScheduledEventDelete,
	description: "Log deleted Event.",
	once: false,
	async execute(guildScheduledEvent) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(guildScheduledEvent.guildId);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Fetch Auditlog
		const fetchedLogs = await guildScheduledEvent.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.GuildScheduledEventDelete
		});
		const botLog = fetchedLogs.entries.first();

		// Main Body
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
						location = `${langLogs.event.externalevent}`;
					}
			const memberLeave = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.delete)
				.setDescription(LanguageConvert.lang(langLogs.event.cancelevent, target.name))
				.addFields(
					{ name: `${langLogs.event.description}`, value: `${target.description}` },
					{ name: `${langLogs.event.location}`, value: `${location}` }
				)
				.setFooter({ text: "EventDelete" })
				.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
		}
	}
};