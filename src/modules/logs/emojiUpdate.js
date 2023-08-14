/* eslint-disable no-inline-comments */
const { EmbedBuilder, AuditLogEvent } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: "emojiUpdate",
	description: "Loggin bot's beeing added to the server.",
	call: "on", // client.once = 'once', client.on = 'on'
	async execute(oldEmoji, newEmoji) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel();
		// SQLite
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(newEmoji.guild.id);
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.EmojiUpdate
		});
		const log = fetchedLogs.entries.first();
		// Data Check
		if (logChannel === "100000000000000000") {
			return;
		}
		// Context
		if (log == null) {
			// console.log('EmojiUpdate');
			// console.log(oldEmoji);
			// console.log(newEmoji);
			return;
		}
		const { actionType, executor, target } = log;
		let icon2 = executor.avatarURL();
		if(executor.avatar == null) {
			icon2 = "attachment://discord_logo_gray.png";
		}
		if(actionType === "Update") {
			const emoji = await guild.emojis.fetch(target.id);
			if (target.animated === false) {
				const channelName = new EmbedBuilder()
					.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
					.setColor("Blue")
					.setDescription(`${executor} **Updated** the Name of Emoji ${emoji}\nFrom \`:${oldEmoji.name}:\` to \`:${newEmoji.name}:\``)
					.setFooter({ text: `MemberID: ${executor.id}` })
					.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [channelName] });
			}
			if (target.animated === true) {
				const channelName = new EmbedBuilder()
					.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
					.setColor("Blue")
					.setDescription(`${executor} **Updated** the Name of Animated Emoji ${emoji}\nFrom \`:${oldEmoji.name}:\` to \`:${newEmoji.name}:\``)
					.setFooter({ text: `MemberID: ${executor.id}` })
					.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [channelName] });
			}
		}
	}
};