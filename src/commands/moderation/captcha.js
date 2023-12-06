/* eslint-disable no-console */
// Require and set
const { DateTime } = require("luxon");
const timeFormat = "LL" + "/" + "dd" + "/" + "yyyy" + "-" + "h" + ":" + "mm" + ":" + "ss" + "-" + "a";
require("dotenv").config();

module.exports = {
	name: "captcha",
	cooldown: 5,
	prefix: "false",
	async execute(message, args, prefix, commandName, globalclient) {
		if (message.guild == null) return;
		if (message != null || message.channel.id != null || message.guild.id != null) {
			// Data Get
			const getGuildID = `${message.guild.id}`;
			// Context
			const { DevCheck } = require("../../tools/functions/devCheck");
			const { ErrorFileReader } = require("../../tools/functions/errorReader");
			const { Get, Set, Del } = require("../../tools/functions/sqlite/prepare");
			const botMaster = await DevCheck.BotMaster(message);
			const botMasterRole = await DevCheck.BotMasterRole(message);
			const logChannel = await DevCheck.LogChannel(getGuildID);
			if (botMasterRole === true || botMaster === true) {
				// console.log(args);
				// return;
				// @Wachmann captcha help
				// @Wachmann captcha reaction set message <messageID>
				// @Wachmann captcha reaction set emoji <emoji>
				// @Wachmann captcha reaction set role <role>
				// @Wachmann captcha reaction set failure <ban|kick>
				// @Wachmann captcha reaction off
				const mentionWachmann = prefix;
				const stringThree = args[3];
				if (mentionWachmann === `<@${process.env.WACHMANN_ID}>`) return;
				if (args[0] === "help") {
					message.reply({ content: "```\n@Wachmann captcha help\n@Wachmann captcha reaction set message <messageID>\n@Wachmann captcha reaction set emoji <emoji>\n@Wachmann captcha reaction set role <role>\n@Wachmann captcha reaction set failure <ban|kick>\n@Wachmann captcha reaction off\n```", ephemeral: true });
				}
				if (args[0] === "reaction") {
					const guild = await message.client.guilds.fetch(getGuildID);
					const getModerationID = `${guild.id}-${guild.shard.id}-ReactCaptcha`;
					if (args[1] === "set") {
						let setData = "";

						let dataAutoMod = Get.moderationByType(getModerationID, "ReactCaptcha");
						if (dataAutoMod == null) dataAutoMod = { ModerationID: getModerationID, GuildID: guild.id, Type: "ReactCaptcha", Extra: "undefined-undefined-undefined", Object: "Role-undefined" };
						// if (dataAutoMod == null) return console.log("No Captcha Moderation found.");
						const arrayExtra = dataAutoMod.Extra.split("-");
						const arrayObject = dataAutoMod.Object.split("-");

						if (args[2] === "message") {
							setData = { ModerationID: getModerationID, GuildID: guild.id, Type: "ReactCaptcha", Extra: `${args[3]}-${arrayExtra[1]}-${arrayExtra[1]}`, Object: `Role-${arrayObject[1]}` };
							globalclient.channels.cache.get(logChannel).send({ content: "Message for Reaction Captcha got set.", ephemeral: true });
							Set.moderation(setData);
							return;
						}
						if (args[2] === "emoji") {
							const emoji = stringThree.replace(/<.*?(.*?)>/gi, "$1");
							const emojiID = emoji.replace(":", "");
							setData = { ModerationID: getModerationID, GuildID: guild.id, Type: "ReactCaptcha", Extra: `${arrayExtra[0]}-${arrayExtra[1]}-${emojiID}`, Object: `Role-${arrayObject[1]}` };
							globalclient.channels.cache.get(logChannel).send({ content: "Emoji for Reaction Captcha got set.", ephemeral: true });
							Set.moderation(setData);
							return;
						}
						if (args[2] === "role") {
							const roleID = stringThree.replace(/<@&.*?(.*?)>/gi, "$1");
							setData = { ModerationID: getModerationID, GuildID: guild.id, Type: "ReactCaptcha", Extra: `${arrayExtra[0]}-${arrayExtra[1]}-${arrayExtra[2]}`, Object: `Role-${roleID}` };
							globalclient.channels.cache.get(logChannel).send({ content: "Role for Reaction Captcha got set.", ephemeral: true });
							Set.moderation(setData);
							return;
						}
						if (args[2] === "failure") {
							setData = { ModerationID: getModerationID, GuildID: guild.id, Type: "ReactCaptcha", Extra: `${arrayExtra[0]}-${stringThree}-${arrayExtra[2]}`, Object: `Role-${arrayObject[1]}` };
							globalclient.channels.cache.get(logChannel).send({ content: "Failure for Reaction Captcha got set.", ephemeral: true });
							Set.moderation(setData);
							return;
						}
					}
					if (args[1] === "off") {
						globalclient.channels.cache.get(logChannel).send({ content: "Reaction Captcha got removed.", ephemeral: true });
						Del.moderationByType(getModerationID, "ReactCaptcha");
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