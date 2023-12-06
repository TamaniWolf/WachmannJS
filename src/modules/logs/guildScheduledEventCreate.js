const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.GuildScheduledEventCreate,
	description: "Log created Events.",
	once: false,
	async execute(guildScheduledEvent) {
		const { Application } = require("../../core/application/Application");
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(guildScheduledEvent.guild.id);
		if (logChannel === "0") return;
		// Fetch Auditlog
		const fetchedLogs = await guildScheduledEvent.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.GuildScheduledEventCreate
		});
		const botLog = fetchedLogs.entries.first();
		// Context
		const { Get } = require("../../tools/functions/sqlite/prepare");
		const getBotConfigID = `${guildScheduledEvent.guild.id}-${guildScheduledEvent.guild.shard.id}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { LanguageConvert } = require("../../tools/functions/languageConvert");
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
				end = `${lang.logs.hoste}`;
			}
			// IMAGE
			let coverImage = target.coverImageURL();
			if (target.image == null) {
				coverImage = "https://i.imgur.com/CN6k8gB.png";
			}
			const memberLeave = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.create)
				.setDescription(LanguageConvert.lang(lang.logs.createdevent, target.name))
				.addFields(
					{ name: `${lang.logs.title}`, value: `${target.name}` },
					{ name: `${lang.logs.description}`, value: `${target.description}` },
					{ name: `${lang.logs.start}`, value: `<t:${startTsInSec[0]}:f>`, inline: true },
					{ name: `${lang.logs.end}`, value: end, inline: true },
					{ name: `${lang.logs.location}`, value: `${location}` }
				)
				.setImage(coverImage)
				.setFooter({ text: `${lang.logs.memberid} ${target.id}` })
				.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
		}
	}
};