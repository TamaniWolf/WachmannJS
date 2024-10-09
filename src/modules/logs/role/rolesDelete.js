const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.GuildRoleDelete,
	description: "Log deleted Roles.",
	once: false,
	async execute(role) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		const { Get, Set, Del } = require("../../../tools/db.js");
		const { DateTime } = require("luxon");
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(role.guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// AuditLog Fetch
		// eslint-disable-next-line no-undef
		if (role.tags.botId === globalclient.user.id) return;
		const fetchedLogs = await role.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.RoleDelete
		});
		const roleLog = fetchedLogs.entries.first();

		// Main Body
		let dataAuditLogID;
		let icon2 = "";
		dataAuditLogID = Get.auditLogsByID("auditlog", roleLog.id);
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
				.setDescription(LanguageConvert.lang(langLogs.role.delete, changeName[0].old, roleLog.targetId))
				.setFooter({ text: "RolesDelete" })
				.setTimestamp(new Date());
			dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${role.guild.id}`, ShardID: `${role.guild.shardId}`, Type: "Role_Delete", Date: `${roleLog.createdTimestamp}` };
			Set.auditLogsByData("auditlog", dataAuditLogID);
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [roleDelete] });
		}

		let dataAuditLogDate;
		// eslint-disable-next-line prefer-const
		dataAuditLogDate = Get.auditLogsAllByType("auditlog", "Role_Delete");
		if (dataAuditLogDate != null && dataAuditLogDate.length < 4) return;
		dataAuditLogDate.forEach(date => {
			const dtRemove = DateTime.now().minus({ days: 20 });
			const timeNew = dtRemove.toMillis();
			if (timeNew >= date.Date) {
				Del.auditLogsByID("auditlog", date.AuditLogID);
			}
		});
	}
};