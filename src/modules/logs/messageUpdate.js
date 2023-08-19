/* eslint-disable no-inline-comments */
const { EmbedBuilder } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: "messageUpdate",
	description: "Loggin bot's beeing added to the server.",
	call: "on", // client.once = 'once', client.on = 'on'
	async execute(oldMessage, newMessage) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel();
		if (oldMessage.guildId !== process.env.SERVER_ID) return;
		if (newMessage.guildId !== process.env.SERVER_ID) return;
		// Data Get
		let mumid;
		const getGuildIDOld = oldMessage.guildId;
		const getGuildIDNew = newMessage.guildId;
		if (getGuildIDOld != null) {mumid = getGuildIDNew;} else {mumid = getGuildIDOld;}
		// eslint-disable-next-line no-unused-vars
		if (getGuildIDNew != null) {mumid = getGuildIDOld;} else {mumid = getGuildIDNew;}
		// Data Check
		if (process.env.LOG_BOTS === "false") {
			if (oldMessage.author.bot === true || newMessage.author.bot === true) {
				return;
			}
		}
		// Old Message
		if(oldMessage.content) {
			if(newMessage.content == null || oldMessage.content === newMessage.content) {
				return;
			}
			let before = oldMessage.content;
			let after = newMessage.content;
			if (before.length > 1024) {
				const slcbef = before.slice(1020);
				const rplcbef = before.replace(slcbef, "...");
				before = rplcbef;
			}
			if (after.length > 1024) {
				const slcaft = after.slice(1020);
				const rplcaft = after.replace(slcaft, "...");
				after = rplcaft;
			}
			if (newMessage.content == null) {
				after = "*Uncached*";
			}
			let icon2 = oldMessage.author.avatarURL();
			if(oldMessage.author.avatar == null) {
				icon2 = "attachment://discord_logo_gray.png";
			}
			const embed = new EmbedBuilder()
				.setAuthor({ name: `${oldMessage.author.tag}`, iconURL: `${icon2}` })
				.setColor("Blue")
				.setDescription(`${oldMessage.author} **Edited** Their [Message](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id} 'The Message ${oldMessage.author.username} Edited.') in Channel ${oldMessage.channel}`)
				.addFields([
					{ name: "Before", value: `${before}` },
					{ name: "After", value: `${after}` }
				])
				.setFooter({ text: `MemberID: ${newMessage.author.id}` })
				.setTimestamp(new Date());
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [embed] });
		} else
		// New Message
			if(newMessage.content) {
				if(newMessage.content == null || newMessage.content === oldMessage.content) {
					return;
				}
				let before = oldMessage.content || "";
				let after = newMessage.content || "";
				if (before) {return;}
				if (after) {return;}
				if (before.length > 1024) {
					const slcbef = before.slice(1020);
					const rplcbef = before.replace(slcbef, "...");
					before = rplcbef;
				}
				if (after.length > 1024) {
					const slcaft = after.slice(1020);
					const rplcaft = after.replace(slcaft, "...");
					after = rplcaft;
				}
				if (oldMessage.content == null) {
					before = "*Uncached*";
				}
				let icon2 = newMessage.author.avatarURL();
				if(newMessage.author.avatar === undefined) {
					icon2 = "attachment://discord_logo_gray.png";
				}
				if(newMessage.author.avatar === null) {
					icon2 = "attachment://discord_logo_gray.png";
				}
				const embed = new EmbedBuilder()
					.setAuthor({ name: `${newMessage.author.tag}`, iconURL: `${icon2}` })
					.setColor("Blue")
					.setDescription(`${newMessage.author} **Edited** Their [Message](https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id} 'The Message ${newMessage.author.username} Edited.') in Channel ${newMessage.channel}`)
					.addFields([
						{ name: "Before:", value: `${before}`, inline: true },
						{ name: "After:", value: `${after}`, inline: true }
					])
					.setFooter({ text: `MemberID: ${newMessage.author.id}` })
					.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [embed] });
			}
	}
};