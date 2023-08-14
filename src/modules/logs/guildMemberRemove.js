/* eslint-disable no-inline-comments */
const { EmbedBuilder, AuditLogEvent } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: "guildMemberRemove",
	description: "Loggin bot's beeing added to the server.",
	call: "on", // client.once = 'once', client.on = 'on'
	async execute(member) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel();
		// SQLite
		const { DateTime } = require("luxon");
		const { Get, Set, Del } = require("../../tools/functions/sqlite/prepare");
		// Fetch Auditlog
		// eslint-disable-next-line no-undef
		if (member.user.id === globalclient.user.id) return;
		const fetchedLogs = await member.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MemberKick
		});
		const kickLog = fetchedLogs.entries.first();
		// Data Null
		let dataAuditLogID;
		// Embed
		const memberLeave = new EmbedBuilder()
			.setColor("Orange")
			.setTimestamp(new Date());
		// Member no AuditLog
		if (kickLog == null) {
			let icon2 = member.user.avatarURL();
			if(member.user.avatar == null) {
				icon2 = "attachment://discord_logo_gray.png";
			}
			memberLeave.setAuthor({ name: `${member.user.username}${member.user.discriminator}`, iconURL: `${icon2}` })
				.setDescription(`<@${member.user.id}> **Left** the server`)
				.setFooter({ text: `MemberID: ${member.user.id}` });
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
			return;
		}
		// Data Get
		dataAuditLogID = Get.auditLogs(kickLog.id);
		// Context
		const { reason, executor, id, target } = kickLog;
		const createdTimestampLog = kickLog.createdTimestamp;
		const dt = DateTime.now().minus({ seconds: 5 });
		const time = dt.toMillis();
		if (time > createdTimestampLog) {
			dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${member.guild.id}`, Type: "Kick", Date: `${kickLog.createdTimestamp}` };
		}

		// Member
		if (target.id !== member.user.id || dataAuditLogID != null) {
			let icon2 = member.user.avatarURL();
			if(member.user.avatar == null) {
				icon2 = "attachment://discord_logo_gray.png";
			}
			memberLeave.setAuthor({ name: `${member.user.username}${member.user.discriminator}`, iconURL: `${icon2}` })
				.setDescription(`<@${member.user.id}> **Left** the server`)
				.setFooter({ text: `MemberID: ${member.user.id}` });
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
		}
		if (target.id === member.user.id && dataAuditLogID == null) {
			let icon2 = executor.avatarURL();
			if(executor.avatar == null) {
				icon2 = "attachment://discord_logo_gray.png";
			}
			memberLeave.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
				.setDescription(`${target} got **Kicked** out by ${executor}`)
				.setFooter({ text: `MemberID: ${target.id}` });
			if (target.id === member.user.id && reason != null) {
				memberLeave.addFields(
					{ name: "**Reason:**", value: `${reason}` }
				);
			}
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
			dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${member.guild.id}`, Type: "Kick", Date: `${kickLog.createdTimestamp}` };
			Set.auditLogs(dataAuditLogID);
		}
		let dataAuditLogDate;
		// eslint-disable-next-line prefer-const
		dataAuditLogDate = Get.allAuditLogs("Kick");
		if (dataAuditLogDate.length < 4) {
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