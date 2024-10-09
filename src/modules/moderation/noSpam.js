/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const { Events } = require("discord.js");
require("dotenv").config;

module.exports = {
	name: "nospam",
	event: Events.MessageCreate,
	description: "Auto Timeout spamers.",
	once: false,
	async execute(message) {
		// Imports
		const { DateTime } = require("luxon");
		const { Get } = require("../../tools/db.js");
		const { LanguageConvert } = require("../../tools/utils.js");
		// Language
		const lang = require(`../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langModeration = lang.modules.moderation;
		const langNospam = langModeration.nospam;

		// Main Body
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(message.guild.id);
		const getBotConfigID = `${guild.id}-${guild.shard.id}`;
		const getModerationID = `${getBotConfigID}-NoSpam`;
		const dataAutoMod = Get.moderationByIDAndType("nospam", getModerationID, "NoSpam");
		if (dataAutoMod == null) return;
		const arrayExtra = dataAutoMod.Extra.split("-");
		// const  = arrayExtra[0];
		// const  = arrayExtra[1];
	}
};