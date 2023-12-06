/* eslint-disable no-inner-declarations */
/* eslint-disable max-len */
const { Events } = require("discord.js");
const { LanguageConvert } = require("../../tools/functions/languageConvert");
const { Get } = require("../../tools/functions/sqlite/prepare");
require("dotenv").config;

module.exports = {
	name: Events.MessageReactionAdd,
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
			// eslint-disable-next-line no-undef
			const guild = reaction.message.guild;
			const getBotConfigID = `${guild.id}-${guild.shard.id}`;
			const getModerationID = `${getBotConfigID}-ReactCaptcha`;
			let dataLang = Get.botConfig(getBotConfigID);
			const dataAutoMod = Get.moderationByType(getModerationID, "ReactCaptcha");
			if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
			if (dataAutoMod == null) return;
			// if (dataAutoMod == null) return console.log("No Captcha Moderation found.");
			const lang = require(`../../.${dataLang.Lang}`);
			const autoMod = lang.automoderation;

			// messageID-ban/kick-emojis
			const arrayExtra = dataAutoMod.Extra.split("-");
			const arrayObject = dataAutoMod.Object.split("-");
			if (arrayExtra[0] !== reaction.message.id) return;
			const arrayEmoji = arrayExtra[2].split(",");

			const member = await guild.members.fetch(user.id);
			reaction.users.remove(user.id);

			if (member.roles.cache.has(arrayObject[1])) return;

			arrayEmoji.forEach(async obj => {
				if (obj !== reaction.emoji.identifier) {
					if (arrayExtra[1] === "ban") banning();
					if (arrayExtra[1] === "kick") kicking();
				}
				if (obj === reaction.emoji.identifier) {
					if (arrayObject[0] !== "Role") return;
					const role = await guild.roles.fetch(arrayObject[1]);
					addRole(role);
				}
			});

			function banning() {
				member.ban({ deleteMessageSeconds: 60 * 60 * 24 * 7, reason: LanguageConvert.lang(autoMod.mainreason, lang.prefix.clanbot, autoMod.ban.catchupfailed) });
			}
			function kicking() {
				member.kick({ reason: LanguageConvert.lang(autoMod.mainreason, lang.prefix.clanbot, autoMod.kick.catchupfailed) });
			}
			function addRole(role) {
				member.roles.add(role);
			}
			// eslint-disable-next-line no-unused-vars
			function removeRole(role) {
				member.roles.remove(role);
			}
		}
	}
};