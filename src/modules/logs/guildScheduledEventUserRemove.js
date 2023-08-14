/* eslint-disable no-inline-comments */
const { EmbedBuilder } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: "guildScheduledEventUserRemove",
	description: "Loggin bot's beeing added to the server.",
	call: "on", // client.once = 'once', client.on = 'on'
	async execute(guildScheduledEvent, user) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel();
		// SQLite
		let icon2 = user.avatarURL();
		if(user.avatar == null) {
			icon2 = "attachment://discord_logo_gray.png";
		}
		const memberLeave = new EmbedBuilder()
			.setAuthor({ name: `${user.tag}`, iconURL: `${icon2}` })
			.setColor("Blue")
			.setDescription(`${user} is **not interested** anymore in Event \`${guildScheduledEvent.name}\``)
			.setFooter({ text: `MemberID: ${user.id}` })
			.setTimestamp(new Date());
		// eslint-disable-next-line no-undef
		globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
	}
};