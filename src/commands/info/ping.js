// Require and set
const { DateTime } = require("luxon");
const timeFormat = "LL" + "/" + "dd" + "/" + "yyyy" + "-" + "h" + ":" + "mm" + ":" + "ss" + "-" + "a";
require("dotenv").config();

module.exports = {
	name: "ping",
	cooldown: 5,
	prefix: "false",
	async execute(message) {
		if (message.guild == null) { return; }
		if (message != null || message.channel.id != null || message.guild.id != null) {
			// Context
			const { DevCheck } = require("../../tools/functions/devCheck");
			const botMaster = await DevCheck.BotMaster(message);
			const botMasterRole = await DevCheck.BotMasterRole(message);
			const botChannel = await DevCheck.BotChannel(message);
			if (botMasterRole === true || botMaster === true) {
				if (botChannel === true) {
					await message.reply("pong!\n\n...Why did I do this?");
					// eslint-disable-next-line no-console
					console.log("[" + DateTime.utc().toFormat(timeFormat) + "][Wachmann] Ping Pong!");
					// Error Messages
				} else {
					await message.reply({ content: "Nope, not here, try somewhere else.", ephemeral: true });
				}
			} else {
				await message.reply({ content: "Yeah sorry, but you are not in charge of me.", ephemeral: true });
			}
		} else {
			// eslint-disable-next-line no-console
			console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command 'ping' returned 'null / undefined'.`);
		}
	}
};
