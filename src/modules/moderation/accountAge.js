/* eslint-disable no-console */
const { Events } = require("discord.js");
const { DateTime } = require("luxon");
const { LanguageConvert } = require("../../tools/functions/languageConvert");
const { Get } = require("../../tools/functions/sqlite/prepare");
require("dotenv").config;

module.exports = {
	name: Events.GuildMemberAdd,
	description: "Check Joining Account' Age and Banning them if to young.",
	once: false,
	async execute(member) {
		const enabledModulesSplit = process.env.ENABLE_MODULES.split(/,+/);
		const enabledModulesTrim = enabledModulesSplit.map(obj => {return obj.trim();});
		const enabledModules = enabledModulesTrim.filter(m => m === "accountage").toString();
		if (enabledModules !== "") {
			// eslint-disable-next-line no-undef
			const guild = await globalclient.guilds.fetch(member.guild.id);
			const getBotConfigID = `${guild.id}-${guild.shard.id}`;
			const getModerationID = `${getBotConfigID}-AccountAge`;
			let dataLang = Get.botConfig(getBotConfigID);
			const dataAutoMod = Get.moderationByType(getModerationID, "AccountAge");
			if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
			if (dataAutoMod == null) return;
			// if (dataAutoMod == null) return console.log("No Account Age Moderation found.");
			const lang = require(`../../.${dataLang.Lang}`);
			const arrayExtra = dataAutoMod.Extra.split("-");
			const extra = arrayExtra[1];
			let time = { seconds: 0 };
			if (arrayExtra[0] === "years") time = { years: extra };
			if (arrayExtra[0] === "months") time = { months: extra };
			if (arrayExtra[0] === "days") time = { days: extra };
			if (arrayExtra[0] === "weeks") time = { weeks: extra };
			if (arrayExtra[0] === "hours") time = { hours: extra };
			if (arrayExtra[0] === "minutes") time = { minutes: extra };
			if (arrayExtra[0] === "seconds") time = { seconds: extra };
			const checkWithThis = DateTime.utc().minus(time);
			const accountAge = member.user.createdTimestamp;
			const autoMod = lang.automoderation;
			if (checkWithThis.ts <= accountAge) {
				// eslint-disable-next-line max-len
				member.ban({ deleteMessageSeconds: 60 * 60 * 24 * 7, reason: LanguageConvert.lang(autoMod.mainreason, lang.prefix.clanbot, autoMod.ban.youngaccount) });
			}
		}
	}
};