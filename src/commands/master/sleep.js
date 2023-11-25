// Require and set
const { DateTime } = require("luxon");
const timeFormat = "LL" + "/" + "dd" + "/" + "yyyy" + "-" + "h" + ":" + "mm" + ":" + "ss" + "-" + "a";
require("dotenv").config();

module.exports = {
	name: "sleep",
	cooldown: 5,
	prefix: "false",
	async execute(message, args, prefix, commandName, globalclient) {
		if (message.guild == null) { return; }
		if (message != null || message.channel.id != null) {
			// Context
			const { DevCheck } = require("../../tools/functions/devCheck");
			const { ErrorFileReader } = require("../../tools/functions/errorReader");
			const botMaster = await DevCheck.BotMaster(message);
			const botMasterRole = await DevCheck.BotMasterRole(message);
			const botChannel = await DevCheck.BotChannel(message);
			if (botMasterRole === true || botMaster === true) {
				if (botChannel === true) {
					// eslint-disable-next-line no-console
					console.log(`[${DateTime.utc().toFormat(timeFormat)}] Shutting down.`);
					await message.reply("Going to sleep.");
					globalclient.destroy();
					// Error Messages
				} else {
					await message.reply({ content: await ErrorFileReader.read("wrongchannel", message), ephemeral: true });
				}
			} else {
				await message.reply({ content: await ErrorFileReader.read("nobotdev", message), ephemeral: true });
			}
		} else {
			// eslint-disable-next-line no-console
			console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command 'kill' returned 'null / undefined'.`);
		}
	}
};