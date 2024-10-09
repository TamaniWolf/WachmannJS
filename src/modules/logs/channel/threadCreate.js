/* eslint-disable no-console */
/* eslint-disable max-len */
const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.ThreadCreate,
	description: "Log created Threads.",
	once: false,
	async execute(thread) {
		const { Application } = require("../../../tools/core.js");
		const { Utils, DevCheck } = require("../../../tools/utils.js");
		const getGuildID = thread.guild.id;
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(getGuildID);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// AuditLog Fetch
		const FetchedLogs = await thread.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.ThreadCreate
		});
		const threadCreateLog = FetchedLogs.entries.first();

		// Main Body
		const { targetType, actionType, changes, executor, target } = threadCreateLog;

		if (targetType === "Thread" && actionType === "Create") {
			// Embed
			let icon2 = executor.avatarURL();
			if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			const threadCreateEmbed = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.create)
				.setFooter({ text: "ThreadCreate" });

			const chaTypeNew = await Utils.channel_type_name(target.type);

			const changeName = changes.filter(function(obj) {
				return obj.key === "name";
			});
			const changeType = changes.filter(function(obj) {
				return obj.key === "type";
			});
			const changeRateLimit = changes.filter(function(obj) {
				return obj.key === "rate_limit_per_user";
			});
			const changeLocked = changes.filter(function(obj) {
				return obj.key === "locked";
			});
			const changeArchived = changes.filter(function(obj) {
				return obj.key === "archived";
			});
			const changeArchiveDuration = changes.filter(function(obj) {
				return obj.key === "auto_archive_duration";
			});
			const changeFlags = changes.filter(function(obj) {
				return obj.key === "flags";
			});

			let ccnew = "";
			if (changeName && changeName.length !== 0) ccnew += `**${langLogs.channel.name}:** \`${changeName[0].new}\`\n`;
			if (changeType && changeType.length !== 0) {
				const channelType = await Utils.channel_type_name(changeType[0].new);
				ccnew += `**${langLogs.channel.type}:** ${channelType}\n`;
			}
			if (changeArchived && changeArchived.length !== 0) ccnew += `**${langLogs.channel.archived}:** ${changeArchived[0].new}\n`;
			if (changeRateLimit && changeRateLimit.length !== 0) {
				const rateLimit = await Utils.rateLimitPerUser(changeRateLimit[0].new);
				ccnew += `**${langLogs.channel.slowmode}:** ${rateLimit}\n`;
			}
			if (changeLocked && changeLocked.length !== 0) ccnew += `**${langLogs.channel.locked}:** ${changeLocked[0].new}\n`;
			if (changeArchiveDuration && changeArchiveDuration.length !== 0) ccnew += `**${langLogs.channel.archiveduration}:** ${changeArchiveDuration[0].new}\n`;
			if (changeFlags && changeFlags.length !== 0) ccnew += `**${langLogs.channel.flags}:** ${changeFlags[0].new}\n`;

			if (ccnew && ccnew.length !== 0) {
				threadCreateEmbed.addFields(
					{ name: "___", value: `${ccnew}`, inline: false }
				);
			}

			if (chaTypeNew !== "Category" || chaTypeNew === "Category") {
				threadCreateEmbed.setDescription(`${langLogs.channel.createthread} ${chaTypeNew} ${target}`);
			}

			// AddFields
			threadCreateEmbed.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [threadCreateEmbed] });
		}
	}
};