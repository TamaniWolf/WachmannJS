/* eslint-disable no-console */
/* eslint-disable max-len */
const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.ThreadCreate,
	description: "Log created Threads.",
	call: "on",
	async execute(thread) {
		const { Application } = require("../../core/application/Application.js");
		const { DevCheck } = require("../../tools/functions/devCheck.js");
		const getGuildID = thread.guild.id;
		const getShardID = thread.guild.shardId;
		const logChannel = await DevCheck.LogChannel(getGuildID);
		if (logChannel === "0") return;

		// AuditLog Fetch
		const FetchedLogs = await thread.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.ThreadCreate
		});
		const threadCreateLog = FetchedLogs.entries.first();

		// Context
		const { Get } = require("../../tools/functions/sqlite/prepare.js");
		const getBotConfigID = `${getGuildID}-${getShardID}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { targetType, actionType, changes, executor, target } = threadCreateLog;
		// console.log(changes);

		if (targetType === "Thread" && actionType === "Create") {
			// Embed
			let icon2 = executor.avatarURL();
			if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			const threadCreateEmbed = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.create);

			const MiscConvert = require("../../tools/functions/miscConvert.js");
			const chaTypeNew = await MiscConvert.channelTypeName(target.type);

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
			if (changeName && changeName.length !== 0) ccnew += `**${lang.logs.name}:** \`${changeName[0].new}\`\n`;
			if (changeType && changeType.length !== 0) {
				const channelType = await MiscConvert.channelTypeName(changeType[0].new);
				ccnew += `**${lang.logs.type}:** ${channelType}\n`;
			}
			if (changeArchived && changeArchived.length !== 0) ccnew += `**${lang.logs.archived}:** ${changeArchived[0].new}\n`;
			if (changeRateLimit && changeRateLimit.length !== 0) {
				const rateLimit = await MiscConvert.rateLimitPerUser(changeRateLimit[0].new);
				ccnew += `**${lang.logs.slowmode}:** ${rateLimit}\n`;
			}
			if (changeLocked && changeLocked.length !== 0) ccnew += `**${lang.logs.locked}:** ${changeLocked[0].new}\n`;
			if (changeArchiveDuration && changeArchiveDuration.length !== 0) ccnew += `**${lang.logs.archiveduration}:** ${changeArchiveDuration[0].new}\n`;
			if (changeFlags && changeFlags.length !== 0) ccnew += `**${lang.logs.flags}:** ${changeFlags[0].new}\n`;

			if (ccnew && ccnew.length !== 0) {
				threadCreateEmbed.addFields(
					{ name: "___", value: `${ccnew}`, inline: false }
				);
			}

			if (chaTypeNew !== "Category") {
				threadCreateEmbed.setDescription(`${lang.logs.create} ${chaTypeNew} ${target}`);
			}
			if (chaTypeNew === "Category") {
				threadCreateEmbed.setDescription(`${lang.logs.create} ${chaTypeNew} ${target}`);
			}

			//

			// AddFields
			threadCreateEmbed.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [threadCreateEmbed] });
		}
	}
};