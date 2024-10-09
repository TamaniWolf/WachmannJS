/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
const { DateTime } = require("luxon");
require("dotenv").config();

module.exports = {
	name: Events.StageInstanceUpdate,
	description: "Log Stage Instance Update.",
	once: false,
	async execute(oldStageInstance, newStageInstance) {
		// console.log("stageInstanceUpdate.js");
		// console.log(oldStageInstance);
		// console.log(newStageInstance);

		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(newStageInstance.guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Fetch Auditlog
		const fetchedLogs = await newStageInstance.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.StageInstanceUpdate
		});
		const botLog = fetchedLogs.entries.first();

		// Main Body
		const { targetType, actionType, executor, changes, target } = botLog;
		if (targetType !== "StageInstance" && actionType !== "Update") return;

		let icon2 = executor.avatarURL();
		if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
		const timestamp = DateTime.utc().toUnixInteger();

		const mappedTopic = changes.filter(function(obj) {
			return obj.key === "topic";
		});

		const stageUpdate = new EmbedBuilder()
			.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
			.setColor(Application.colors().logEmbedColor.create)
			.setDescription(LanguageConvert.lang(langLogs.voice.stageupdate, target.channelId, timestamp))
			.addFields(
				{ name: langLogs.all.old, value: `${mappedTopic[0].old}`, inline: false },
				{ name: langLogs.all.new, value: `${mappedTopic[0].new}`, inline: false }
			);
		stageUpdate.setFooter({ text: "StageInstanceCreate" })
			.setTimestamp(new Date());
		// eslint-disable-next-line no-undef
		globalclient.channels.cache.get(logChannel).send({ embeds: [stageUpdate] });
	}
};