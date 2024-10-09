/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
const { DateTime } = require("luxon");
require("dotenv").config();

module.exports = {
	name: Events.StageInstanceCreate,
	description: "Log Stage Instance Create.",
	once: false,
	async execute(stageInstance) {
		// console.log("stageInstanceCreate.js");
		// console.log(stageInstance);

		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(stageInstance.guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Fetch Auditlog
		const fetchedLogs = await stageInstance.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.StageInstanceCreate
		});
		const botLog = fetchedLogs.entries.first();

		// Main Body
		const { targetType, actionType, executor, target } = botLog;

		if (targetType !== "StageInstance" && actionType !== "Create") return;
		let icon2 = executor.avatarURL();
		if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
		const timestamp = DateTime.utc().toUnixInteger();
		const stageCreate = new EmbedBuilder()
			.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
			.setColor(Application.colors().logEmbedColor.create)
			.setDescription(LanguageConvert.lang(langLogs.voice.stagestart, target.channelId, timestamp))
			.addFields(
				{ name: langLogs.all.topic, value: `${target.topic}`, inline: true },
				{ name: langLogs.voice.privacylvl, value: `${target.privacyLevel}`, inline: true },
				{ name: langLogs.voice.discoverables, value: `${target.discoverableDisabled}`, inline: true },
				{ name: langLogs.voice.eventid, value: `${target.guildScheduledEventId}`, inline: true }
			)
			.setFooter({ text: "StageInstanceCreate" })
			.setTimestamp(new Date());
		// eslint-disable-next-line no-undef
		globalclient.channels.cache.get(logChannel).send({ embeds: [stageCreate] });
	}
};