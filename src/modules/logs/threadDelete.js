/* eslint-disable no-console */
/* eslint-disable max-len */
const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.ThreadDelete,
	description: "Log deleted Threads.",
	once: false,
	async execute(thread) {
		const { Application } = require("../../core/application/Application");
		const { DevCheck } = require("../../tools/functions/devCheck");
		const getGuildID = thread.guild.id;
		const getShardID = thread.guild.shardId;
		const logChannel = await DevCheck.LogChannel(getGuildID);
		if (logChannel === "0") return;

		// AuditLog Fetch
		const FetchedLogs = await thread.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.ThreadDelete
		});
		const threadDeleteLog = FetchedLogs.entries.first();

		// Context
		const { Get } = require("../../tools/functions/sqlite/prepare");
		const getBotConfigID = `${getGuildID}-${getShardID}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { targetType, actionType, executor, target } = threadDeleteLog;

		if (targetType === "Thread" && actionType === "Delete") {
			// Embed
			let icon2 = executor.avatarURL();
			if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			const threadDeleteEmbed = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.delete);
			// Channel Type
			const MiscConvert = require("../../tools/functions/miscConvert.js");
			const chaTypeNew = await MiscConvert.channelTypeName(target.type);
			if (chaTypeNew !== "") {
				threadDeleteEmbed.setDescription(`${lang.logs.delete} ${chaTypeNew} \`${target.name}\``);
				// AddFields
				threadDeleteEmbed.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [threadDeleteEmbed] });
			}
		}
	}
};