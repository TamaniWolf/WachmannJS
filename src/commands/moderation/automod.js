/* eslint-disable max-len */
/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const { Message } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = {
	name: "automod",
	cooldown: 5,
	prefix: "mention",
	async execute(message, args, prefix, commandName, globalclient) {
		if (message == null || message.channel.id == null || message.guild == null
		|| message.guild.id == null) return console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command '${this.name}' returned 'null / undefined'.`);
		// Imports
		const { DevCheck } = require("../../tools/utils.js");
		const { TextFileReader } = require("../../tools/functions/txtReader");
		const { Get, Set, Del } = require("../../tools/db.js");
		const getGuildID = `${message.guild.id}`;
		const botMaster = await DevCheck.forBotMaster(message.author.id);
		const botMasterRole = await DevCheck.forBotMasterRole(message.author.id);
		const botChannel = await DevCheck.forBotChannel(message.channel.id);
		const logChannel = await DevCheck.forLogChannel(getGuildID);
		const lang = require(`../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langError = require(`../../../data/lang/${process.env.BOTLANG}/error.json`);
		const langAutoban = lang.cmd.admin.autoban;

		// Main Body
		/**
		 * @param {Message} message The Message Object
		 * @param {Object} content The Message content as Object
		 */
		async function messageReply(message, content) {
			if (!message.guild.large) {
				await message.reply(content);
			} else if (message.guild.large) {
				await message.channel.send(content);
			}
		}
		if (!botMasterRole || !botMaster) return messageReply(message, { content: langError.permission.admin });
		if (!botChannel) return messageReply(message, { content: langError.channel.wrong });
		// @Wachmann automod help
		// @Wachmann automod accountage set time <1...255> <hours|days|months>
		// @Wachmann automod accountage set action <kick|ban>
		// @Wachmann automod accountage remove
		const stringDateLatter = args[4];
		const stringDateNumber = args[3];

		if (args[0] === "help") {
			const data_out = await TextFileReader.read("paragraph", "commandHelp", `data/lang/${process.env.BOTLANG}`, "automod");
			messageReply(message, { content: data_out, ephemeral: true });
		}
		if (args[0] === "accountage") {
			const guild = await message.client.guilds.fetch(getGuildID);
			const getModerationID = `${guild.id}-${guild.shard.id}-AccountAge`;
			let dataAccountAge = Get.moderationByIDAndType("moderation", getModerationID, "AccountAge");
			if (dataAccountAge == null) dataAccountAge = { ModerationID: getModerationID, GuildID: guild.id, ShardID: guild.shardId, Type: "AccountAge", Extra: "days-3", Object: process.env.ACCOUNT_AGE };

			if (args[1] === "set") {
				if (args[2] === "time") {
					if (isNaN(stringDateNumber)) {
						messageReply(message, { content: langAutoban.notanumber });
						return;
					}
					dataAccountAge = { ModerationID: dataAccountAge.ModerationID, GuildID: dataAccountAge.GuildID, ShardID: dataAccountAge.ShardID, Type: dataAccountAge.Type, Extra: `${stringDateLatter}-${stringDateNumber}`, Object: dataAccountAge.Object };
					globalclient.channels.cache.get(logChannel).send({ content: langAutoban.addaccountage, ephemeral: true });
					Set.moderationByData("moderation", dataAccountAge);
					return;
				}
				if (args[2] === "action") {
					if (args[3] !== "ban" || args[3] !== "kick") {
						messageReply(message, { content: langAutoban.notaaction });
						return;
					}
					dataAccountAge = { ModerationID: dataAccountAge.ModerationID, GuildID: dataAccountAge.GuildID, ShardID: dataAccountAge.ShardID, Type: dataAccountAge.Type, Extra: dataAccountAge.Extra, Object: `${args[3]}` };
					globalclient.channels.cache.get(logChannel).send({ content: langAutoban.addaccountage, ephemeral: true });
					Set.moderationByData("moderation", dataAccountAge);
					return;
				}
			}

			if (args[1] === "remove") {
				globalclient.channels.cache.get(logChannel).send({ content: langAutoban.removeaccountage, ephemeral: true });
				Del.moderationByIDAndType("moderation", getModerationID, "AccountAge");
				return;
			}
		}
	}
};