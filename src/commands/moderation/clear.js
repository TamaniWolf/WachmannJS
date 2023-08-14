// Require and set
const { DateTime } = require("luxon");
const timeFormat = "LL" + "/" + "dd" + "/" + "yyyy" + "-" + "h" + ":" + "mm" + ":" + "ss" + "-" + "a";
require("dotenv").config();

module.exports = {
	name: "clear",
	cooldown: 5,
	prefix: "false",
	async execute(message, args, prefix, commandName, globalclient) {
		if (message.guild == null) { return; }
		if (message != null || message.channel.id != null || message.guild.id != null) {
			// Data Get
			const getGuildID = `${message.guild.id}`;
			const getChannelID = `${message.channel.id}`;
			// Context
			const { DevCheck } = require("../../tools/functions/devCheck");
			const botMaster = await DevCheck.BotMaster(message);
			const botMasterRole = await DevCheck.BotMasterRole(message);
			const logChannel = await DevCheck.LogChannel();
			if (botMasterRole === true || botMaster === true) {
				const mentionWachmann = prefix;
				const stringAmount = args[0];
				const stringUser = args[3];
				if (mentionWachmann === `<@${process.env.WACHMANN_ID}>`) {return;}
				if (isNaN(stringAmount)) {
					message.reply({ content: "Sorry but that's not working. It must be a Nummber." });
					return;
				}
				const guild = await message.client.guilds.fetch(getGuildID);
				const channel = await guild.channels.fetch(getChannelID);
				if (stringAmount > 100) {
					await message.reply({ content: "Sorry, but I only can do 100 at a time.", ephemeral: true });
				} else
					if (stringAmount <= 100) {
						let messages = await channel.messages.fetch({ limit: stringAmount });
						let embedMsg = `${messages.size} Messages from the past Two weeks got cleared.`;
						// Delete user messages
						if (args[1] === "messages" && args[2] === "of") {
							if (stringUser) {
								messages = await channel.messages.fetch({ limit: 100 });
								messages = messages.filter((m) => m.author.id == stringUser.id);
								messages = messages.map(function(obj) {return obj;});
								messages = messages.slice(0, stringAmount);
								embedMsg = `${messages.length} Messages from ${stringUser} of the past Two weeks got cleared.`;
							}
						}
						// Delete the message
						await channel.bulkDelete(messages, true);
						globalclient.channels.cache.get(logChannel).send({ content: `**Cleard Messages:** \n${embedMsg}`, ephemeral: true });
						// await message.reply({ content: `**Cleard Messages:** \n${embedMsg}`, ephemeral: true })
					}
				// Error Messages
			} else {
				await message.reply({ content: "Yeah sorry, but you are not in charge of me.", ephemeral: true });
			}
		} else {
			// eslint-disable-next-line no-console
			console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command 'clear' returned 'null / undefined'.`);
		}
	}
};