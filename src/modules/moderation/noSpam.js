/* eslint-disable no-console */
const { Events } = require("discord.js");
const { DateTime } = require("luxon");
const { LanguageConvert } = require("../../tools/functions/languageConvert");
const { Get } = require("../../tools/functions/sqlite/prepare");
require("dotenv").config;

module.exports = {
	name: "nospam",
	event: Events.MessageCreate,
	description: "Auto Timeout spamers.",
	once: false,
	async execute(message) {
		const enabledModulesSplit = process.env.ENABLE_MODULES.split(/,+/);
		const enabledModulesTrim = enabledModulesSplit.map(obj => {return obj.trim();});
		const enabledModules = enabledModulesTrim.filter(m => m === "nospam").toString();
		if (enabledModules !== "") {
			// eslint-disable-next-line no-undef
			const guild = await globalclient.guilds.fetch(message.guild.id);
			const getBotConfigID = `${guild.id}-${guild.shard.id}`;
			const getModerationID = `${getBotConfigID}-NoSpam`;
			let dataLang = Get.botConfig(getBotConfigID);
			const dataAutoMod = Get.moderationByType(getModerationID, "NoSpam");
			if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
			if (dataAutoMod == null) return;
			const lang = require(`../../.${dataLang.Lang}`);
			const arrayExtra = dataAutoMod.Extra.split("-");
		}
	}
};