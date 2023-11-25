/* eslint-disable no-console */
// Require and set
const { DateTime } = require("luxon");
const timeFormat = "LL" + "/" + "dd" + "/" + "yyyy" + "-" + "h" + ":" + "mm" + ":" + "ss" + "-" + "a";
require("dotenv").config();

module.exports = {
	name: "help",
	cooldown: 5,
	prefix: "false",
	async execute(message) {
		if (message != null || message.channel.id != null || message.guild.id != null) {
			// Context
			const { DevCheck } = require("../../tools/functions/devCheck");
			const { TextFileReader } = require("../../tools/functions/txtReader");
			const { ErrorFileReader } = require("../../tools/functions/errorReader");
			const botMaster = await DevCheck.BotMaster(message);
			const botMasterRole = await DevCheck.BotMasterRole(message);
			const botChannel = await DevCheck.BotChannel(message);
			if (message.guild == null || botChannel === true) {
				const data_out = await TextFileReader.read("help", message);
				const sleep = async (ms) => await new Promise(r => setTimeout(r, ms));
				// eslint-disable-next-line no-undef
				const fetch_dm_user = await globalclient.users.fetch(message.author.id);
				if (!Array.isArray(data_out)) fetch_dm_user.send({ content: data_out });

				if (Array.isArray(data_out)) {
					data_out.forEach(async (item) => {

						if (item.length >= 1999) console.error("Text Paragraph too long.");

						fetch_dm_user.send({ content: item });
						await sleep(1000);
					});
				}
				// Error Messages
			} else if (botMasterRole === true || botMaster === true) {
				await message.reply({ content: await ErrorFileReader.read("wrongchannel", message), ephemeral: true });
			}
		} else {
			console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command 'adminhelp' returned 'null / undefined'.`);
		}
	}
};
