const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.GuildScheduledEventUpdate,
	description: "Log edited Events.",
	call: "on",
	async execute(oldGuildScheduledEvent, newGuildScheduledEvent) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(newGuildScheduledEvent.guild.id);
		if (logChannel === "0") return;
		const { Application } = require("../../core/application/Application");
		// SQLite
		const { DateTime } = require("luxon");
		const { Get, Set, Del } = require("../../tools/functions/sqlite/prepare");
		// Fetch Auditlog
		const fetchedLogs = await newGuildScheduledEvent.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.GuildScheduledEventUpdate
		});
		const botLog = fetchedLogs.entries.first();
		// Data Null
		let dataAuditLogID;
		// Data Get
		dataAuditLogID = Get.auditLogs(botLog.id);
		// Data Check
		const getBotConfigID = `${newGuildScheduledEvent.guild.id}-${newGuildScheduledEvent.guild.shard.id}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { LanguageConvert } = require("../../tools/functions/languageConvert");
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
			if (mappedTitle.length && mappedTitle[0].old && mappedTitle[0].old.length !== 0) oldData += `**${lang.logs.title}** ${mappedTitle[0].old}\n`;
			if (mappedDescription.length && mappedDescription[0].old && mappedDescription[0].old.length !== 0) oldData += `**${lang.logs.description}** ${mappedDescription[0].old}\n`;
			if (mappedStart.length && mappedStart[0].old && mappedStart[0].old.length !== 0) oldData += `**${lang.logs.start}** ${mappedStart[0].old}\n`;
			if (mappedEnd.length && mappedEnd[0].old && mappedEnd[0].old.length !== 0) oldData += `**${lang.logs.end}** ${mappedEnd[0].old}\n`;
			if (mappedLocation.length && mappedLocation[0].old && mappedLocation[0].old.length !== 0) oldData += `**${lang.logs.location}** ${mappedLocation[0].old}\n`;
			// eslint-disable-next-line max-len
			if (mappedImage.length && mappedImage[0].old && mappedImage[0].old.length !== 0) oldData += LanguageConvert.lang(lang.logs.coverimage, lang.logs.old);
			if (mappedStatus.length && mappedStatus[0].old && mappedStatus[0].old.length !== 0) {
				let statusTextOld;
				// SCHEDULED
				if (mappedStatus[0].old === 1) statusTextOld = `${lang.logs.scheduled}`;
				// ACTIVE
				if (mappedStatus[0].old === 2) statusTextOld = `${lang.logs.started}`;
				// COMPLETED
				if (mappedStatus[0].old === 3) statusTextOld = `${lang.logs.ended}`;
				// CANCELED
				if (mappedStatus[0].old === 4) statusTextOld = `${lang.logs.canceled}`;
				oldData += LanguageConvert.lang(lang.logs.startus, statusTextOld);
			}
			if (mappedTitle.length && mappedTitle[0].new && mappedTitle[0].new.length !== 0) newData += `**${lang.logs.title}** ${mappedTitle[0].new}\n`;
			if (mappedDescription.length && mappedDescription[0].new && mappedDescription[0].new.length !== 0) newData += `**${lang.logs.description}** ${mappedDescription[0].new}\n`;
			if (mappedStart.length && mappedStart[0].new && mappedStart[0].new.length !== 0) newData += `**${lang.logs.start}** ${mappedStart[0].new}\n`;
			if (mappedEnd.length && mappedEnd[0].new && mappedEnd[0].new.length !== 0) newData += `**${lang.logs.end}** ${mappedEnd[0].new}\n`;
			if (mappedLocation.length && mappedLocation[0].new && mappedLocation[0].new.length !== 0) newData += `**${lang.logs.location}** ${mappedLocation[0].new}\n`;
			// eslint-disable-next-line max-len
			if (mappedImage.length && mappedImage[0].new && mappedImage[0].new.length !== 0) newData += LanguageConvert.lang(lang.logs.coverimage, lang.logs.new);
			if (mappedStatus.length && mappedStatus[0].new && mappedStatus[0].new.length !== 0) {
				let statusTextNew;
				// SCHEDULED
				if (mappedStatus[0].new === 1) statusTextNew = `${lang.logs.scheduled}`;
				// ACTIVE
				if (mappedStatus[0].new === 2) statusTextNew = `${lang.logs.started}`;
				// COMPLETED
				if (mappedStatus[0].new === 3) statusTextNew = `${lang.logs.ended}`;
				// CANCELED
				if (mappedStatus[0].new === 4) statusTextNew = `${lang.logs.canceled}`;
				newData += LanguageConvert.lang(lang.logs.startus, statusTextNew);
			}
			const gseu = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.update)
				.setDescription(LanguageConvert.lang(lang.logs.editevent, target.name))
				.addFields(
					{ name: `${lang.logs.old}`, value: `${oldData}`, inline: true },
					{ name: `${lang.logs.new}`, value: `${newData}`, inline: true }
				)
				.setFooter({ text: `${lang.logs.memberid} ${target.id}` })
				.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [gseu] });
			dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${newGuildScheduledEvent.guild.id}`, Type: "Event_Update", Date: `${botLog.createdTimestamp}` };
			Set.auditLogs(dataAuditLogID);
		}
		let dataAuditLogDate;
		// eslint-disable-next-line prefer-const
		dataAuditLogDate = Get.allAuditLogs("Event_Update");
		if (dataAuditLogDate != null && dataAuditLogDate.length < 4) {
			return;
		} else {
			dataAuditLogDate.forEach(date => {
				const dtRemove = DateTime.now().minus({ days: 20 });
				const timeNew = dtRemove.toMillis();
				if (timeNew >= date.Date) {
					Del.auditLogs(date.AuditLogID);
				}
			});
		}
	}
};