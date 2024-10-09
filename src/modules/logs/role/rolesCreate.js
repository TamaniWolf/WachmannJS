const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.GuildRoleCreate,
	description: "Log created Roles.",
	once: false,
	async execute(role) {
		const { Application } = require("../../../tools/core.js");
		const { Utils, DevCheck, LanguageConvert, PermissionConvert } = require("../../../tools/utils.js");
		const { Get, Set, Del } = require("../../../tools/db.js");
		const { DateTime } = require("luxon");
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(role.guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// AuditLog Fetch
		const fetchedLogs = await role.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.RoleCreate
		});
		const roleLog = fetchedLogs.entries.first();

		// Main Body
		let dataAuditLogID;
		let icon2 = "";
		dataAuditLogID = Get.auditLogsByID("auditlog", roleLog.id);
		const { executor, changes, id, target } = roleLog;

		const roleCreate = new EmbedBuilder()
			.setColor(Application.colors().logEmbedColor.create);

		const changeName = changes.filter(function(obj) {
			return obj.key === "name";
		});
		const changePermissions = changes.filter(obj => {
			return obj.key === "permissions";
		});
		const changeColor = changes.filter(obj => {
			return obj.key === "color";
		});
		const changeHoist = changes.filter(obj => {
			return obj.key === "hoist";
		});
		const changeMention = changes.filter(obj => {
			return obj.key === "mentionable";
		});

		let rcnew = "";

		if (changeName && changeName.length !== 0 && changeName[0].new !== "new role") rcnew += `**${langLogs.role.name}** \`${changeName[0].new}\`\n`;
		if (changeColor && changeColor.length !== 0 && changeColor[0].new !== "0") {
			const colorNew = Utils.convert_color_code("int", changeColor[0].new);
			rcnew += `**${langLogs.role.color}** \`#${colorNew}\`\n`;
		}
		if (changeHoist && changeHoist.length !== 0) rcnew += `**${langLogs.role.display}** ${changeHoist[0].new}\n`;
		if (changeMention && changeMention.length !== 0) rcnew += `**${langLogs.role.mentionable}** ${changeMention[0].new}\n`;

		if (rcnew && rcnew.length !== 0) {
			roleCreate.addFields(
				{ name: "___", value: `${rcnew}`, inline: false }
			);
		}

		if (changePermissions && changePermissions.length !== 0 && changePermissions[0].new !== "0") {
			const permissions = await PermissionConvert.permissions(changePermissions[0].old, changePermissions[0].new);
			const permRevok = await PermissionConvert.permissionsNames(permissions.revoked);
			const permGrant = await PermissionConvert.permissionsNames(permissions.granted);
			roleCreate.addFields(
				{ name: `${langLogs.role.revoked}`, value: `${permRevok}`, inline: true },
				{ name: `${langLogs.role.granted}`, value: `${permGrant}`, inline: true }
			);
		}

		if (changeName[0].new !== "new role" || changePermissions[0].new !== "0"
		|| changeColor[0].new !== "0" || changeHoist[0].new !== "false"
		|| changeMention[0].new !== "false") roleCreate.setDescription(LanguageConvert.lang(langLogs.role.createpreset, target, target.id));

		if (changeName[0].new === "new role" || changePermissions[0].new === "0"
		|| changeColor[0].new === "0" || changeHoist[0].new === "false"
		|| changeMention[0].new === "false") roleCreate.setDescription(LanguageConvert.lang(langLogs.role.create, target, target.id));

		if (dataAuditLogID == null) {
			icon2 = executor.avatarURL();
			if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";

			roleCreate.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: icon2 })
				.setFooter({ text: "RolesCreate" })
				.setTimestamp(new Date());
			dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${role.guild.id}`, ShardID: `${role.guild.shardId}`, Type: "Role_Create", Date: `${roleLog.createdTimestamp}` };
			Set.auditLogsByData("auditlog", dataAuditLogID);
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [roleCreate] });
		}

		let dataAuditLogDate;
		// eslint-disable-next-line prefer-const
		dataAuditLogDate = Get.auditLogsByID("auditlog", "Role_Create");
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