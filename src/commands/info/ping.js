/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const { Message } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = {
	name: "ping",
	cooldown: 5,
	prefix: "mention",
	async execute(message, args, prefix, commandName, globalclient) {
		if (message == null || message.guild == null || message.channel.id == null
		|| message.guild.id == null) return console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command '${this.name}' returned 'null / undefined'.`);
		// Imports
		const { DevCheck } = require("../../tools/utils.js");
		const { LanguageConvert } = require("../../tools/functions/languageConvert.js");
		const botMaster = await DevCheck.forBotMaster(message.author.id);
		const botMasterRole = await DevCheck.forBotMasterRole(message.author.id);
		const botChannel = await DevCheck.forBotChannel(message.channel.id);
		const lang = require(`../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langError = require(`../../../data/lang/${process.env.BOTLANG}/error.json`);
		const langPing = lang.cmd.admin.ping;

		// Main Body
		/**
		 * @param {Message} message The Message Object
		 * @param {Object} content The Message content as Object
		 * @returns {Promise<void>} Message Reply
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
		const latency = DateTime.now() - message.createdTimestamp;
		// eslint-disable-next-line no-undef
		const api_latence = Math.round(globalclient.ws.ping);
		messageReply(message, LanguageConvert.lang(langPing.pong, latency, api_latence));
		console.log("[" + DateTime.utc().toFormat(timeFormat) + `][Wachmann] Ping Pong!\nLatency is ${latency}ms. API Latency is ${api_latence}ms`);
	}
};
