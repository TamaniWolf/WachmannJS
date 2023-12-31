const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.InviteCreate,
	description: "Log created Invites.",
	once: false,
	async execute(invite) {
		const { Application } = require("../../core/application/Application");
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(invite.guild.id);
		if (logChannel === "0") return;
		// SQLite
		const { Get } = require("../../tools/functions/sqlite/prepare");
		const getBotConfigID = `${invite.guild.id}-${invite.guild.shard.id}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { LanguageConvert } = require("../../tools/functions/languageConvert");
		const fetchedLogs = await invite.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.InviteCreate
		});
		const botLog = fetchedLogs.entries.first();
		const { executor, target } = botLog;
		let icon2 = executor.avatarURL();
		if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
		const memberLeave = new EmbedBuilder()
			.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
			.setColor(Application.colors().logEmbedColor.create)
			.setDescription(LanguageConvert.lang(lang.logs.invitecode, lang.logs.create, target.code, target.channel))
			.setTimestamp(new Date());
		// eslint-disable-next-line no-undef
		globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
	}
};