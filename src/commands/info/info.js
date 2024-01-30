/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
// Require and set
const Discord = require("discord.js");
const { EmbedBuilder } = Discord;
const { DateTime } = require("luxon");
const timeFormat = "LL" + "/" + "dd" + "/" + "yyyy" + "-" + "h" + ":" + "mm" + ":" + "ss" + "-" + "a";
require("dotenv").config();

module.exports = {
	name: "info",
	cooldown: 5,
	prefix: "false",
	async execute(message, args, prefix, commandName, globalclient) {
		if (message.guild == null) { return; }
		if (message != null || message.channel.id != null || message.guild.id != null) {
			// Data Get
			const getGuildID = `${message.guild.id}`;
			// Context
			const { DevCheck } = require("../../tools/functions/devCheck");
			const { ErrorFileReader } = require("../../tools/functions/errorReader");
			const botMaster = await DevCheck.BotMaster(message);
			const botMasterRole = await DevCheck.BotMasterRole(message);
			const botChannel = await DevCheck.BotChannel(message);
			if (botMasterRole === true || botMaster === true) {
				if (botChannel === true) {
					const mentionWachmann = prefix;
					if (mentionWachmann === `<@${process.env.WACHMANN_ID}>`) {return;}
					// @Wachmann info help
					// @Wachmann info wachmann
					// @Wachmann info member <member|memberID>
					// @Wachmann info channel <channel|channelID>
					// @Wachmann info commands
					// @Wachmann info
					let error = false;
					// help
					if (args[0] === "help") {
						await message.reply({ content: "**Help - Info**\n```\n@Wachmann info help\n@Wachmann info wachmann\n@Wachmann info member <member|memberID>\n@Wachmann info channel <channel|channelID>\n@Wachmann info commands\n```", ephemeral: true });
					}
					// Bot infos
					if (args[0] === "wachmann") {
						const infoBotEmbed = new EmbedBuilder()
							.setColor("DarkGreen")
							.setTitle("Wachmann")
							.setThumbnail(globalclient.user.avatarURL({ dynamic: true, size: 512 }))
							.addFields([
								{ name: "Created", value: "January the 4th of 2022." },
								{ name: "Release", value: "23w49a", inline: true },
								{ name: "Version", value: "2.6.2", inline: true },
								// { name: '\u200B', value: '\u200B' },
								{ name: "Prefix", value: "ㅤ@Wachmann", inline: true },
								{ name: "ID", value: `${globalclient.user.id}`, inline: true }
							]);
						await message.reply({ embeds: [infoBotEmbed] });
					}
					// Member infos
					if (args[0] === "member") {
						const memberTag = args[1].toString();
						const memberID = memberTag.replace(/[/</>/@]/g, "");
						if (memberID) {
							const guild = message.client.guilds.cache.get(getGuildID);
							const member = await guild.members.fetch(memberID).catch(err=>{error = true;});
							if (error === true) return;
							const infoUserEmbed = new EmbedBuilder()
								.setColor("DarkGreen")
								.setTitle(`${member.user.username}`)
								.setThumbnail(member.user.avatarURL({ dynamic: true, size: 512 }))
								.addFields([
									{ name: "ID", value: `${member.user.id}` },
									{ name: "Roles", value: `${member.roles.cache.map(r => r).join(" ").replace("@everyone", " ") || "None"}` },
									{ name: "Member since", value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
									{ name: "Joined Discord", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true }
								]);
							await message.reply({ embeds: [infoUserEmbed] });
						}
					}
					// Channel infos
					if (args[0] === "channel") {
						const channelString = args[2].toString();
						const channelID = channelString.replace(/[/</>/#]/g, "");
						const guild = message.client.guilds.cache.get(getGuildID);
						const channel = await guild.channels.fetch(channelID).catch(err=>{error = true;});
						if (error === true) return;
						const category = guild.channels.cache.get(channel.parentId);
						const infoChannelEmbed = new EmbedBuilder()
							.setColor("DarkGreen")
							.setTitle(`${guild.name}`)
							.setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
							.addFields([
								{ name: "Name", value: `<#${channel.id}>` },
								{ name: "ID", value: `${channel.id}` }
							]);
						if (category) {
							infoChannelEmbed.addFields([
								{ name: "Category", value: `${category.name}` }
							]);
						}
						infoChannelEmbed.addFields([
							{ name: "Topic", value: `${channel.topic || "None"}` },
							{ name: "Created", value: `<t:${parseInt(channel.createdTimestamp / 1000)}:R>`, inline: true },
							{ name: "NSFW", value: `${channel.nsfw}`, inline: true }
						]);
						await message.reply({ embeds: [infoChannelEmbed] });
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
						const infoCommands = new EmbedBuilder()
							.setColor("DarkGreen")
							.setTitle("Commands")
							.setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
							.addFields([
								{ name: "Loaded", value: `${enabledCmd}`, inline: true }
							]);
						await message.reply({ embeds: [infoCommands] });
					}
					// Error Messages
				} else {
					await message.reply({ content: await ErrorFileReader.read("wrongchannel", message), ephemeral: true });
				}
			} else {
				await message.reply({ content: await ErrorFileReader.read("nobotdev", message), ephemeral: true });
			}
		} else {
			console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command 'info' returned 'null / undefined'.`);
		}
	}
};