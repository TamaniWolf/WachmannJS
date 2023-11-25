// Require and set
const { DateTime } = require("luxon");
const timeFormat = "LL" + "/" + "dd" + "/" + "yyyy" + "-" + "h" + ":" + "mm" + ":" + "ss" + "-" + "a";
require("dotenv").config();

module.exports = {
	name: "autoban",
	cooldown: 5,
	prefix: "false",
	async execute(message, args, prefix, commandName, globalclient) {
		if (message.guild == null) { return; }
		if (message != null || message.channel.id != null || message.guild.id != null) {
			// Data Get
			const getGuildID = `${message.guild.id}`;
			// Context
			const { DevCheck } = require("../../tools/functions/devCheck");
			const { ErrorFileReader } = require("../../tools/functions/errorReader");
			const { Set, Del } = require("../../tools/functions/sqlite/prepare");
			const botMaster = await DevCheck.BotMaster(message);
			const botMasterRole = await DevCheck.BotMasterRole(message);
			const logChannel = await DevCheck.LogChannel(getGuildID);
			if (botMasterRole === true || botMaster === true) {
				// @Wachmann autoban help
				// @Wachmann autoban accounts yunger then <1...255> <hours|days|months>
				// @Wachmann autoban accounts yunger then off
				const mentionWachmann = prefix;
				const stringDateLatter = args[4];
				const stringDateNumber = args[3];
				if (mentionWachmann === `<@${process.env.WACHMANN_ID}>`) return;
				if (args[0] === "help") {
					message.reply({ content: "```\n@Wachmann autoban help\n@Wachmann autoban accounts yunger then <1...255> <hours|days|months>\n@Wachmann autoban accounts yunger then off\n```", ephemeral: true });
				}
				if (args[0] === "accounts" && args[1] === "yunger" && args[2] === "then") {
					const guild = await message.client.guilds.fetch(getGuildID);
					const getModerationID = `${guild.id}-${guild.shard.id}-AccountAge`;
					let setData = "";

					if (stringDateNumber === "off") {
						globalclient.channels.cache.get(logChannel).send({ content: "Min. Account join Age got removed.", ephemeral: true });
						Del.moderationByType(getModerationID, "AccountAge");
						return;
					}
					if (isNaN(stringDateNumber)) {
						message.reply({ content: "Sorry but that's not working. Wrong Number argument." });
						return;
					}

					if (stringDateNumber !== "off" && !isNaN(stringDateNumber)) {
						setData = { ModerationID: getModerationID, GuildID: guild.id, Type: "AccountAge", Extra: `${stringDateLatter}-${stringDateNumber}` };
						globalclient.channels.cache.get(logChannel).send({ content: "Min. Account join Age got added.", ephemeral: true });
						Set.moderation(setData);
						return;
					}
				}
				// Error Messages
			} else {
				await message.reply({ content: await ErrorFileReader.read("nobotdev", message), ephemeral: true });
			}
		} else {
			// eslint-disable-next-line no-console
			console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command 'autoban' returned 'null / undefined'.`);
		}
	}
};