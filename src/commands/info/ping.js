/* eslint-disable no-console */
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
			const { ErrorFileReader } = require("../../tools/functions/errorReader");
			const botMaster = await DevCheck.BotMaster(message);
			const botMasterRole = await DevCheck.BotMasterRole(message);
			const botChannel = await DevCheck.BotChannel(message);
			if (botMasterRole === true || botMaster === true) {
				if (botChannel === true) {
					const latency = DateTime.now() - message.createdTimestamp;
					// eslint-disable-next-line no-undef
					const api_latence = Math.round(globalclient.ws.ping);
					await message.reply(`pong!\n\n...Why did I do this?\n\n(🏓Latency is ${latency}ms. API Latency is ${api_latence}ms)`);
					console.log("[" + DateTime.utc().toFormat(timeFormat) + `][Wachmann] Ping Pong!\nLatency is ${latency}ms. API Latency is ${api_latence}ms`);
					// Error Messages
				} else {
					await message.reply({ content: await ErrorFileReader.read("wrongchannel", message), ephemeral: true });
				}
			} else {
				await message.reply({ content: await ErrorFileReader.read("nobotdev", message), ephemeral: true });
			}
		} else {
			console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command 'ping' returned 'null / undefined'.`);
		}
	}
};
