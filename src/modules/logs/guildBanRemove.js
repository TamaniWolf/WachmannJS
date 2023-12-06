const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.GuildBanRemove,
	description: "Log deleted Bans.",
	once: false,
	async execute(ban) {
		const { Application } = require("../../core/application/Application");
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(ban.guild.id);
		if (logChannel === "0") return;
		const fetchedLogs = await ban.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MemberBanRemove
		});
		const banLog = fetchedLogs.entries.first();
		if (logChannel === "100000000000000000") {
			return;
		}
		const { Get } = require("../../tools/functions/sqlite/prepare");
		const getBotConfigID = `${ban.guild.id}-${ban.guild.shard.id}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { LanguageConvert } = require("../../tools/functions/languageConvert");
		const { executor, target } = banLog;
		let icon2 = executor.avatarURL();
		if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";

		const embedBanRemove = new EmbedBuilder()
			.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
			.setColor(Application.colors().logEmbedColor.unban)
			.setDescription(LanguageConvert.lang(lang.logs.unban, target))
			.setTimestamp(new Date());
		if (target.id === ban.user.id) {
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [embedBanRemove] });
		}
	}
};