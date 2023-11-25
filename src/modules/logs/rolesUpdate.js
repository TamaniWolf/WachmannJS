const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.GuildRoleUpdate,
	description: "Log edited Roles.",
	call: "on",
	async execute(oldRole, newRole) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(newRole.guild.id);
		const { DateTime } = require("luxon");
		const PermissionConvert = require("../../tools/functions/permissionConvert.js");
		const ColorConvert = require("../../tools/functions/colorConvert.js");
		const { Get, Set, Del } = require("../../tools/functions/sqlite/prepare");
		const { Application } = require("../../core/application/Application");

		const fetchedLogs = await newRole.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.RoleUpdate
		});
		const botLog = fetchedLogs.entries.first();

		let dataAuditLogID;
		let icon2 = "";
		dataAuditLogID = Get.auditLogs(botLog.id);
		const getBotConfigID = `${newRole.guild.id}-${newRole.guild.shard.id}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { LanguageConvert } = require("../../tools/functions/languageConvert");
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
			if (changeName && changeName.length !== 0) runew += LanguageConvert.lang(lang.logs.namechange, changeName[0].old, changeName[0].new);
			if (changeColor && changeColor.length !== 0 && changeColor[0]) {
				const colorOld = await ColorConvert.IntToHex(changeColor[0].old);
				const colorNew = await ColorConvert.IntToHex(changeColor[0].new);
				runew += LanguageConvert.lang(lang.logs.colorchange, colorOld, colorNew);
			}
			if (changeHoist && changeHoist.length !== 0) runew += LanguageConvert.lang(lang.logs.displaychange, changeHoist[0].new);
			if (changeMention && changeMention.length !== 0) runew += LanguageConvert.lang(lang.logs.mentionable, changeMention[0].new);

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
					{ name: `${lang.logs.revoked}`, value: `${permRevok}`, inline: true },
					{ name: `${lang.logs.granted}`, value: `${permGrant}`, inline: true }
				);
			}

			if (dataAuditLogID == null) {
				roleUpdate.setTimestamp(new Date());
				dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${newRole.guild.id}`, Type: "Role_Update", Date: `${botLog.createdTimestamp}` };
				Set.auditLogs(dataAuditLogID);
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [roleUpdate] });
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