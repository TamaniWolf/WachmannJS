/* eslint-disable no-inner-declarations */
/* eslint-disable max-len */
const { Events } = require("discord.js");
const { LanguageConvert } = require("../../tools/functions/languageConvert");
const { Get, Set, Del } = require("../../tools/functions/sqlite/prepare");
require("dotenv").config;

module.exports = {
	name: "reactcaptcha",
	event: Events.MessageReactionAdd,
	description: "Check React Captcha and Banning them if failed.",
	once: false,
	async execute(reaction, user) {
		const enabledModulesSplit = process.env.ENABLE_MODULES.split(/,+/);
		const enabledModulesTrim = enabledModulesSplit.map(obj => {return obj.trim();});
		const enabledModules = enabledModulesTrim.filter(m => m === "reactcaptcha").toString();
		if (enabledModules !== "") {
			if (reaction.partial) {
				try {
					await reaction.fetch();
				} catch (error) {
					return;
				}
			}
			if (user.id === process.env.WACHMANN_ID) return;
			const guild = reaction.message.guild;
			const getBotConfigID = `${guild.id}-${guild.shard.id}`;
			const getModerationID = `${getBotConfigID}-ReactCaptcha`;
			const getCaptchaID = `${getBotConfigID}-${user.id}-ReactCaptcha`;
			let dataLang = Get.botConfig(getBotConfigID);
			let dataCaptcha = Get.captchaByType(`${getCaptchaID}`, "ReactCaptcha");
			const dataAutoMod = Get.moderationByType(getModerationID, "ReactCaptcha");
			if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
			if (dataAutoMod == null) return;
			if (dataCaptcha == null) dataCaptcha = { ModerationID: getCaptchaID, GuildID: guild.id, Type: "ReactCaptcha", MemberID: user.id, Attempts: "1" };
			const lang = require(`../../.${dataLang.Lang}`);
			const autoMod = lang.automoderation;

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
				Del.captchaByType(`${id}`, "ReactCaptcha");
				member.ban({ deleteMessageSeconds: 60 * 60 * 24 * 7, reason: LanguageConvert.lang(autoMod.mainreason, lang.prefix.clanbot, autoMod.ban.captchafailed) });
			}
			function kicking(captchaData) {
				let attempts = captchaData.Attempts;
				attempts++;
				const data = { ModerationID: dataCaptcha.ModerationID, GuildID: dataCaptcha.GuildID, Type: dataCaptcha.Type, MemberID: dataCaptcha.MemberID, Attempts: attempts };
				Set.captcha(data);
				member.kick({ reason: LanguageConvert.lang(autoMod.mainreason, lang.prefix.clanbot, autoMod.kick.captchafailed) });
			}
			function addRole(role, id) {
				Del.captchaByType(`${id}`, "ReactCaptcha");
				member.roles.add(role);
			}
			// eslint-disable-next-line no-unused-vars
			function removeRole(role) {
				member.roles.remove(role);
			}
		}
	}
};