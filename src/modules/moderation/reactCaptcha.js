/* eslint-disable no-inner-declarations */
/* eslint-disable max-len */
const { Events } = require("discord.js");
require("dotenv").config;

module.exports = {
	name: "reactcaptcha",
	event: Events.MessageReactionAdd,
	description: "Check React Captcha and Banning them if failed.",
	once: false,
	async execute(reaction, user) {
		if (reaction.partial) {
			try {
				await reaction.fetch();
			} catch (error) {
				return;
			}
		}
		if (user.id === process.env.WACHMANN_ID) return;
		// Imports
		const { Get, Set, Del } = require("../../tools/db.js");
		const { LanguageConvert } = require("../../tools/utils.js");
		// Language
		const lang = require(`../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langModeration = lang.modules.moderation;
		const langCaptcha = langModeration.captcha;

		// Main Body
		const guild = reaction.message.guild;
		const getBotConfigID = `${guild.id}-${guild.shard.id}`;
		const getModerationID = `${getBotConfigID}-ReactCaptcha`;
		const getCaptchaID = `${getBotConfigID}-${user.id}-ReactCaptcha`;
		let dataCaptcha = Get.moderationByIDAndType("captcha", `${getCaptchaID}`, "ReactCaptcha");
		const dataAutoMod = Get.moderationByIDAndType("moderation", getModerationID, "ReactCaptcha");
		if (dataAutoMod == null) return;
		if (dataCaptcha == null) dataCaptcha = { ModerationID: getCaptchaID, GuildID: guild.id, ShardID: guild.shard.iD, Type: "ReactCaptcha", MemberID: user.id, Attempts: "1" };

		// messageID-ban/kick-emojis
		const arrayExtra = dataAutoMod.Extra.split("-");
		const arrayObject = dataAutoMod.Object.split("-");
		if (arrayExtra[0] !== reaction.message.id) return;
		const arrayEmoji = arrayObject[1].split(",");

		const member = await guild.members.fetch(user.id);
		reaction.users.remove(user.id);

		if (member.roles.cache.has(arrayObject[0])) return;
		let banKickOption = arrayExtra[1];
		if (arrayExtra[2] <= dataCaptcha.Attempts) banKickOption = "ban";

		arrayEmoji.forEach(async obj => {
			if (obj !== reaction.emoji.identifier) {
				if (banKickOption === "ban") banning(getCaptchaID);
				if (banKickOption === "kick") kicking(dataCaptcha);
			}
			if (obj === reaction.emoji.identifier) {
				const role = await guild.roles.fetch(arrayObject[0]);
				addRole(role, getCaptchaID);
			}
		});

		function banning(id) {
			Del.moderationByIDAndType("captcha", `${id}`, "ReactCaptcha");
			member.ban({ deleteMessageSeconds: 60 * 60 * 24 * 7, reason: LanguageConvert.lang(langModeration.all.automod, lang.prefix.clanbot, langCaptcha.banonfail) });
		}
		function kicking(captchaData) {
			let attempts = captchaData.Attempts;
			attempts++;
			const data = { ModerationID: dataCaptcha.ModerationID, GuildID: dataCaptcha.GuildID, ShardID: dataCaptcha.ShardID, Type: dataCaptcha.Type, MemberID: dataCaptcha.MemberID, Attempts: attempts };
			Set.moderationByData("captcha", data);
			member.kick({ reason: LanguageConvert.lang(langModeration.all.automod, lang.prefix.clanbot, langCaptcha.kickonfailed) });
		}
		function addRole(role, id) {
			Del.moderationByIDAndType("captcha", `${id}`, "ReactCaptcha");
			member.roles.add(role);
		}
		// eslint-disable-next-line no-unused-vars
		function removeRole(role) {
			member.roles.remove(role);
		}
	}
};