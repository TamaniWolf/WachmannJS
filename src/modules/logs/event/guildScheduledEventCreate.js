const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.GuildScheduledEventCreate,
	description: "Log created Events.",
	once: false,
	async execute(guildScheduledEvent) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(guildScheduledEvent.guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Fetch Auditlog
		const fetchedLogs = await guildScheduledEvent.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.GuildScheduledEventCreate
		});
		const botLog = fetchedLogs.entries.first();

		// Main Body
		const { targetType, actionType, executor, target } = botLog;

		if (targetType === "GuildScheduledEvent" && actionType === "Create") {
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
						location = target.entityMetadata.location;
					}
			// ENDING TIME
			const a1 = target.scheduledStartTimestamp / 1000;
			const startTsInSec = a1.toString().split(".");
			const a2 = target.scheduledEndTimestamp / 1000;
			const endTsInSec = a2.toString().split(".");
			let end = `<t:${endTsInSec[0]}:f>`;
			if (target.scheduledEndTimestamp == null) {
				end = `${langLogs.hoste}`;
			}
			// IMAGE
			let coverImage = target.coverImageURL();
			if (target.image == null) {
				coverImage = "https://i.imgur.com/CN6k8gB.png";
			}
			const memberLeave = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.create)
				.setDescription(LanguageConvert.lang(langLogs.event.createdevent, target.name))
				.addFields(
					{ name: `${langLogs.event.title}`, value: `${target.name}` },
					{ name: `${langLogs.event.description}`, value: `${target.description}` },
					{ name: `${langLogs.event.start}`, value: `<t:${startTsInSec[0]}:f>`, inline: true },
					{ name: `${langLogs.event.end}`, value: end, inline: true },
					{ name: `${langLogs.event.location}`, value: `${location}` }
				)
				.setImage(coverImage)
				.setFooter({ text: "EventCreate" })
				.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
		}
	}
};