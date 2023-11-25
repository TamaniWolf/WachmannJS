const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.ChannelDelete,
	description: "Log deleted Channels.",
	call: "on",
	async execute(channel) {
		const { Application } = require("../../core/application/Application");
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(channel.guild.id);
		if (logChannel === "0") return;
		// AuditLog Fetch
		const FetchedLogs = await channel.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.ChannelDelete
		});
		const channelDeleteLog = FetchedLogs.entries.first();

		// Context
		const { Get } = require("../../tools/functions/sqlite/prepare");
		const getBotConfigID = `${channel.guild.id}-${channel.guild.shard.id}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { targetType, actionType, executor, target } = channelDeleteLog;
		if (targetType === "Channel" && actionType === "Delete") {
			// Embed
			let icon2 = executor.avatarURL();
			if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			const channelCreateEmbed = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.delete);
			// Channel Type
			const MiscConvert = require("../../tools/functions/miscConvert.js");
			const chaTypeNew = await MiscConvert.channelTypeName(target.type);
			if (chaTypeNew !== "") {
				channelCreateEmbed.setDescription(`${lang.logs.delete} ${chaTypeNew} \`${target.name}\``);
				// AddFields
				channelCreateEmbed.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [channelCreateEmbed] });
			}
		}
	}
};