const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.ChannelCreate,
	description: "Log created Channels.",
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
			type: AuditLogEvent.ChannelCreate
		});
		const channelCreateLog = FetchedLogs.entries.first();

		// Main Body
		const { targetType, actionType, changes, executor, target } = channelCreateLog;

		if (targetType === "Channel" && actionType === "Create") {
			// Embed
			let icon2 = executor.avatarURL();
			if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			const channelCreateEmbed = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.create)
				.setFooter({ text: "ChannelCreate" });

			const chaTypeNew = await Utils.channel_type_name(target.type);

			const changeName = changes.filter(function(obj) {
				return obj.key === "name";
			});
			const changeType = changes.filter(function(obj) {
				return obj.key === "type";
			});
			const changeTopic = changes.filter(function(obj) {
				return obj.key === "topic";
			});
			const changeNSFW = changes.filter(function(obj) {
				return obj.key === "nsfw";
			});
			const changeBitrate = changes.filter(function(obj) {
				return obj.key === "bitrate";
			});
			const changeUserLimit = changes.filter(function(obj) {
				return obj.key === "user_limit";
			});
			const changePermsOverwrite = changes.filter(function(obj) {
				return obj.key === "permission_overwrites";
			});
			const permsOverwriteNew = changePermsOverwrite.map(function(obj) {
				return obj.new;
			});
			const changeRateLimit = changes.filter(function(obj) {
				return obj.key === "rate_limit_per_user";
			});
			const changeRTCRegion = changes.filter(function(obj) {
				return obj.key === "rtc_region";
			});
			const changeVideoQuality = changes.filter(function(obj) {
				return obj.key === "video_quality_mode";
			});
			const changeThreadRateLimit = changes.filter(function(obj) {
				return obj.key === "default_thread_rate_limit_per_user";
			});
			const changeTags = changes.filter(function(obj) {
				return obj.key === "available_tags";
			});
			const changeReactionEmoji = changes.filter(function(obj) {
				return obj.key === "default_reaction_emoji";
			});
			const changeArchiveDuration = changes.filter(function(obj) {
				return obj.key === "default_auto_archive_duration";
			});
			const changeSortOrder = changes.filter(function(obj) {
				return obj.key === "default_sort_order";
			});
			const changeForumLayout = changes.filter(function(obj) {
				return obj.key === "default_forum_layout";
			});
			const changeReason = changes.filter(function(obj) {
				return obj.key === "reason";
			});
			const changeFlags = changes.filter(function(obj) {
				return obj.key === "flags";
			});

			let ccnew = "";
			if (changeName && changeName.length !== 0) ccnew += `**${langLogs.channel.name}:** ${changeName[0].new}\n`;
			if (changeType && changeType.length !== 0) {
				const channelType = await Utils.channel_type_name(changeType[0].new);
				ccnew += `**${langLogs.channel.type}:** ${channelType}\n`;
			}
			if (changeTopic && changeTopic.length !== 0) ccnew += `**${langLogs.channel.topic}:** ${changeTopic[0].new}\n`;
			if (changeNSFW && changeNSFW.length !== 0) ccnew += `**${langLogs.channel.nsfw}:** ${changeNSFW[0].new}\n`;
			if (changeBitrate && changeBitrate.length !== 0) ccnew += `**${langLogs.channel.bitrate}:** ${changeBitrate[0].new / 1000}kbps\n`;
			if (changeUserLimit && changeUserLimit.length !== 0) ccnew += `**${langLogs.channel.userlimit}:** ${changeUserLimit[0].new}\n`;
			// if (changeUserLimit && changeRateLimit.length !== 0
			// && changeUserLimit[0].new !== 0) ccnew += `**${langLogs.channel.userlimit}:** ${changeUserLimit[0].new}\n`;
			if (changeRateLimit && changeRateLimit.length !== 0) {
				const rateLimit = await Utils.rateLimitPerUser(changeRateLimit[0].new);
				ccnew += `**${langLogs.channel.slowmode}:** ${rateLimit}\n`;
			}
			if (permsOverwriteNew && permsOverwriteNew.length !== 1) ccnew += `**${langLogs.channel.permoverwrite}:** ${permsOverwriteNew}\n`;
			if (changeRTCRegion && changeRTCRegion.length !== 0) ccnew += `**${langLogs.channel.rtcregion}:** ${changeRTCRegion[0].new}\n`;
			if (changeVideoQuality && changeVideoQuality.length !== 0) ccnew += `**${langLogs.channel.videoquality}:** ${changeVideoQuality[0].new}\n`;
			if (changeThreadRateLimit && changeThreadRateLimit.length !== 0) {
				const threadRateLimit = await Utils.rateLimitPerUser(changeThreadRateLimit[0].new);
				ccnew += `**${langLogs.channel.threadslowmode}:** ${threadRateLimit}\n`;
			}
			if (changeTags && changeTags.length !== 0) ccnew += `**${langLogs.channel.tags}:** ${changeTags[0].new}\n`;
			if (changeReactionEmoji && changeReactionEmoji.length !== 0) ccnew += `**${langLogs.channel.reactionemoji}:** ${changeReactionEmoji[0].new}\n`;
			if (changeArchiveDuration && changeArchiveDuration.length !== 0) ccnew += `**${langLogs.channel.archiveduration}:** ${changeArchiveDuration[0].new}\n`;
			if (changeSortOrder && changeSortOrder.length !== 0) ccnew += `**${langLogs.channel.sorted}:** ${changeSortOrder[0].new}\n`;
			if (changeForumLayout && changeForumLayout.length !== 0) ccnew += `**${langLogs.channel.forumlayout}:** ${changeForumLayout[0].new}\n`;
			if (changeReason && changeReason.length !== 0) ccnew += `**${langLogs.channel.reason}:** ${changeReason[0].new}\n`;
			if (changeFlags && changeFlags.length !== 0) ccnew += `**${langLogs.channel.flags}:** ${changeFlags[0].new}\n`;

			if (ccnew && ccnew.length !== 0) {
				channelCreateEmbed.addFields(
					{ name: "___", value: `${ccnew}`, inline: false }
				);
			}

			if (chaTypeNew !== "Category" || chaTypeNew === "Category") channelCreateEmbed.setDescription(`${langLogs.channel.createchannel} ${chaTypeNew} ${target}`);

			// AddFields
			channelCreateEmbed.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [channelCreateEmbed] });
		}
	}
};