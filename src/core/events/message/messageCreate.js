/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const { Events, Message, Collection } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "LL" + "/" + "dd" + "/" + "yyyy" + "-" + "h" + ":" + "mm" + ":" + "ss" + "-" + "a";
require("dotenv").config();

module.exports = {
	name: Events.MessageCreate,
	once: false,
	/**
     * @param {Message} message
     */
	async execute(message) {

		// eslint-disable-next-line no-undef
		const client = globalclient;
		const { InterBotCom } = require("../../../modules/interBotCom/interBotCom.js");
		if (process.env.ENABLE_MODULES.indexOf("interbotcom") >= 0 && InterBotCom != null) InterBotCom.Init(message);

		// Check for Bot.
		if (!message.author || message.author.bot) return null;

		const langError = require(`../../../../data/lang/${process.env.BOTLANG}/error.json`);

		// Get Arguments and Command Name from Message.
		let prefix = null;
		const startsWithPrefix = message.content.startsWith(process.env.PREFIX);
		const startsWithWachmann = message.content.startsWith(`<@${process.env.WACHMANN_ID}>`);

		let msg = message.content.toLowerCase();
		let args = null;

		if (startsWithPrefix) {
			msg = msg.replace(process.env.PREFIX, "");
			args = msg.split(/ +/);
			prefix = process.env.PREFIX;
		} else if (startsWithWachmann) {
			msg = msg.replace(`<@${process.env.WACHMANN_ID}> `, "");
			args = msg.split(/ +/);
			prefix = `<@${process.env.WACHMANN_ID}>`;
		} else {
			return null;
		}

		const cmdArgs = args;
		const commandName = cmdArgs.shift().toLowerCase();
		if (!commandName) {
			return null;
		}

		// Command Cooldown
		const { cooldowns } = client;
		const command = client.commands.get(commandName);
		if (command == null) return null;

		if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 1) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
			if (now < expirationTime) return null;
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		// Execute Command
		if (command.prefix === "custom") {
			try {
				if (startsWithPrefix) {
					command.execute(message, args, prefix, commandName, client);
				}
			} catch (error) {
				console.error(`[${DateTime.utc().toFormat(timeFormat)}][messageCreate.js]\n`, error);
				message.channel.send({ content: langError.command.execute });
			}
		} else if (command.prefix === "mention") {
			try {
				if (startsWithWachmann) {
					command.execute(message, args, prefix, commandName, client);
				}
			} catch (error) {
				console.error(`[${DateTime.utc().toFormat(timeFormat)}][messageCreate.js]\n`, error);
				message.channel.send({ content: langError.command.execute });
			}
		} else if (command.prefix === "slash") {
			return null;
		} else {
			console.error(`[${DateTime.utc().toFormat(timeFormat)}][messageCreate.js] command.prefix is not boolean.`);
			message.channel.send({ content: langError.command.execute });
		}
	}
};
