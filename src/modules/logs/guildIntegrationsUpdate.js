const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
const { DateTime } = require("luxon");
require("dotenv").config();
module.exports = {
	name: Events.GuildIntegrationsUpdate,
	description: "Log edited Integrations.",
	once: false,
	async execute(guild) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(guild.id);
		if (logChannel === "0") return;
		const { Application } = require("../../core/application/Application");
		try {
			// eslint-disable-next-line no-undef
			const guilds = await globalclient.guilds.fetch(guild.id);
			const createLogs = await guilds.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.IntegrationCreate
			});
			const deleteLogs = await guilds.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.IntegrationDelete
			});
			const updateLogs = await guilds.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.IntegrationUpdate
			});
			let createLog = createLogs.entries.first();
			let deleteLog = deleteLogs.entries.first();
			let updateLog = updateLogs.entries.first();
			if (createLog == null) { createLog = { createdTimestamp: 1 }; }
			if (deleteLog == null) { deleteLog = { createdTimestamp: 1 }; }
			if (updateLog == null) { updateLog = { createdTimestamp: 1 }; }
			if (logChannel === "100000000000000000") {
				return;
			}
			const { Get } = require("../../tools/functions/sqlite/prepare");
			const getBotConfigID = `${guild.id}-${guild.shard.id}`;
			let dataLang;
			dataLang = Get.botConfig(getBotConfigID);
			if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
			const lang = require(`../../.${dataLang.Lang}`);
			const { LanguageConvert } = require("../../tools/functions/languageConvert");
			if (createLog.createdTimestamp > updateLog.createdTimestamp && createLog.createdTimestamp > deleteLog.createdTimestamp) {
				const { executor, target } = createLog;
				let icon2 = executor.avatarURL();
				if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
				const embed = new EmbedBuilder()
					.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
					.setTimestamp(new Date())
					.setColor(Application.colors().logEmbedColor.update)
					.setDescription(LanguageConvert.lang(lang.logs.interactionced, lang.logs.create, target.name))
					.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [embed] });
			}
			if (deleteLog.createdTimestamp > createLog.createdTimestamp && deleteLog.createdTimestamp > updateLog.createdTimestamp) {
				const { executor, target } = deleteLog;
				let icon2 = executor.avatarURL();
				if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
				const embed = new EmbedBuilder()
					.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
					.setTimestamp(new Date())
					.setColor(Application.colors().logEmbedColor.update)
					.setDescription(LanguageConvert.lang(lang.logs.interactionced, lang.logs.delete, target.name))
					.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [embed] });
			}
			if (updateLog.createdTimestamp > createLog.createdTimestamp && updateLog.createdTimestamp > deleteLog.createdTimestamp) {
				const { executor, target } = updateLog;
				const timeNow = DateTime.now();
				const timeMilli = timeNow.toMillis();
				if (timeMilli >= updateLog.createdTimestamp) {return;}
				let icon2 = executor.avatarURL();
				if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
				const embed = new EmbedBuilder()
					.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
					.setTimestamp(new Date())
					.setColor(Application.colors().logEmbedColor.update)
					.setDescription(LanguageConvert.lang(lang.logs.interactionced, lang.logs.edit, target.name))
					.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [embed] });
			}
		} catch(err) {
			let errData;
			// eslint-disable-next-line no-undef
			if (globalclient.guilds.get(guild.id) && err.code === 50013) {errData = `${err}\n[Client] The Bot/Member is Missing the requiered Permission.`;}
			// eslint-disable-next-line no-undef
			if (!globalclient.guilds.get(guild.id) && err.code === 50013) {errData = `${err}\n[Client] The Bot left the Server ${guild.name}.`;}
			if (err.code !== 50013) {errData = err;}
			// eslint-disable-next-line no-console
			console.log(errData);
		}
	}
};