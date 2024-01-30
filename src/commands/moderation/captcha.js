/* eslint-disable max-len */
/* eslint-disable no-inner-declarations */
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
				// @Wachmann captcha help
				// @Wachmann captcha reaction set message <messageID>
				// @Wachmann captcha reaction set emoji <emoji>
				// @Wachmann captcha reaction set role <role>
				// @Wachmann captcha reaction set failure <ban|kick>
				// @Wachmann captcha reaction set attempts <amount>
				// @Wachmann captcha reaction send message ```<message>``` [emojis]
				// @Wachmann captcha reaction edit message ```<message>``` [emojis]
				// @Wachmann captcha reaction edit emojis <emojis>
				// @Wachmann captcha reaction edit attempts <amount>
				// @Wachmann captcha reaction off
				const mentionWachmann = prefix;
				const setValue = args[3];
				let setData = "";
				if (mentionWachmann === `<@${process.env.WACHMANN_ID}>`) return;
				if (args[0] === "help") {
					message.reply({ content: "```\n@Wachmann captcha help\n@Wachmann captcha reaction set message <messageID>\n@Wachmann captcha reaction set emoji <emoji>\n@Wachmann captcha reaction set role <role>\n@Wachmann captcha reaction set failure <ban|kick>\n@Wachmann captcha reaction send message ```<message>``` [emojis]\n@Wachmann captcha reaction edit message ```<message>``` [emojis]\n@Wachmann captcha reaction edit emojis <emojis>\n@Wachmann captcha reaction edit attempts <amount>\n@Wachmann captcha reaction off\n```", ephemeral: true });
				}
				if (args[0] === "reaction") {
					const captchaChannel = process.env.CAPTCHA_CHANNEL;
					const guild = await message.client.guilds.fetch(getGuildID);
					const getModerationID = `${guild.id}-${guild.shard.id}-ReactCaptcha`;
					let dataAutoMod = Get.moderationByType(getModerationID, "ReactCaptcha");
					if (args[1] === "set") {
						if (dataAutoMod == null) dataAutoMod = { ModerationID: getModerationID, GuildID: guild.id, Type: "ReactCaptcha", Extra: "undefined-undefined-undefined", Object: "undefined-undefined" };
						const arrayExtra = dataAutoMod.Extra.split("-");
						const arrayObject = dataAutoMod.Object.split("-");
						const emoji = setValue.replace(/<.*?(.*?)>/gi, "$1");
						const emojiID = emoji.replace(":", "");
						const roleID = setValue.replace(/<@&.*?(.*?)>/gi, "$1");

						// -----------------------------------  setText, guild, getModerationID, msgID, faile, attempts, roleID, emojis
						if (args[2] === "message") setCaptcha("Message", guild, getModerationID, setValue, arrayExtra[1], arrayExtra[2], arrayObject[0], arrayObject[1]);
						if (args[2] === "emoji") setCaptcha("Emoji", guild, getModerationID, arrayExtra[0], arrayExtra[1], arrayExtra[2], arrayObject[0], emojiID);
						if (args[2] === "role") setCaptcha("Role", guild, getModerationID, arrayExtra[0], arrayExtra[1], arrayExtra[2], roleID, arrayObject[1]);
						if (args[2] === "failure") setCaptcha("Failure", guild, getModerationID, arrayExtra[0], setValue, arrayExtra[2], arrayObject[0], arrayObject[1]);
						if (args[2] === "attempts") setCaptcha("Attempts", guild, getModerationID, arrayExtra[0], arrayExtra[1], setValue, arrayObject[0], arrayObject[1]);
					}
					if (args[1] === "send" && args[2].startsWith("message")) {
						const msgContent = message.content + " ";
						const extractMsg = msgContent.split("\n```\n");
						let eMsg = extractMsg[2];
						if (extractMsg[2] == null) eMsg = " ";
						const arrayEmojis = eMsg.split(" ");

						globalclient.channels.cache.get(captchaChannel).send({ content: `${extractMsg[1]}`, ephemeral: true }).then(msg => {
							reactEmojis(arrayEmojis, msg);
						});
					}
					if (args[1] === "edit") {
						const data = dataAutoMod.Extra.split("-");
						if (args[2].startsWith("message")) {
							const data = dataAutoMod.Extra.split("-");
							const extractMsg = message.content.split("\n```\n");
							const rMsg = extractMsg[1].replace("\n```", "");
							let eMsg = extractMsg[2];
							if (extractMsg[2] == null) eMsg = " ";
							const arrayEmojis = eMsg.split(" ");
							const msg = await globalclient.channels.cache.get(captchaChannel).messages.fetch(data[0]);
							msg.edit({ content: `${rMsg}`, ephemeral: true }).then(msg => {
								reactEmojis(arrayEmojis, msg);
							});
						}
						if (args[2].startsWith("emojis")) {
							const extractMsg = message.content.replace("reaction edit emojis ", "");
							const arrayEmojis = extractMsg.split(" ");
							const msg = await globalclient.channels.cache.get(captchaChannel).messages.fetch(data[0]);
							msg.reactions.removeAll().then(msg => {
								reactEmojis(arrayEmojis, msg);
							});
						}
						if (args[2].startsWith("attempts")) {
							const arrayExtra = dataAutoMod.Extra.split("-");
							const arrayObject = dataAutoMod.Object.split("-");
							setCaptcha("Attempts", guild, getModerationID, arrayExtra[0], arrayExtra[1], setValue, arrayObject[0], arrayObject[1]);
						}
					}
					if (args[1] === "off") {
						globalclient.channels.cache.get(logChannel).send({ content: "Reaction Captcha got removed.", ephemeral: true });
						Del.moderationByType(getModerationID, "ReactCaptcha");
						return;
					}
				}
				// Functions
				function reactEmojis(emojis, msg) {
					const ae = emojis;
					if (ae[0] != null) if (ae[0].length !== 0) msg.react(ae[0]);
					if (ae[1] != null) if (ae[1].length !== 0) msg.react(ae[1]);
					if (ae[2] != null) if (ae[2].length !== 0) msg.react(ae[2]);
					if (ae[3] != null) if (ae[3].length !== 0) msg.react(ae[3]);
					if (ae[4] != null) if (ae[4].length !== 0) msg.react(ae[4]);
					if (ae[5] != null) if (ae[5].length !== 0) msg.react(ae[5]);
					if (ae[6] != null) if (ae[6].length !== 0) msg.react(ae[6]);
					if (ae[7] != null) if (ae[7].length !== 0) msg.react(ae[7]);
					if (ae[8] != null) if (ae[8].length !== 0) msg.react(ae[8]);
					if (ae[9] != null) if (ae[9].length !== 0) msg.react(ae[9]);
				}
				function setCaptcha(setText, guild, getModerationID, msgID, faile, attempts, roleID, emojis) {
					setData = { ModerationID: getModerationID, GuildID: guild.id, Type: "ReactCaptcha", Extra: `${msgID}-${faile}-${attempts}`, Object: `${roleID}-${emojis}` };
					globalclient.channels.cache.get(logChannel).send({ content: `${setText} for Reaction Captcha got set.`, ephemeral: true });
					Set.moderation(setData);
					return;
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