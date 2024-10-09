/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const { Message, Interaction } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = {
	name: "help",
	cooldown: 5,
	prefix: "mention",
	async execute(message, args, prefix, commandName, globalclient) {
		// // Interaction
		// if (message.constructor === Interaction) {
		// 	//
		// }
		// // Message
		// if (message.constructor === Message) {
		// 	//
		// }

		if (message == null) return console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command '${this.name}' returned 'null / undefined'.`);
		// Imports
		const { Utils, DevCheck, TextFileReader } = require("../../tools/utils.js");
		const botMaster = await DevCheck.forBotMaster(message.author.id);
		const botMasterRole = await DevCheck.forBotMasterRole(message.author.id);
		const botChannel = await DevCheck.forBotChannel(message.channel.id);
		const langError = require(`../../../data/lang/${process.env.BOTLANG}/error.json`);

		// Main Body
		if (!botMasterRole || !botMaster) Utils.messageReply(message, { content: langError.permission.admin });
		if (!botChannel) Utils.messageReply(message, { content: langError.channel.wrong });

		const data_out = await TextFileReader.read("file", "help", `data/lang/${process.env.BOTLANG}`);
		const data_new = data_out.replace("%s", `<@${message.author.id}>`);
		// const sleep = async (ms) => await new Promise(r => setTimeout(r, ms));
		// eslint-disable-next-line no-undef
		const fetch_dm_user = await globalclient.users.fetch(message.author.id);
		if (!Array.isArray(data_new)) fetch_dm_user.send({ content: data_new }).catch(async () => console.info("This User is not allowing DMs."));

		if (Array.isArray(data_new)) {
			data_new.forEach(async (item) => {

				if (item.length >= 1999) console.info("[help.txt] Text Paragraph too long.");

				fetch_dm_user.send({ content: item }).catch(async () => console.info("This User is not allowing DMs."));
				// await sleep(1000);
			});
		}
	}
};
