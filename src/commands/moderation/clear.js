/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const { Message } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = {
	name: "clear",
	cooldown: 5,
	prefix: "mention",
	async execute(message, args, prefix, commandName, globalclient) {
		if (message == null || message.channel.id == null || message.guild == null
		|| message.guild.id == null) return console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command '${this.name}' returned 'null / undefined'.`);
		// Data Get
		const getGuildID = `${message.guild.id}`;
		const getChannelID = `${message.channel.id}`;
		// Context
		const { DevCheck } = require("../../tools/utils.js");
		const { TextFileReader } = require("../../tools/functions/txtReader");
		const { LanguageConvert } = require("../../tools/functions/languageConvert.js");
		const botMaster = await DevCheck.forBotMaster(message.author.id);
		const botMasterRole = await DevCheck.forBotMasterRole(message.author.id);
		const botChannel = await DevCheck.forBotChannel(message.channel.id);
		const logChannel = await DevCheck.forLogChannel(getGuildID);
		const lang = require(`../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langError = require(`../../../data/lang/${process.env.BOTLANG}/error.json`);
		const langClear = lang.cmd.admin.clear;

		// Main body
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
		if (!botMasterRole || !botMaster) return messageReply(message, { content: langError.permission.admin });
		if (!botChannel) return messageReply(message, { content: langError.channel.wrong });
		const stringAmount = args[0];
		const stringUser = args[3];
		if (args[0] === "help") {
			const data_out = await TextFileReader.read("paragraph", "commandHelp", `data/lang/${process.env.BOTLANG}`, "clear");
			messageReply(message, { content: data_out, ephemeral: true });
		}
		if (isNaN(stringAmount)) {
			messageReply(message, { content: langClear.notanumber });
			return;
		}
		const guild = await message.client.guilds.fetch(getGuildID);
		const channel = await guild.channels.fetch(getChannelID);
		if (stringAmount > 100) {
			messageReply(message, { content: langClear.max, ephemeral: true });
		}
		if (stringAmount <= 100) {
			let messages = await channel.messages.fetch({ limit: stringAmount });
			let embedMsg = LanguageConvert.lang(langClear.msg, messages.size);
			// Delete user messagess
			if (args[1] === "messages" && args[2] === "of") {
				if (stringUser) {
					messages = await channel.messages.fetch({ limit: 100 });
					messages = messages.filter((m) => m.author.id == stringUser.id);
					messages = messages.map(function(obj) { return obj; });
					messages = messages.slice(0, stringAmount);
					embedMsg = LanguageConvert.lang(langClear.user, messages.length, stringUser);
				}
			}
			// Delete the message
			await channel.bulkDelete(messages, true);
			globalclient.channels.cache.get(logChannel).send({ content: `**${langClear.title}:** \n${embedMsg}`, ephemeral: true });
		}
	}
};