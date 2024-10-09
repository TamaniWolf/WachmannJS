const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.ChannelDelete,
	description: "Log deleted Channels.",
	once: false,
	async execute(channel) {
		const { Application } = require("../../../tools/core.js");
		const { Utils, DevCheck } = require("../../../tools/utils.js");
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(channel.guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// AuditLog Fetch
		const FetchedLogs = await channel.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.ChannelDelete
		});
		const channelDeleteLog = FetchedLogs.entries.first();

		// Main Body
		const { targetType, actionType, executor, target } = channelDeleteLog;
		if (targetType === "Channel" && actionType === "Delete") {
			// Embed
			let icon2 = executor.avatarURL();
			if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			const channelCreateEmbed = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.delete)
				.setFooter({ text: "ChannelDelete" });
			// Channel Type
			const chaTypeNew = await Utils.channel_type_name(target.type);
			if (chaTypeNew !== "") {
				channelCreateEmbed.setDescription(`${langLogs.channel.deletechannel} ${chaTypeNew} \`${target.name}\``);
				// AddFields
				channelCreateEmbed.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [channelCreateEmbed] });
			}
		}
	}
};