const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
const { DateTime } = require("luxon");
require("dotenv").config();

module.exports = {
	name: Events.GuildIntegrationsUpdate,
	description: "Log edited Integrations.",
	once: false,
	async execute(guild) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.jsontaLang.Lang}.json`);
		const langLogs = lang.modules.logs;

		// Main Body
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
			if (logChannel === "100000000000000000") return;
			if (createLog.createdTimestamp > updateLog.createdTimestamp && createLog.createdTimestamp > deleteLog.createdTimestamp) {
				const { executor, target } = createLog;
				let icon2 = executor.avatarURL();
				if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
				const embed = new EmbedBuilder()
					.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
					.setTimestamp(new Date())
					.setColor(Application.colors().logEmbedColor.update)
					.setDescription(LanguageConvert.lang(langLogs.server.interactionced, langLogs.all.create, target.name))
					.setFooter({ text: "IntegrationsUpdate" })
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
					.setDescription(LanguageConvert.lang(langLogs.server.interactionced, langLogs.all.delete, target.name))
					.setFooter({ text: "IntegrationsUpdate" })
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
					.setDescription(LanguageConvert.lang(langLogs.server.interactionced, langLogs.all.edit, target.name))
					.setFooter({ text: "IntegrationsUpdate" })
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