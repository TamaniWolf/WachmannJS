/* eslint-disable no-inline-comments */
const { EmbedBuilder, AuditLogEvent } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: "guildUpdate",
	description: "Loggin bot's beeing added to the server.",
	call: "on", // client.once = 'once', client.on = 'on'
	async execute(oldGuild, newGuild) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel();
		// AuditLog Fetch
		const fetchedLogs = await newGuild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.GuildUpdate
		});
		const guildUpdateLog = fetchedLogs.entries.first();
		const SystemChannelFlagsConvert = require("../../tools/functions/systemChannelFlagsConvert.js");
		const LanguageCodeConvert = require("../../tools/functions/languageCodeConvert.js");
		// Context
		const { executor, changes } = guildUpdateLog;
		const changeName = changes.filter(function(obj) {
			return obj.key === "name";
		});
		const changeSysChaID = changes.filter(function(obj) {
			return obj.key === "system_channel_id";
		});
		const changePremProgBarTrue = changes.filter(function(obj) {
			return obj.key === "premium_progress_bar_enabled";
		});
		const changeDefaultMesNot = changes.filter(function(obj) {
			return obj.key === "default_message_notifications";
		});
		const changeAFKChaID = changes.filter(function(obj) {
			return obj.key === "afk_channel_id";
		});
		const changeSysChaFlags = changes.filter(function(obj) {
			return obj.key === "system_channel_flags";
		});
		const changeLanguage = changes.filter(function(obj) {
			return obj.key = "preferred_locale";
		});
		// Embed
		let icon2 = executor.avatarURL();
		if(executor.avatar == null) {
			icon2 = "attachment://discord_logo_gray.png";
		}
		const embedGU = new EmbedBuilder()
			.setColor("Blue")
			.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
			.setDescription(`${executor} **Changed** Server settings`);
		// AddFileds
		let guc = "";
		if (changeName.length !== 0) {
			guc += `**Name:** ${changeName[0].new}\n`;
		}
		if (changeLanguage.length !== 0) {
			const lc = await LanguageCodeConvert.languageCode(changeLanguage[0].new);
			guc += `**Language:** ${lc}\n`;
		}
		if (changeSysChaID.length !== 0) {
			let scid = "";
			if (changeSysChaID[0].new == null) {scid = "false";}
			if (changeSysChaID[0].new != null) {scid = `<#${changeAFKChaID[0].new}>`;}
			guc += `**Sys Channel:** ${scid}\n`;
		}
		if (changeSysChaFlags.length !== 0) {
			const scf = await SystemChannelFlagsConvert.systemChannelFlagsBitField(`${changeSysChaFlags[0].new}`);
			embedGU.addFields(
				{ name: "Sys Channel Flags:", value: `${scf}`, inline: false }
			);
		}
		if (changePremProgBarTrue.length !== 0) {
			let ppbe = "";
			if (changePremProgBarTrue[0].new === true) {ppbe = "Enabled";}
			if (changePremProgBarTrue[0].new === false) {ppbe = "Disabled";}
			guc += `**Premium Progress Bar:** ${ppbe}\n`;
		}
		if (changeDefaultMesNot.length !== 0) {
			let dmn = "";
			if (changeDefaultMesNot[0].new === 0) {dmn = "All Messages";}
			if (changeDefaultMesNot[0].new === 1) {dmn = "Only @mentions";}
			guc += `**Default Message Notification:** ${dmn}\n`;
		}
		if (changeAFKChaID.length !== 0) {
			let afkcid = "";
			if (changeAFKChaID[0].new == null) {afkcid = "false";}
			if (changeAFKChaID[0].new != null) {afkcid = `<#${changeAFKChaID[0].new}>`;}
			guc += `**AFK Channel:** ${afkcid}\n`;
		}
		embedGU.addFields(
			{ name: "Changes", value: `${guc}`, inline: false }
		);
		// eslint-disable-next-line no-undef
		globalclient.channels.cache.get(logChannel).send({ embeds: [embedGU] });
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