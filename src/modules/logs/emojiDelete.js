/* eslint-disable no-inline-comments */
const { EmbedBuilder, AuditLogEvent } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: "emojiDelete",
	description: "Loggin bot's beeing added to the server.",
	call: "on", // client.once = 'once', client.on = 'on'
	async execute(emoji) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel();
		if (emoji.guild.id !== process.env.SERVER_ID) return;
		// SQLite
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(emoji.guild.id);
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.EmojiDelete
		});
		const log = fetchedLogs.entries.first();
		// Data Check
		if (logChannel === "100000000000000000") {
			return;
		}
		// Context
		if (log !== null) {
			// console.log('EmojiDelete');
			// console.log(emoji);
			return;
		}
		const { actionType, executor } = log;
		let icon2 = executor.avatarURL();
		if(executor.avatar == null) {
			icon2 = "attachment://discord_logo_gray.png";
		}
		if(actionType === "Delete") {
			const channelName = new EmbedBuilder()
				.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
				.setColor("Blue")
				.setDescription(`${executor} **Deleted** Emoji \`:${emoji.name}:\` from the server`)
				.setFooter({ text: `MemberID: ${executor.id}` })
				.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [channelName] });
		}
	}
};