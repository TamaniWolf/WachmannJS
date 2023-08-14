/* eslint-disable no-inline-comments */
const { EmbedBuilder, AuditLogEvent } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: "guildMemberAdd",
	description: "Loggin bot's beeing added to the server.",
	call: "on", // client.once = 'once', client.on = 'on'
	async execute(member) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel();
		// BotAdd
		const fetchedBotAddLogs = await member.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.BotAdd
		});
		const botAddLog = fetchedBotAddLogs.entries.first();

		// Context
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(member.guild.id);
		const channel = await guild.channels.fetch(logChannel);

		const logembed = new EmbedBuilder()
			.setColor("Green")
			.setTimestamp(new Date());

		// Member no AuditLog
		if (botAddLog == null) {
			let iconmember = member.user.avatarURL();
			if(member.user.avatar == null) {
				iconmember = "attachment://discord_logo_gray.png";
			}
			const memberlogged = guild.members.cache.get(member.user.id);
			logembed.setAuthor({ name: `${member.user.username}${member.user.discriminator}`, iconURL: `${iconmember}` })
				.setDescription(`User <@${member.user.id}> **Joined** the server`)
				.addFields(
					{ name: "Account age", value: `<t:${parseInt(memberlogged.user.createdTimestamp / 1000)}:R>`, inline: false }
				)
				.setFooter({ text: `MemberID: ${member.user.id}` });
			channel.send({ embeds: [logembed] });
			return;
		}
		const { executor, target } = botAddLog;
		// Bot
		if (target.id === member.id) {
			let iconbot = executor.avatarURL();
			if(executor.avatar == null) {
				iconbot = "attachment://discord_logo_gray.png";
			}
			logembed.setAuthor({ name: `${executor.tag}`, iconURL: `${iconbot}` })
				.setDescription(`Bot ${target} was **Added** to the server by ${executor}`)
				.setFooter({ text: `BotID: ${executor.id}` });
			channel.send({ embeds: [logembed] });
		}
		// Member
		if (target.id !== member.user.id) {
			let iconmember = member.user.avatarURL();
			if(member.user.avatar == null) {
				iconmember = "attachment://discord_logo_gray.png";
			}
			const memberlogged = guild.members.cache.get(member.user.id);
			logembed.setAuthor({ name: `${member.user.username}${member.user.discriminator}`, iconURL: `${iconmember}` })
				.setDescription(`User <@${member.user.id}> **Joined** the server`)
				.addFields(
					{ name: "Account age", value: `<t:${parseInt(memberlogged.user.createdTimestamp / 1000)}:R>`, inline: false }
				)
				.setFooter({ text: `MemberID: ${member.user.id}` });
			channel.send({ embeds: [logembed] });
		}
	}
};