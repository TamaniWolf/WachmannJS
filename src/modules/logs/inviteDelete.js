/* eslint-disable no-inline-comments */
const { EmbedBuilder, AuditLogEvent } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: "inviteDelete",
	description: "Loggin bot's beeing added to the server.",
	call: "on", // client.once = 'once', client.on = 'on'
	async execute(invite) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel();
		if (invite.guild.id !== process.env.SERVER_ID) return;
		const fetchedLogs = await invite.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.InviteDelete
		});
		const botLog = fetchedLogs.entries.first();
		const { executor, target } = botLog;
		const channel = await invite.guild.channels.fetch(target.channelId);
		let icon2 = executor.avatarURL();
		if(executor.avatar == null) {
			icon2 = "attachment://discord_logo_gray.png";
		}
		const memberLeave = new EmbedBuilder()
			.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
			.setColor("Blue")
			.setDescription(`${executor} **Deleted** an Invite from This Server`)
			.addFields(
				{ name: "Code:", value: `${target.code}`, inline: true },
				{ name: "Channel:", value: `${channel}`, inline: true }
				// { name: 'Expires on:', value: ``, inline: true },
				// { name: 'More:', value: `` },
			)
			.setFooter({ text: `MemberID: ${target.inviterId}` })
			.setTimestamp(new Date());
		// eslint-disable-next-line no-undef
		globalclient.channels.cache.get(logChannel).send({ embeds: [memberLeave] });
	}
};