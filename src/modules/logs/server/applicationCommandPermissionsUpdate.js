/* eslint-disable no-console */
const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.ApplicationCommandPermissionsUpdate,
	description: "Log edited Application Command Permissions.",
	once: false,
	async execute(data) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(data.guildId);
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(data.guildId);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Fetch AuditLog
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.ApplicationCommandPermissionUpdate
		});
		const requestLog = fetchedLogs.entries.first();

		// Main Body
		const channel = await guild.channels.fetch(logChannel);
		const { executor, changes, target } = requestLog;
		const oldChange = changes.find((c) => c.old != null);
		const newChange = changes.find((c) => c.new != null);
		// console.log(requestLog);

		// Message
		let iconmember = executor.avatarURL();
		if (executor.avatar == null) iconmember = "https://i.imgur.com/CN6k8gB.png";

		const logembed = new EmbedBuilder()
			.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${iconmember}` })
			.setColor(Application.colors().logEmbedColor.update)
			.setFooter({ text: "ApplicationCommandPermissionsUpdate" })
			.setTimestamp(new Date());

		if (oldChange == null && newChange != null) {
			logembed.setDescription(LanguageConvert.lang(langLogs.server.acpu, langLogs.all.create, target.id));
			channel.send({ embeds: [logembed] });
		}
		if (oldChange != null && newChange != null) {
			logembed.setDescription(LanguageConvert.lang(langLogs.server.acpu, langLogs.all.edit, target.id));
			channel.send({ embeds: [logembed] });
		}
		if (oldChange != null && newChange == null) {
			logembed.setDescription(LanguageConvert.lang(langLogs.server.acpu, langLogs.all.delete, target.id));
			channel.send({ embeds: [logembed] });
		}
	}
};