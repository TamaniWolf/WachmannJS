/* eslint-disable no-console */
const { Events } = require("discord.js");
require("dotenv").config;

module.exports = {
	name: "accountage",
	event: Events.GuildMemberAdd,
	description: "Check Joining Account' Age and Banning them if to young.",
	once: false,
	async execute(member) {
		// Imports
		const { DateTime } = require("luxon");
		const { Get } = require("../../tools/db.js");
		const { LanguageConvert } = require("../../tools/utils.js");
		// Language
		const lang = require(`../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langModeration = lang.modules.moderation;
		const langAccountage = langModeration.accountage;

		// Main Body
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(member.guild.id);
		const getBotConfigID = `${guild.id}-${guild.shard.id}`;
		const getModerationID = `${getBotConfigID}-AccountAge`;
		const dataAutoMod = Get.moderationByIDAndType("moderation", getModerationID, "AccountAge");
		if (dataAutoMod == null) return;
		const arrayExtra = dataAutoMod.Extra.split("-");
		const timeName = arrayExtra[0];
		const timeNumber = arrayExtra[1];
		const arrayAction = dataAutoMod.Object.split("-");
		const action = arrayAction[0];

		let time = { seconds: 0 };
		if (timeName === "years") time = { years: timeNumber };
		if (timeName === "months") time = { months: timeNumber };
		if (timeName === "days") time = { days: timeNumber };
		if (timeName === "weeks") time = { weeks: timeNumber };
		if (timeName === "hours") time = { hours: timeNumber };
		if (timeName === "minutes") time = { minutes: timeNumber };
		if (timeName === "seconds") time = { seconds: timeNumber };
		const checkWithThis = DateTime.utc().minus(time);
		const accountAge = member.user.createdTimestamp;

		const banReason = LanguageConvert.lang(langModeration.all.automod, lang.prefix.bot, langAccountage.bantoyoung);
		const kickReason = LanguageConvert.lang(langModeration.all.automod, lang.prefix.bot, langAccountage.kicktoyoung);
		const delMsgSec = 60 * 60 * 24 * 7;
		if (checkWithThis.ts <= accountAge && action === "ban") member.ban({ deleteMessageSeconds: delMsgSec, reason: banReason });
		if (checkWithThis.ts <= accountAge && action === "kick") member.kick({ deleteMessageSeconds: delMsgSec, reason: kickReason });
	}
};