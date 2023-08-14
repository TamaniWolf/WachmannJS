// Require and set
const { DateTime } = require("luxon");
const fs = require("node:fs");
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
			const botMaster = await DevCheck.BotMaster(message);
			const botMasterRole = await DevCheck.BotMasterRole(message);
			const botChannel = await DevCheck.BotChannel(message);
			if (message.guild == null || botChannel === true) {
				// eslint-disable-next-line no-inner-declarations
				function read(file, callback) {
					fs.readFile(file, "utf8", function(err, data) {
						if (err) {
							// eslint-disable-next-line no-console
							console.log(err);
						}
						callback(data);
					});
				}
				read("data/text/help.txt", async function(data) {
					const a = data.replace("%s", `<@${message.author.id}>`);
					// eslint-disable-next-line no-undef
					const b = await globalclient.users.fetch(message.author.id);
					b.send({ content: a });
				});
				// Error Messages
			} else if (botMasterRole === true || botMaster === true) {
				await message.reply({ content: "Nope, not here, try somewhere else.", ephemeral: true });
			}
		} else {
			// eslint-disable-next-line no-console
			console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command 'adminhelp' returned 'null / undefined'.`);
		}
	}
};
