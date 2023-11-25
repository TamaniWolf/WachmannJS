/* eslint-disable no-console */
// Require and set
const Discord = require("discord.js");
const { EmbedBuilder } = Discord;
const { DateTime } = require("luxon");
const timeFormat = "LL" + "/" + "dd" + "/" + "yyyy" + "-" + "h" + ":" + "mm" + ":" + "ss" + "-" + "a";
require("dotenv").config();

module.exports = {
	name: "tell",
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
					const tellMeAbout = `<@${process.env.WACHMANN_ID}> tell me about`;
					// Bot
					const botAliasis1 = message.content.startsWith(`${tellMeAbout} you`);
					const botAliasis2 = message.content.startsWith(`${tellMeAbout} yourself`);
					const botAliasis3 = message.content.startsWith(`${tellMeAbout} your self`);
					const botAliasis4 = message.content.startsWith(`${tellMeAbout} <@${process.env.WACHMANN_ID}>`);
					if (botAliasis1 || botAliasis2 || botAliasis3 || botAliasis4) {
						const configEmbed = new EmbedBuilder()
							.setColor("DarkGreen")
							.setTitle("Wachmann")
							.setThumbnail(globalclient.user.avatarURL({ dynamic: true, size: 512 }))
							.addFields([
								{ name: "Created:", value: "April the 5th of 2020." },
								{ name: "Release:", value: "23w32a", inline: true },
								{ name: "Version:", value: "2.0.0", inline: true },
								// { name: '\u200B', value: '\u200B' },
								{ name: "Prefix:", value: `ㅤ${process.env.PREFIX}`, inline: true },
								{ name: "ID", value: `${globalclient.user.id}`, inline: true }
							]);
						await message.reply({ embeds: [configEmbed] });
					}
					// Member
					if (message.content.startsWith(`${tellMeAbout} <@`) && !botAliasis4) {
						const stringChannelId = args[2].toString();
						const stringGetUser = stringChannelId.replace(/[/</>/@]/g, "");
						if (stringGetUser) {
							const guild = message.client.guilds.cache.get(getGuildID);
							const memberTagged = await guild.members.fetch(stringGetUser);
							const infoUserEmbed = new EmbedBuilder()
								.setColor("DarkGreen")
								.setTitle(`${memberTagged.user.username}`)
								.setThumbnail(memberTagged.user.avatarURL({ dynamic: true, size: 512 }))
								.addFields([
									{ name: "ID:", value: `${memberTagged.user.id}` },
									{ name: "Roles:", value: `${memberTagged.roles.cache.map(r => r).join(" ").replace("@everyone", " ") || "None"}` },
									{ name: "Joined Server:", value: `<t:${parseInt(memberTagged.joinedTimestamp / 1000)}:R>`, inline: true },
									{ name: "Joined Discord:", value: `<t:${parseInt(memberTagged.user.createdTimestamp / 1000)}:R>`, inline: true }
								]);
							await message.reply({ embeds: [infoUserEmbed] });
						}
					}
					// Channel
					if (message.content.startsWith(`${tellMeAbout} <#`)) {
						const stringChannelId = args[2].toString();
						const stringGetChannel = stringChannelId.replace(/[/</>/#]/g, "");
						const channelId = stringGetChannel;
						const guild = message.client.guilds.cache.get(getGuildID);
						const channel = await guild.channels.fetch(channelId);
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