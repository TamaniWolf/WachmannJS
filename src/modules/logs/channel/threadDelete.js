/* eslint-disable no-console */
/* eslint-disable max-len */
const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.ThreadDelete,
	description: "Log deleted Threads.",
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
			type: AuditLogEvent.ThreadDelete
		});
		const threadDeleteLog = FetchedLogs.entries.first();

		// Main Body
		const { targetType, actionType, executor, target } = threadDeleteLog;

		if (targetType === "Thread" && actionType === "Delete") {
			// Embed
			let icon2 = executor.avatarURL();
			if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			const threadDeleteEmbed = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
				.setColor(Application.colors().logEmbedColor.delete)
				.setFooter({ text: "ThreadDelete" });
			// Channel Type
			const chaTypeNew = await Utils.channel_type_name(target.type);
			if (chaTypeNew !== "") {
				threadDeleteEmbed.setDescription(`${langLogs.channel.deletethread} ${chaTypeNew} \`${target.name}\``);
				// AddFields
				threadDeleteEmbed.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [threadDeleteEmbed] });
			}
		}
	}
};