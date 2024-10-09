const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.GuildScheduledEventUpdate,
	description: "Log edited Events.",
	once: false,
	async execute(oldGuildScheduledEvent, newGuildScheduledEvent) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		const { DateTime } = require("luxon");
		const { Get, Set, Del } = require("../../../tools/db.js");
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(newGuildScheduledEvent.guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Fetch Auditlog
		const fetchedLogs = await newGuildScheduledEvent.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.GuildScheduledEventUpdate
		});
		const botLog = fetchedLogs.entries.first();

		// Main Body
		let dataAuditLogID;
		dataAuditLogID = Get.auditLogsByID("auditlog", botLog.id);
		if (dataAuditLogID != null) {return;}
		const { targetType, actionType, executor, changes, id, target } = botLog;
		const createdTimestampLog = botLog.createdTimestamp;
		const dt = DateTime.now().minus({ seconds: 5 });
		const time = dt.toMillis();
		if (time > createdTimestampLog) {
			dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${newGuildScheduledEvent.guild.id}`, Type: "Event_Update", Date: `${botLog.createdTimestamp}` };
		}
		if (targetType === "GuildScheduledEvent" && actionType === "Update") {
			let icon2 = executor.avatarURL();
			if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			// Filter by Key
			const mappedTitle = changes.filter(function(obj) {
				return obj.key === "name";
			});
			const mappedDescription = changes.filter(function(obj) {
				return obj.key === "description";
			});
			const mappedStart = changes.filter(function(obj) {
				return obj.key === "start";
			});
			const mappedEnd = changes.filter(function(obj) {
				return obj.key === "end";
			});
			const mappedLocation = changes.filter(function(obj) {
				return obj.key === "location";
			});
			const mappedImage = changes.filter(function(obj) {
				return obj.key === "image_hash";
			});
			const mappedStatus = changes.filter(function(obj) {
				return obj.key === "status";
			});
			let oldData = "";
			let newData = "";
			if (mappedTitle.length && mappedTitle[0].old && mappedTitle[0].old.length !== 0) oldData += `**${langLogs.event.title}** ${mappedTitle[0].old}\n`;
			if (mappedDescription.length && mappedDescription[0].old && mappedDescription[0].old.length !== 0) oldData += `**${langLogs.event.description}** ${mappedDescription[0].old}\n`;
			if (mappedStart.length && mappedStart[0].old && mappedStart[0].old.length !== 0) oldData += `**${langLogs.event.start}** ${mappedStart[0].old}\n`;
			if (mappedEnd.length && mappedEnd[0].old && mappedEnd[0].old.length !== 0) oldData += `**${langLogs.event.end}** ${mappedEnd[0].old}\n`;
			if (mappedLocation.length && mappedLocation[0].old && mappedLocation[0].old.length !== 0) oldData += `**${langLogs.event.location}** ${mappedLocation[0].old}\n`;
			// eslint-disable-next-line max-len
			if (mappedImage.length && mappedImage[0].old && mappedImage[0].old.length !== 0) oldData += LanguageConvert.lang(langLogs.event.coverimage, langLogs.all.old);
			if (mappedStatus.length && mappedStatus[0].old && mappedStatus[0].old.length !== 0) {
				let statusTextOld;
				// SCHEDULED
				if (mappedStatus[0].old === 1) statusTextOld = `${langLogs.event.scheduled}`;
				// ACTIVE
				if (mappedStatus[0].old === 2) statusTextOld = `${langLogs.event.started}`;
				// COMPLETED
				if (mappedStatus[0].old === 3) statusTextOld = `${langLogs.event.ended}`;
				// CANCELED
				if (mappedStatus[0].old === 4) statusTextOld = `${langLogs.event.canceled}`;
				oldData += LanguageConvert.lang(langLogs.event.startus, statusTextOld);
			}
			if (mappedTitle.length && mappedTitle[0].new && mappedTitle[0].new.length !== 0) newData += `**${langLogs.event.title}** ${mappedTitle[0].new}\n`;
			if (mappedDescription.length && mappedDescription[0].new && mappedDescription[0].new.length !== 0) newData += `**${langLogs.event.description}** ${mappedDescription[0].new}\n`;
			if (mappedStart.length && mappedStart[0].new && mappedStart[0].new.length !== 0) newData += `**${langLogs.event.start}** ${mappedStart[0].new}\n`;
			if (mappedEnd.length && mappedEnd[0].new && mappedEnd[0].new.length !== 0) newData += `**${langLogs.event.end}** ${mappedEnd[0].new}\n`;
			if (mappedLocation.length && mappedLocation[0].new && mappedLocation[0].new.length !== 0) newData += `**${langLogs.event.location}** ${mappedLocation[0].new}\n`;
			// eslint-disable-next-line max-len
			if (mappedImage.length && mappedImage[0].new && mappedImage[0].new.length !== 0) newData += LanguageConvert.lang(langLogs.event.coverimage, langLogs.all.new);
			if (mappedStatus.length && mappedStatus[0].new && mappedStatus[0].new.length !== 0) {
				let statusTextNew;
				// SCHEDULED
				if (mappedStatus[0].new === 1) statusTextNew = `${langLogs.event.scheduled}`;
				// ACTIVE
				if (mappedStatus[0].new === 2) statusTextNew = `${langLogs.event.started}`;
				// COMPLETED
				if (mappedStatus[0].new === 3) statusTextNew = `${langLogs.event.ended}`;
				// CANCELED
				if (mappedStatus[0].new === 4) statusTextNew = `${langLogs.event.canceled}`;
				newData += LanguageConvert.lang(langLogs.event.startus, statusTextNew);
			}
			const gseu = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.update)
				.setDescription(LanguageConvert.lang(langLogs.event.editevent, target.name))
				.addFields(
					{ name: `${langLogs.all.old}`, value: `${oldData}`, inline: true },
					{ name: `${langLogs.all.new}`, value: `${newData}`, inline: true }
				)
				.setFooter({ text: "EventUpdate" })
				.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [gseu] });
			dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${newGuildScheduledEvent.guild.id}`, ShardID: `${newGuildScheduledEvent.guild.shardId}`, Type: "Event_Update", Date: `${botLog.createdTimestamp}` };
			Set.auditLogsByData("auditlog", dataAuditLogID);
		}
		let dataAuditLogDate;
		// eslint-disable-next-line prefer-const
		dataAuditLogDate = Get.auditLogsAllByType("auditlog", "Event_Update");
		if (dataAuditLogDate != null && dataAuditLogDate.length < 4) {
			return;
		} else {
			dataAuditLogDate.forEach(date => {
				const dtRemove = DateTime.now().minus({ days: 20 });
				const timeNew = dtRemove.toMillis();
				if (timeNew >= date.Date) {
					Del.auditLogsByID("auditlog", date.AuditLogID);
				}
			});
		}
	}
};