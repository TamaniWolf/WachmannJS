const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.GuildUpdate,
	description: "Log Server Updates.",
	call: "on",
	async execute(oldGuild, newGuild) {
		const { Application } = require("../../core/application/Application");
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(newGuild.id);
		if (logChannel === "0") return;
		// AuditLog Fetch
		const fetchedLogs = await newGuild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.GuildUpdate
		});
		const guildUpdateLog = fetchedLogs.entries.first();
		const MiscConvert = require("../../tools/functions/miscConvert.js");
		const { LanguageConvert } = require("../../tools/functions/languageConvert.js");
		// Context
		const { Get } = require("../../tools/functions/sqlite/prepare");
		const getBotConfigID = `${newGuild.id}-${newGuild.shard.id}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { executor, changes } = guildUpdateLog;
		// console.log(changes);
		// console.log(oldGuild);
		// console.log(newGuild);
		/**
		 * - name  -  String
		 * - description  -  String
		 * - icon_hash  -  Hash string
		 * splash_hash
		 * discovery_splash_hash
		 * banner_hash
		 * owner_id
		 * region
		 * - preferred_locale  -  String
		 * - afk_channel_id  -  ChannelID
		 * - afk_timeout  -  Number
		 * - rules_channel_id  -  ChannelID
		 * - public_updates_channel_id  -  ChannelID
		 * ? safety_alerts_channel_id
		 * mfa_level
		 * verification_leve
		 * explicit_content_filter
		 * - default_message_notifications  -  Number
		 * vanity_url_code
		 * $add
		 * $remove
		 * prune_delete_days
		 * - widget_enabled  -  verbose
		 * - widget_channel_id  -  ChannelID
		 * - system_channel_id  -  ChannelID
		 * position
		 * permissions
		 * - premium_progressbar_enabled  -  verbose
		 * - system_channel_flags  -  Number
		 */
		// const changeName = changes.filter(function(obj) {
		// 	return obj.key === "name";
		// });
		// const changeSysChaID = changes.filter(function(obj) {
		// 	return obj.key === "system_channel_id";
		// });
		// const changePremProgBarTrue = changes.filter(function(obj) {
		// 	return obj.key === "premium_progress_bar_enabled";
		// });
		// const changeDefaultMesNot = changes.filter(function(obj) {
		// 	return obj.key === "default_message_notifications";
		// });
		// const changeAFKChaID = changes.filter(function(obj) {
		// 	return obj.key === "afk_channel_id";
		// });
		// const changeSysChaFlags = changes.filter(function(obj) {
		// 	return obj.key === "system_channel_flags";
		// });
		// const changeLanguage = changes.filter(function(obj) {
		// 	return obj.key = "preferred_locale";
		// });
		// // Embed
		// let icon2 = executor.avatarURL();
		// if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
		// const embedGU = new EmbedBuilder()
		// 	.setColor(Application.colors().logEmbedColor.guildupdate)
		// 	.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: `${icon2}` })
		// 	.setDescription(`**${lang.logs.edited}** ${newGuild.name}`);
		// // AddFileds
		// let guc = "";
		// if (changeName.length !== 0) {
		// 	guc += `**${lang.logs.name}** ${changeName[0].new}\n`;
		// }
		// if (changeLanguage.length !== 0) {
		// 	const lc = await LanguageConvert.code(changeLanguage[0].new);
		// 	guc += `**${lang.logs.language}** ${lc}\n`;
		// }
		// if (changeSysChaID.length !== 0) {
		// 	let scid = "";
		// 	if (changeSysChaID[0].new == null) scid = "false";
		// 	if (changeSysChaID[0].new != null) scid = `<#${changeAFKChaID[0].new}>`;
		// 	guc += `**${lang.logs.syschannel}** ${scid}\n`;
		// }
		// if (changeSysChaFlags.length !== 0) {
		// 	const scf = await MiscConvert.systemChannelFlagsBitField(`${changeSysChaFlags[0].new}`);
		// 	embedGU.addFields(
		// 		{ name: `${lang.logs.syschannelflag}`, value: `${scf}`, inline: false }
		// 	);
		// }
		// if (changePremProgBarTrue.length !== 0) {
		// 	let ppbe = "";
		// 	if (changePremProgBarTrue[0].new === true) ppbe = `${lang.logs.enabled}`;
		// 	if (changePremProgBarTrue[0].new === false) ppbe = `${lang.logs.disabled}`;
		// 	guc += `**${lang.logs.premiumbar}** ${ppbe}\n`;
		// }
		// if (changeDefaultMesNot.length !== 0) {
		// 	let dmn = "";
		// 	if (changeDefaultMesNot[0].new === 0) {dmn = `${lang.logs.allmsg}`;}
		// 	if (changeDefaultMesNot[0].new === 1) {dmn = `${lang.logs.onlymention}`;}
		// 	guc += `**${lang.logs.defaultmsgnoti}** ${dmn}\n`;
		// }
		// if (changeAFKChaID.length !== 0) {
		// 	let afkcid = "";
		// 	if (changeAFKChaID[0].new == null) {afkcid = "false";}
		// 	if (changeAFKChaID[0].new != null) {afkcid = `<#${changeAFKChaID[0].new}>`;}
		// 	guc += `**${lang.logs.afkchannel}** ${afkcid}\n`;
		// }
		// embedGU.addFields(
		// 	{ name: `${lang.logs.changes}`, value: `${guc}`, inline: false }
		// );
		// // eslint-disable-next-line no-undef
		// globalclient.channels.cache.get(logChannel).send({ embeds: [embedGU] });
		/**
		 * name
		 * icon_hash
		 * features
		 * available
		 * splash
		 * banner
		 * description
		 * verification_level
		 * vanity_url_code
		 * nsfw_level
		 * discovery_splash
		 * large
		 * premium_progress_bar_enabled
		 * afk_timeout
		 * afk_channel_id
		 * system_channel_id
		 * premium_tier
		 * widget_enabled
		 * widget_channel_id
		 * explicit_content_filter
		 * mfa_level
		 * default_message_notifications
		 * system_channel_flags
		 * rules_channel_id
		 * public_updates_channel_id
		 * preferred_locale
		 * owner_id
		 */
	}
};