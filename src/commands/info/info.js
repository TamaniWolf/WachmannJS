/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const { Message } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = {
	name: "info",
	cooldown: 5,
	prefix: "mention",
	async execute(message, args, prefix, commandName, globalclient) {
		if (message == null || message.guild == null || message.channel.id == null
		|| message.guild.id == null) console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command '${this.name}' returned 'null / undefined'.`);
		// Imports
		const { DevCheck } = require("../../tools/utils.js");
		const { TextFileReader } = require("../../tools/functions/txtReader");
		const getGuildID = `${message.guild.id}`;
		const botMaster = await DevCheck.forBotMaster(message.author.id);
		const botMasterRole = await DevCheck.forBotMasterRole(message.author.id);
		const botChannel = await DevCheck.forBotChannel(message.channel.id);
		const lang = require(`../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langError = require(`../../../data/lang/${process.env.BOTLANG}/error.json`);
		const langInfo = lang.cmd.admin.info;

		//  Main Body
		/**
		 * @param {Message} message The Message Object
		 * @param {Object} content The Message content as Object
		 */
		async function messageReply(message, content) {
			if (!message.guild.large) {
				await message.reply(content);
			} else if (message.guild.large) {
				await message.channel.send(content);
			}
		}
		if (!botMasterRole || !botMaster) messageReply(message, { content: langError.permission.admin });
		if (!botChannel) messageReply(message, { content: langError.channel.wrong });
		// @Wachmann info help
		// @Wachmann info wachmann
		// @Wachmann info member <member|memberID>
		// @Wachmann info channel <channel|channelID>
		// @Wachmann info commands
		// @Wachmann info

		let error = false;
		const infoEmbed = new EmbedBuilder()
			.setColor("DarkGreen")
			.setFooter({ text: "/info" });
		// help
		if (args[0] === "help") {
			const data_out = await TextFileReader.read("paragraph", "commandHelp", `data/lang/${process.env.BOTLANG}`, "info");
			messageReply(message, { content: data_out });
		}
		// Bot infos
		if (args[0] === "wachmann") {
			infoEmbed.setTitle(langInfo.titlebot)
				.setThumbnail(globalclient.user.avatarURL({ dynamic: true, size: 512 }))
				.addFields([
					{ name: langInfo.created, value: "<t:1641250800:D>" },
					{ name: langInfo.release, value: "24w49a", inline: true },
					{ name: langInfo.version, value: "2.7.0", inline: true },
					// { name: '\u200B', value: '\u200B' },
					{ name: langInfo.prefix, value: "ㅤ@Wachmann", inline: true },
					{ name: langInfo.id, value: `${globalclient.user.id}`, inline: true }
				]);
			messageReply(message, { embeds: [infoEmbed] });
		}
		// Member infos
		if (args[0] === "member") {
			const memberTag = args[1].toString();
			const memberID = memberTag.replace(/[/</>/@]/g, "");
			if (memberID) {
				const guild = message.client.guilds.cache.get(getGuildID);
				const member = await guild.members.fetch(memberID).catch(() => { error = true; });
				if (error === true) return;
				infoEmbed.setTitle(`${member.user.username}`)
					.setThumbnail(member.user.avatarURL({ dynamic: true, size: 512 }))
					.addFields([
						{ name: langInfo.id, value: `${member.user.id}` },
						{ name: langInfo.roles, value: `${member.roles.cache.map(r => r).join(" ").replace("@everyone", " ") || "None"}` },
						{ name: langInfo.membersince, value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
						{ name: langInfo.joineddiscord, value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true }
					]);
				messageReply(message, { embeds: [infoEmbed] });
			}
		}
		// Channel infos
		if (args[0] === "channel") {
			const channelString = args[2].toString();
			const channelID = channelString.replace(/[/</>/#]/g, "");
			const guild = message.client.guilds.cache.get(getGuildID);
			const channel = await guild.channels.fetch(channelID).catch(() => { error = true; });
			if (error === true) return;
			const category = guild.channels.cache.get(channel.parentId);
			infoEmbed.setTitle(`${guild.name}`)
				.setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
				.addFields([
					{ name: langInfo.name, value: `<#${channel.id}>` },
					{ name: langInfo.id, value: `${channel.id}` }
				]);
			if (category) {
				infoEmbed.addFields([
					{ name: langInfo.category, value: `${category.name}` }
				]);
			}
			infoEmbed.addFields([
				{ name: langInfo.topic, value: `${channel.topic || "None"}` },
				{ name: langInfo.created, value: `<t:${parseInt(channel.createdTimestamp / 1000)}:R>`, inline: true },
				{ name: langInfo.nsfw, value: `${channel.nsfw}`, inline: true }
			]);
			messageReply(message, { embeds: [infoEmbed] });
		}
		// Loaded Commands
		if (args[0] === "commands") {
			const guild = message.client.guilds.cache.get(getGuildID);
			const commandsEnabled = process.env.ENABLE_COMMANDS.split(",");
			const commandCollection = globalclient.commands;
			let enabledCmd = "";
			commandCollection.forEach(obj => {
				const eMap = commandsEnabled.filter(string => string === obj.name);
				enabledCmd += eMap[0] + "\n";
			});
			if (enabledCmd == null || enabledCmd === "") enabledCmd = "None";
			infoEmbed.setTitle("Commands")
				.setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
				.addFields([
					{ name: langInfo.loaded, value: `${enabledCmd}`, inline: true }
				]);
			messageReply(message, { embeds: [infoEmbed] });
		}
	}
};