/* eslint-disable no-inline-comments */
const { EmbedBuilder, AuditLogEvent } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: "roleUpdate",
	description: "Loggin bot's beeing added to the server.",
	call: "on", // client.once = 'once', client.on = 'on'
	async execute(oldRole, newRole) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel();
		const { DateTime } = require("luxon");
		const PermissionConvert = require("../../tools/functions/permissionConvert.js");
		const ColorConvert = require("../../tools/functions/colorConvert.js");
		// SQLite
		const { Get, Set, Del } = require("../../tools/functions/sqlite/prepare");
		// AuditLog Fetch
		if (newRole.guild.id !== process.env.SERVER_ID) return;
		const fetchedLogs = await newRole.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.RoleUpdate
		});
		const botLog = fetchedLogs.entries.first();
		// Data Null
		let dataAuditLogID;
		// Data Get
		if (botLog == null) {return;}
		dataAuditLogID = Get.auditLogs(botLog.id);
		// Context
		const { targetType, actionType, executor, changes, id, target } = botLog;
		const createdTimestampLog = botLog.createdTimestamp;
		const dt = DateTime.now().minus({ seconds: 5 });
		const time = dt.toMillis();
		if (time > createdTimestampLog) {
			dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${newRole.guild.id}`, Type: "Role_Update", Date: `${botLog.createdTimestamp}` };
		}
		if(targetType === "Role" || actionType === "Update") {
			const changeName = changes.filter(function(obj) {
				return obj.key === "name";
			});
			const changeHoist = changes.filter(function(obj) {
				return obj.key === "hoist";
			});
			const changeMention = changes.filter(function(obj) {
				return obj.key === "mentionable";
			});
			const changeColor = changes.filter(function(obj) {
				return obj.key === "color";
			});
			const changePermissions = changes.filter(function(obj) {
				return obj.key === "permissions";
			});
			let ruo = ""; // Role Update Old
			let runew = ""; // Role Update New
			// Embed
			let icon2 = executor.avatarURL();
			if(executor.avatar == null) {
				icon2 = "attachment://discord_logo_gray.png";
			}
			const embedCU = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
				.setColor("Blue")
				.setDescription(`${executor} **Changed** Role ${target}'s settings`);
			// Old
			if (changeName && changeName.length !== 0) { ruo += `**Name:** ${changeName[0].old}\n`; }
			if (changeColor && changeColor.length !== 0) {
				const colorOld = await ColorConvert.IntToHex(changeColor[0].old);
				ruo += `**Color:** ${colorOld}\n`;
			}
			if (changeHoist && changeHoist.length !== 0) { ruo += `**Display:** ${changeHoist[0].old}\n`; }
			if (changeMention && changeMention.length !== 0) { ruo += `**Mentionable:** ${changeMention[0].old}\n`; }
			if (changePermissions && changePermissions.length !== 0) {
				const permOld = await PermissionConvert.permissionsBitField(changePermissions[0].old);
				ruo += `**Permissions:**\n${permOld}\n`;
				// ruo += `**Permissions:** ${changePermissions[0].old}\n`;
			}
			// New
			if (changeName && changeName.length !== 0) { runew += `**Name:** ${changeName[0].new}\n`; }
			if (changeColor && changeHoist.length !== 0 && changeColor[0]) {
				const colorNew = await ColorConvert.IntToHex(changeColor[0].new);
				runew += `**Color:** ${colorNew}\n`;
			}
			if (changeHoist && changeHoist.length !== 0) { runew += `**Display:** ${changeHoist[0].new}\n`; }
			if (changeMention && changeMention.length !== 0) { runew += `**Mentionable:** ${changeMention[0].new}\n`; }
			if (changePermissions && changePermissions.length !== 0) {
				const permNew = await PermissionConvert.permissionsBitField(changePermissions[0].new);
				runew += `**Permissions:**\n${permNew}\n`;
				// runew += `**Permissions:** ${changePermissions[0].new}\n`;
			}
			// AddFileds
			if (ruo && ruo.length !== 0) {
				embedCU.addFields(
					{ name: "Old:", value: `${ruo}`, inline: true }
				);
			}
			if (runew && runew.length !== 0) {
				embedCU.addFields(
					{ name: "New:", value: `${runew}`, inline: true }
				);
			}
			if (dataAuditLogID == null) {
				// Bot
				if (executor.bot === true) {
					embedCU.setFooter({ text: `BotID: ${executor.id}` })
						.setTimestamp(new Date());
					dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${newRole.guild.id}`, Type: "Role_Update", Date: `${botLog.createdTimestamp}` };
					Set.auditLogs(dataAuditLogID);
					// eslint-disable-next-line no-undef
					globalclient.channels.cache.get(logChannel).send({ embeds: [embedCU] });
				} else
				// Member
					if (executor.bot != true) {
						embedCU.setFooter({ text: `MemberID: ${executor.id}` })
							.setTimestamp(new Date());
						dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${newRole.guild.id}`, Type: "Role_Update", Date: `${botLog.createdTimestamp}` };
						Set.auditLogs(dataAuditLogID);
						// eslint-disable-next-line no-undef
						globalclient.channels.cache.get(logChannel).send({ embeds: [embedCU] });
					}
			}
		}
		let dataAuditLogDate;
		// eslint-disable-next-line prefer-const
		dataAuditLogDate = Get.allAuditLogs("Role_Update");
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

/*
2199023255551
*/