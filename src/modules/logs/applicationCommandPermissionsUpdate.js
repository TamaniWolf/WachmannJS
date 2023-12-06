const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.ApplicationCommandPermissionsUpdate,
	description: "Log edited Application Command Permissions.",
	once: false,
	async execute(data) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const { Application } = require("../../core/application/Application");
		const logChannel = await DevCheck.LogChannel(data.guildId);
		if (logChannel === "0") return;
		// ACPU
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(data.guildId);
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.ApplicationCommandPermissionUpdate
		});
		const requestLog = fetchedLogs.entries.first();
		// Context
		const channel = await guild.channels.fetch(logChannel);

		const { executor, changes, target } = requestLog;

		const oldChange = changes.find((c) => c.old != null);
		const newChange = changes.find((c) => c.new != null);

		// Message
		const { Get } = require("../../tools/functions/sqlite/prepare");
		const getBotConfigID = `${guild.id}-${guild.shard.id}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { LanguageConvert } = require("../../tools/functions/languageConvert");
		let iconmember = executor.avatarURL();
		if (executor.avatar == null) iconmember = "https://i.imgur.com/CN6k8gB.png";

		const logembed = new EmbedBuilder()
			.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${iconmember}` })
			.setColor(Application.colors().logEmbedColor.update)
			.setTimestamp(new Date());

		if (oldChange == null) {
			logembed.setDescription(LanguageConvert.lang(lang.logs.acpu, lang.logs.create, target.id));
			channel.send({ embeds: [logembed] });
		}
		if (oldChange != null && newChange != null) {
			logembed.setDescription(LanguageConvert.lang(lang.logs.acpu, lang.logs.edit, target.id));
			channel.send({ embeds: [logembed] });
		}
		if (oldChange != null && newChange == null) {
			logembed.setDescription(LanguageConvert.lang(lang.logs.acpu, lang.logs.delete, target.id));
			channel.send({ embeds: [logembed] });
		}
	}
};