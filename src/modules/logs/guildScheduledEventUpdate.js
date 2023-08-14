/* eslint-disable no-inline-comments */
const { EmbedBuilder, AuditLogEvent } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: "guildScheduledEventUpdate",
	description: "Loggin bot's beeing added to the server.",
	call: "on", // client.once = 'once', client.on = 'on'
	async execute(oldGuildScheduledEvent, newGuildScheduledEvent) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel();
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
			if(executor.avatar == null) {
				icon2 = "attachment://discord_logo_gray.png";
			}
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
			if (mappedTitle.length && mappedTitle[0].old && mappedTitle[0].old.length !== 0) { oldData += `**Title:** ${mappedTitle[0].old}\n`; }
			if (mappedDescription.length && mappedDescription[0].old && mappedDescription[0].old.length !== 0) { oldData += `**Description:** ${mappedDescription[0].old}\n`; }
			if (mappedStart.length && mappedStart[0].old && mappedStart[0].old.length !== 0) { oldData += `**Start:** ${mappedStart[0].old}\n`; }
			if (mappedEnd.length && mappedEnd[0].old && mappedEnd[0].old.length !== 0) { oldData += `**End:** ${mappedEnd[0].old}\n`; }
			if (mappedLocation.length && mappedLocation[0].old && mappedLocation[0].old.length !== 0) { oldData += `**Location:** ${mappedLocation[0].old}\n`; }
			if (mappedImage.length && mappedImage[0].old && mappedImage[0].old.length !== 0) { oldData += "**Cover Image:** The Old Cover Image.\n"; }
			if (mappedStatus.length && mappedStatus[0].old && mappedStatus[0].old.length !== 0) {
				let statusTextOld;
				if (mappedStatus[0].old === 1) { statusTextOld = "Scheduled"; } // SCHEDULED
				if (mappedStatus[0].old === 2) { statusTextOld = "Started"; } // ACTIVE
				if (mappedStatus[0].old === 3) { statusTextOld = "Ended"; } // COMPLETED
				if (mappedStatus[0].old === 4) { statusTextOld = "Canceled"; } // CANCELED
				oldData += `**Status:** ${statusTextOld}\n`;
			}
			if (mappedTitle.length && mappedTitle[0].new && mappedTitle[0].new.length !== 0) { newData += `**Title:** ${mappedTitle[0].new}\n`; }
			if (mappedDescription.length && mappedDescription[0].new && mappedDescription[0].new.length !== 0) { newData += `**Description:** ${mappedDescription[0].new}\n`; }
			if (mappedStart.length && mappedStart[0].new && mappedStart[0].new.length !== 0) { newData += `**Start:** ${mappedStart[0].new}\n`; }
			if (mappedEnd.length && mappedEnd[0].new && mappedEnd[0].new.length !== 0) { newData += `**End:** ${mappedEnd[0].new}\n`; }
			if (mappedLocation.length && mappedLocation[0].new && mappedLocation[0].new.length !== 0) { newData += `**Location:** ${mappedLocation[0].new}\n`; }
			if (mappedImage.length && mappedImage[0].new && mappedImage[0].new.length !== 0) { newData += "**Cover Image:** The New Cover Image.\n"; }
			if (mappedStatus.length && mappedStatus[0].new && mappedStatus[0].new.length !== 0) {
				let statusTextNew;
				if (mappedStatus[0].new === 1) { statusTextNew = "Scheduled"; } // SCHEDULED
				if (mappedStatus[0].new === 2) { statusTextNew = "Started"; } // ACTIVE
				if (mappedStatus[0].new === 3) { statusTextNew = "Ended"; } // COMPLETED
				if (mappedStatus[0].new === 4) { statusTextNew = "Canceled"; } // CANCELED
				newData += `**Status:** ${statusTextNew}\n`;
			}
			const gseu = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
				.setColor("Blue")
				.setDescription(`${executor} **Updated** Event \`${target.name}\``)
				.addFields(
					{ name: "Old:", value: `${oldData}`, inline: true },
					{ name: "New:", value: `${newData}`, inline: true }
				)
				.setFooter({ text: `MemberID: ${target.id}` })
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