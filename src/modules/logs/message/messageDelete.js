/* eslint-disable max-len */
const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.MessageDelete,
	description: "Log deleted Messages.",
	once: false,
	async execute(message) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		const { Get, Set, Del } = require("../../../tools/db.js");
		const { DateTime } = require("luxon");
		const guildId = message.guild.id;
		// eslint-disable-next-line no-undef
		const getGuildObj = await globalclient.guilds.fetch(guildId);
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(guildId);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Main Body
		// New Delete, No AuditLog, No DataEntry, No CountUp = Uncached / Own Message
		// New Delete, New AuditLog, No DataEntry, No CountUp = Someones Message
		// New Delete, Old AuditLog, Old DataEntry, No CountUp = Uncached / Own Message
		// New Delete, Old AuditLog, Old DataEntry, New CountUp = Someones Message
		// const fetchedLogs = await getGuildObj.fetchAuditLogs({
		// 	limit: 1,
		// 	type: AuditLogEvent.MessageDelete
		// });
		// const botLog = fetchedLogs.entries.first();
		// const { executor, extra, id, target } = botLog;

		// let dataAuditLog = Get.auditLogsByID("message_delete", id);
		// const embedMsgDel = new EmbedBuilder()
		// 	.setColor(Application.colors().logEmbedColor.delete);


		// if (message.author == null) {
		// 	// Message target
		// 	console.log("Uncached / Anon Message. Mt");
		// }

		// if (message.author != null && botLog != null && dataAuditLog != null && botLog.id === dataAuditLog.AuditLogID && dataAuditLog.Count >= botLog.extra.count) {
		// 	// Message executer, target
		// 	console.log("Owner deleted Message. Met");
		// }
		// if (message.author != null && botLog != null && dataAuditLog != null && botLog.id === dataAuditLog.AuditLogID && dataAuditLog.Count < botLog.extra.count) {
		// 	dataAuditLog = { AuditLogID: `${id}`, GuildID: `${message.guild.id}`, ShardID: `${message.guild.shardId}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
		// 	Set.auditLogsByData("message_delete", dataAuditLog);
		// 	// Log executer, target, count
		// 	console.log("Others deleted Message, Count up. Letc");
		// }
		// if (message.author != null && botLog != null && dataAuditLog == null) {
		// 	dataAuditLog = { AuditLogID: `${id}`, GuildID: `${message.guild.id}`, ShardID: `${message.guild.shardId}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
		// 	Set.auditLogsByData("message_delete", dataAuditLog);
		// 	// Log executer, target
		// 	console.log("Others deleted Message. Let");
		// }


		// /**
		//  * Message Embed creating with only the Message, known/cached
		//  *
		//  * @param message - Message Object
		//  * @param embed - Embed Object
		//  * @param lang - Language
		//  * @param time - Time int
		//  * @returns
		//  */
		// function embedMessageOnly(message, embed, lang, time) {
		// 	let iconMsg = message.author.avatarURL();
		// 	if (message.author.avatar == null) iconMsg = "https://i.imgur.com/CN6k8gB.png";

		// 	embed.setAuthor({ name: `@${message.author.username} (ID: ${message.author.id})`, iconURL: iconMsg })
		// 		.setDescription(LanguageConvert.lang(lang.message.delete, message.author.id, message.channel.id, time))
		// 		.setFooter({ text: "MessageDelete" })
		// 		.setTimestamp(new Date());
		// 	return embed;
		// }

		// /**
		//  * Message Embed creating with only the Message, unknown/uncached
		//  *
		//  * @param message - Message Object
		//  * @param embed - Embed Object
		//  * @param lang - Language
		//  * @returns
		//  */
		// function embedMessageUnknown(message, embed, lang) {
		// 	let iconMsg = "https://i.imgur.com/CN6k8gB.png";

		// 	embed.setAuthor({ name: `${lang.all.anon}`, iconURL: iconMsg })
		// 		.setDescription(LanguageConvert.lang(lang.message.deleteuncached, message.channel.id, message.createdTimestamp))
		// 		.setFooter({ text: "MessageDelete" })
		// 		.setTimestamp(new Date());
		// 	return embed;
		// }

		// /**
		//  * Message Embed creating with Target and Executor
		//  *
		//  * @param embed - Embed Object
		//  * @param executor - Executor import
		//  * @param lang - Language
		//  * @param target - Target import
		//  * @param extra - Extra import
		//  * @param time - Time int
		//  * @returns
		//  */
		// function embedTargetExecutor(embed, executor, lang, target, extra, time) {
		// 	iconLog = executor.avatarURL();
		// 	if (executor.avatar == null) iconLog = "https://i.imgur.com/CN6k8gB.png";

		// 	embed.setAuthor({ name: `@${executor.username} (ID: ${executor.id})`, iconURL: iconLog })
		// 		.setDescription(LanguageConvert.lang(lang.message.delete, target.id, extra.channel.id, time))
		// 		.setFooter({ text: "MessageDelete" })
		// 		.setTimestamp(new Date());
		// 	return embed;
		// }


		let dataAuditLog;
		let iconMsg = "";
		let iconLog = "";
		let embedContent = "";

		const embedMsgDel = new EmbedBuilder()
			.setColor(Application.colors().logEmbedColor.delete);

		if (message.content != null) {
			let msgLower = message.content.toLowerCase();
			const argsLower = msgLower.split(/ +/);
			if (msgLower.startsWith("<@")) msgLower = msgLower.replace(`${argsLower[0]} `, "");
		}

		if (message.author == null) {
			// Delete Own Uncached Message
			iconMsg = "https://i.imgur.com/CN6k8gB.png";
			embedMsgDel.setAuthor({ name: `${langLogs.all.anon}`, iconURL: iconMsg })
				.setDescription(LanguageConvert.lang(langLogs.message.deleteuncached, message.channel.id, message.createdTimestamp))
				.setFooter({ text: "MessageDelete" })
				.setTimestamp(new Date());
			getGuildObj.channels.cache.get(logChannel).send({ embeds: [embedMsgDel] });
		}

		if (message.author != null) {
			// Delete Cached Message
			if (message.author.bot === true && process.env.LOG_BOTS === "false") return;
			if (message.author.bot === true && process.env.CANNI_ID === message.author.id) return;
			if (message.author.bot === true && process.env.SANI_ID === message.author.id) return;
			const fetchedLogs = await getGuildObj.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.MessageDelete
			});
			const botLog = fetchedLogs.entries.first();
			const { executor, extra, id, target } = botLog;

			// console.log(message.createdTimestamp);
			// console.log(botLog.createdTimestamp);
			// console.log(DateTime.now().toMillis());
			// return;

			// 1265033228725649429
			//

			iconLog = executor.avatarURL();
			if (executor.avatar == null) iconLog = "https://i.imgur.com/CN6k8gB.png";
			iconMsg = message.author.avatarURL();
			if (message.author.avatar == null) iconMsg = "https://i.imgur.com/CN6k8gB.png";

			if (message.content != null && message.content !== "") {
				embedMsgDel.addFields(
					{ name: langLogs.message.content, value: `${message.content}` }
				);
			}

			if (message.embeds.length !== 0) {
				const embedFilter = message.embeds.map(function(obj) { return obj.data; });
				if (embedFilter && embedFilter[0].author) embedContent += `***${langLogs.all.name}*** ${embedFilter[0].author.name}\n`;
				if (embedFilter && embedFilter[0].color) embedContent += `***${langLogs.all.color}*** ${embedFilter[0].color}\n`;
				if (embedFilter && embedFilter[0].description) embedContent += `***${langLogs.message.content}***\n${embedFilter[0].description}\n`;
				if (embedFilter && embedFilter[0].fields) embedContent += `${langLogs.message.fields}\n`;
				if (embedFilter && embedFilter[0].timestamp) embedContent += `***${langLogs.message.time}*** <t:${parseInt(embedFilter[0].timestamp / 1000)}:F>\n`;
				embedMsgDel.addFields(
					{ name: langLogs.message.embed, value: `${embedContent}` }
				);
			}

			dataAuditLog = Get.auditLogsByID("auditlog", id);
			const prasInted = parseInt(message.createdTimestamp / 1000);
			if (dataAuditLog != null && dataAuditLog.Count >= extra.count) {
				// console.log("1");
				// Delete Own Cached Message
				// Old DataLog & Old AuditLog & New Message
				embedMsgDel.setAuthor({ name: `@${message.author.username} (ID: ${message.author.id})`, iconURL: iconMsg })
					.setDescription(LanguageConvert.lang(langLogs.message.delete, message.author.id, message.channel.id, prasInted))
					.setFooter({ text: "MessageDelete" })
					.setTimestamp(new Date());
				getGuildObj.channels.cache.get(logChannel).send({ embeds: [embedMsgDel] });
			}
			if (dataAuditLog != null && dataAuditLog.Count < extra.count || dataAuditLog == null) {
				// console.log("2");
				// Delete Others Cached Message
				// Old DataLog & New AuditLog & New Message ||
				// New DataLog & New AuditLog & New Message
				embedMsgDel.setAuthor({ name: `@${executor.username} (ID: ${executor.id})`, iconURL: iconLog })
					.setDescription(LanguageConvert.lang(langLogs.message.delete, target.id, extra.channel.id, prasInted))
					.setFooter({ text: "MessageDelete" })
					.setTimestamp(new Date());
				getGuildObj.channels.cache.get(logChannel).send({ embeds: [embedMsgDel] });
				dataAuditLog = { AuditLogID: `${id}`, GuildID: `${message.guild.id}`, ShardID: `${message.guild.shardId}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
				Set.auditLogsByData("message_delete", dataAuditLog);
			}
		}
		const dataAuditLogDate = Get.auditLogsByID("message_delete", "Message_Delete");
		if (dataAuditLogDate == null || dataAuditLogDate.length < 4) {
			return;
		} else {
			dataAuditLogDate.forEach(date => {
				const dtRemove = DateTime.now().minus({ days: 20 });
				const timeNew = dtRemove.toMillis();
				if (timeNew >= date.Date) {
					Del.auditLogsByID("message_delete", date.AuditLogID);
				}
			});
		}
	}
};
