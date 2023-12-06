const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.MessageDelete,
	description: "Log deleted Messages.",
	once: false,
	async execute(message) {
		const { Application } = require("../../core/application/Application");
		const { DevCheck } = require("../../tools/functions/devCheck");
		const { Get, Set, Del } = require("../../tools/functions/sqlite/prepare");
		const { DateTime } = require("luxon");
		const logChannel = await DevCheck.LogChannel(message.guildId);
		let dataAuditLog;
		// eslint-disable-next-line no-undef
		const getGuildObj = await globalclient.guilds.fetch(message.guildId);
		let iconMsg = "";
		let iconLog = "";
		let embedContent = "";
		// let check = true;
		// const prefix = process.env.PREFIX;
		const getBotConfigID = `${getGuildObj.id}-${getGuildObj.shard.id}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { LanguageConvert } = require("../../tools/functions/languageConvert");

		const embedMsgDel = new EmbedBuilder()
			.setColor(Application.colors().logEmbedColor.delete);

		if (message.content != null) {
			let msgLower = message.content.toLowerCase();
			const argsLower = msgLower.split(/ +/);
			if (msgLower.startsWith("<@")) msgLower = msgLower.replace(`${argsLower[0]} `, "");
			// const exCmdString = process.env.EXTERNAL_COMMANDS;
			// const exCmdTrim = exCmdString.split(/,+/);
			// const exCmdArray = exCmdTrim.map(obj => {
			//	 return obj.trim();
			// });
			// exCmdArray.forEach(c => {
			// 	if (msgLower.startsWith(`${c} `) && process.env.LOG_COMMANDS === "false") check = false;
			// });
			// if (check === false) return;
			// if (msgLower.startsWith(`${prefix}`) && process.env.LOG_COMMANDS === "false") return;
			// if (msgLower.startsWith("/") && process.env.LOG_COMMANDS === "false") return;
		}

		// if (message.author == null) {
		// 	// Old Message
		// 	iconMsg = "https://i.imgur.com/CN6k8gB.png";
		// 	embedMsgDel.setAuthor({ name: `${lang.logs.anon}`, iconURL: iconMsg })
		// 		.setDescription(LanguageConvert.lang(lang.logs.unknownmsgdeleted, message.channel.id, message.createdTimestamp))
		// 		.setTimestamp(new Date());
		// 	getGuildObj.channels.cache.get(logChannel).send({ embeds: [embedMsgDel] });
		// }

		if (message.author != null) {
			if (message.author.bot === true && process.env.LOGGING_BOTS === "false") return;
			if (message.author.bot === true && process.env.CANNI_ID === message.author.id) return;
			if (message.author.bot === true && process.env.SANI_ID === message.author.id) return;
			const fetchedLogs = await getGuildObj.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.MessageDelete
			});
			const botLog = fetchedLogs.entries.first();
			const { executor, extra, id, target } = botLog;

			iconLog = executor.avatarURL();
			if (executor.avatar == null) iconLog = "https://i.imgur.com/CN6k8gB.png";
			iconMsg = message.author.avatarURL();
			if (message.author.avatar == null) iconMsg = "https://i.imgur.com/CN6k8gB.png";

			if (message.content != null && message.content !== "") {
				embedMsgDel.addFields(
					{ name: `${lang.logs.content}`, value: `${message.content}` }
				);
			}

			if (message.embeds.length !== 0) {
				const embedFilter = message.embeds.map(function(obj) { return obj.data; });
				if (embedFilter && embedFilter[0].author) embedContent += `***${lang.logs.name}*** ${embedFilter[0].author.name}\n`;
				if (embedFilter && embedFilter[0].color) embedContent += `***${lang.logs.color}*** ${embedFilter[0].color}\n`;
				if (embedFilter && embedFilter[0].description) embedContent += `***${lang.logs.content}***\n${embedFilter[0].description}\n`;
				if (embedFilter && embedFilter[0].fields) embedContent += `${lang.logs.fields}\n`;
				if (embedFilter && embedFilter[0].timestamp) embedContent += `***${lang.logs.time}*** <t:${parseInt(embedFilter[0].timestamp / 1000)}:F>\n`;
				embedMsgDel.addFields(
					{ name: `${lang.logs.embed}`, value: `${embedContent}` }
				);
			}

			dataAuditLog = Get.auditLogsMsgDel(id);
			const prasInted = parseInt(message.createdTimestamp / 1000);
			if (dataAuditLog != null && dataAuditLog.Count >= extra.count) {
				// Old DataLog & Old AuditLog & New Message
				embedMsgDel.setAuthor({ name: `@${message.author.username} (ID: ${message.author.id})`, iconURL: iconMsg })
					.setDescription(LanguageConvert.lang(lang.logs.msgdeleted, message.author.id, message.channel.id, prasInted))
					.setTimestamp(new Date());
				getGuildObj.channels.cache.get(logChannel).send({ embeds: [embedMsgDel] });
			}
			if (dataAuditLog != null && dataAuditLog.Count < extra.count || dataAuditLog == null) {
				// Old DataLog & New AuditLog & New Message ||
				// New DataLog & New AuditLog & New Message
				embedMsgDel.setAuthor({ name: `@${executor.username} (ID: ${executor.id})`, iconURL: iconLog })
					.setDescription(LanguageConvert.lang(lang.logs.msgdeleted, target.id, extra.channel.id, prasInted))
					.setTimestamp(new Date());
				getGuildObj.channels.cache.get(logChannel).send({ embeds: [embedMsgDel] });
				dataAuditLog = { AuditLogID: `${id}`, GuildID: `${message.guild.id}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
				Set.auditLogsMsgDel(dataAuditLog);
			}
		}
		const dataAuditLogDate = Get.auditLogsMsgDel("Message_Delete");
		if (dataAuditLogDate == null || dataAuditLogDate.length < 4) {
			return;
		} else {
			dataAuditLogDate.forEach(date => {
				const dtRemove = DateTime.now().minus({ days: 20 });
				const timeNew = dtRemove.toMillis();
				if (timeNew >= date.Date) {
					Del.auditLogsMsgDel(date.AuditLogID);
				}
			});
		}
	}
};
