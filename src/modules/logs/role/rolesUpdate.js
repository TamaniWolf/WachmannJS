const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.GuildRoleUpdate,
	description: "Log edited Roles.",
	once: false,
	async execute(oldRole, newRole) {
		const { DateTime } = require("luxon");
		const { Utils, DevCheck, LanguageConvert, PermissionConvert } = require("../../../tools/utils.js");
		const { Get, Set, Del } = require("../../../tools/db.js");
		const { Application } = require("../../../tools/core.js");
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(newRole.guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Fetch AuditLog
		const fetchedLogs = await newRole.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.RoleUpdate
		});
		const botLog = fetchedLogs.entries.first();

		// Main Body
		let dataAuditLogID;
		let icon2 = "";
		dataAuditLogID = Get.auditLogsByID("auditlog", botLog.id);
		const { targetType, actionType, executor, changes, id, target } = botLog;

		const roleUpdate = new EmbedBuilder()
			.setColor(Application.colors().logEmbedColor.update);

		const createdTimestampLog = botLog.createdTimestamp;
		const dt = DateTime.now().minus({ seconds: 5 });
		const time = dt.toMillis();
		if (time > createdTimestampLog) {
			dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${newRole.guild.id}`, Type: "Role_Update", Date: `${botLog.createdTimestamp}` };
		}
		if (targetType === "Role" || actionType === "Update") {
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
			// Role Update New
			let runew = "";
			// Embed
			icon2 = executor.avatarURL();
			if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			roleUpdate.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: icon2 })
				.setDescription(`Edited Role ${target}`);
			// New
			if (changeName && changeName.length !== 0) runew += LanguageConvert.lang(langLogs.role.name, changeName[0].old, changeName[0].new);
			if (changeColor && changeColor.length !== 0 && changeColor[0]) {
				const colorOld = Utils.convert_color_code("int", changeColor[0].old);
				const colorNew = Utils.convert_color_code("int", changeColor[0].new);
				runew += LanguageConvert.lang(langLogs.role.color, colorOld, colorNew);
			}
			if (changeHoist && changeHoist.length !== 0) runew += LanguageConvert.lang(langLogs.role.display, changeHoist[0].new);
			if (changeMention && changeMention.length !== 0) runew += LanguageConvert.lang(langLogs.role.mentionable, changeMention[0].new);

			if (runew && runew.length !== 0) {
				roleUpdate.addFields(
					{ name: "___", value: `${runew}`, inline: false }
				);
			}

			if (changePermissions && changePermissions.length !== 0) {
				const permissions = await PermissionConvert.permissions(changePermissions[0].old, changePermissions[0].new);
				const permRevok = await PermissionConvert.permissionsNames(permissions.revoked);
				const permGrant = await PermissionConvert.permissionsNames(permissions.granted);
				roleUpdate.addFields(
					{ name: langLogs.role.revoked, value: `${permRevok}`, inline: true },
					{ name: langLogs.role.granted, value: `${permGrant}`, inline: true }
				);
			}

			if (dataAuditLogID == null) {
				roleUpdate.setFooter({ text: "RolesUpdate" })
					.setTimestamp(new Date());
				dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${newRole.guild.id}`, ShardID: `${newRole.guild.shardId}`, Type: "Role_Update", Date: `${botLog.createdTimestamp}` };
				Set.auditLogsByData("auditlog", dataAuditLogID);
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [roleUpdate] });
			}
		}
		let dataAuditLogDate;
		// eslint-disable-next-line prefer-const
		dataAuditLogDate = Get.auditLogsAllByType("auditlog", "Role_Update");
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

/*
2199023255551
*/