const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.GuildRoleCreate,
	description: "Log created Roles.",
	call: "on",
	async execute(role) {
		const { Application } = require("../../core/application/Application");
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(role.guild.id);
		const ColorConvert = require("../../tools/functions/colorConvert.js");
		const PermissionConvert = require("../../tools/functions/permissionConvert.js");
		const { Get, Set, Del } = require("../../tools/functions/sqlite/prepare");
		const { DateTime } = require("luxon");

		// AuditLog Fetch
		const fetchedLogs = await role.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.RoleCreate
		});
		const roleLog = fetchedLogs.entries.first();

		let dataAuditLogID;
		let icon2 = "";

		dataAuditLogID = Get.auditLogs(roleLog.id);
		const { executor, changes, id, target } = roleLog;
		// console.log(roleLog);
		const getBotConfigID = `${role.guild.id}-${role.guild.shard.id}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { LanguageConvert } = require("../../tools/functions/languageConvert");

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

		if (changeName && changeName.length !== 0 && changeName[0].new !== "new role") rcnew += `**${lang.logs.name}** \`${changeName[0].new}\`\n`;
		if (changeColor && changeColor.length !== 0 && changeColor[0].new !== "0") {
			const colorNew = await ColorConvert.IntToHex(changeColor[0].new);
			rcnew += `**${lang.logs.color}** \`#${colorNew}\`\n`;
		}
		if (changeHoist && changeHoist.length !== 0) rcnew += `**${lang.logs.display}** ${changeHoist[0].new}\n`;
		if (changeMention && changeMention.length !== 0) rcnew += `**${lang.logs.mentionable}** ${changeMention[0].new}\n`;

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
				{ name: `${lang.logs.revoked}`, value: `${permRevok}`, inline: true },
				{ name: `${lang.logs.granted}`, value: `${permGrant}`, inline: true }
			);
		}

		if (changeName[0].new !== "new role" || changePermissions[0].new !== "0"
		|| changeColor[0].new !== "0" || changeHoist[0].new !== "false"
		|| changeMention[0].new !== "false") roleCreate.setDescription(LanguageConvert.lang(lang.logs.createdrolepreset, target, target.id));

		if (changeName[0].new === "new role" || changePermissions[0].new === "0"
		|| changeColor[0].new === "0" || changeHoist[0].new === "false"
		|| changeMention[0].new === "false") roleCreate.setDescription(LanguageConvert.lang(lang.logs.createdrole, target, target.id));

		if (dataAuditLogID == null) {
			icon2 = executor.avatarURL();
			if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";

			roleCreate.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: icon2 })
				.setTimestamp(new Date());
			dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${role.guild.id}`, Type: "Role_Create", Date: `${roleLog.createdTimestamp}` };
			Set.auditLogs(dataAuditLogID);
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [roleCreate] });
		}

		let dataAuditLogDate;
		// eslint-disable-next-line prefer-const
		dataAuditLogDate = Get.allAuditLogs("Role_Create");
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