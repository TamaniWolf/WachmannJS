const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.GuildRoleDelete,
	description: "Log deleted Roles.",
	call: "on",
	async execute(role) {
		const { Application } = require("../../core/application/Application");
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(role.guild.id);
		const { Get, Set, Del } = require("../../tools/functions/sqlite/prepare");
		const { DateTime } = require("luxon");

		// AuditLog Fetch
		// eslint-disable-next-line no-undef
		if (role.tags.botId === globalclient.user.id) return;
		const fetchedLogs = await role.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.RoleDelete
		});
		const roleLog = fetchedLogs.entries.first();

		let dataAuditLogID;
		let icon2 = "";
		const getBotConfigID = `${role.guild.id}-${role.guild.shard.id}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { LanguageConvert } = require("../../tools/functions/languageConvert");

		dataAuditLogID = Get.auditLogs(roleLog.id);
		const { executor, changes, id } = roleLog;

		const roleDelete = new EmbedBuilder()
			.setColor(Application.colors().logEmbedColor.delete);

		if (dataAuditLogID == null) {
			icon2 = executor.avatarURL();
			if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";

			const changeName = changes.filter(function(obj) {
				return obj.key === "name";
			});

			roleDelete.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: icon2 })
				.setDescription(LanguageConvert.lang(lang.logs.deletedrole, changeName[0].old, roleLog.targetId))
				.setTimestamp(new Date());
			dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${role.guild.id}`, Type: "Role_Delete", Date: `${roleLog.createdTimestamp}` };
			Set.auditLogs(dataAuditLogID);
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [roleDelete] });
		}

		let dataAuditLogDate;
		// eslint-disable-next-line prefer-const
		dataAuditLogDate = Get.allAuditLogs("Role_Delete");
		if (dataAuditLogDate != null && dataAuditLogDate.length < 4) return;
		dataAuditLogDate.forEach(date => {
			const dtRemove = DateTime.now().minus({ days: 20 });
			const timeNew = dtRemove.toMillis();
			if (timeNew >= date.Date) {
				Del.auditLogs(date.AuditLogID);
			}
		});
	}
};