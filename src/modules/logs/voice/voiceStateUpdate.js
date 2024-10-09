/* eslint-disable no-console */
const { Events, EmbedBuilder } = require("discord.js");
const { DateTime } = require("luxon");
require("dotenv").config();

module.exports = {
	name: Events.VoiceStateUpdate,
	description: "Log Voice Channel activitys (Join, leaf, mute, etc.).",
	once: false,
	async execute(ovs, nvs) {
		// console.log("voiceStateUpdate.js");
		// console.log(ovs);
		// console.log(nvs);

		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		const getGuild = ovs.guild;
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(getGuild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Main Body
		let vsu = ".";
		const embedVSU = new EmbedBuilder()
			.setColor(Application.colors().logEmbedColor.update);
		const timestamp = DateTime.utc().toUnixInteger();
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(getGuild.id);
		const member = guild.members.cache.get(ovs.id);

		if (ovs.channelId == null && nvs.channelId != null) {
			// User Joined a Channel
			vsu = LanguageConvert.lang(langLogs.voice.join, `<@${member.user.id}>`, `<#${nvs.channelId}>`, `<t:${timestamp}:f>`);
			embedVSU.setColor(Application.colors().logEmbedColor.create);
		} else if (ovs.channelId !== null && nvs.channelId == null) {
			// User Left a Channel
			vsu = LanguageConvert.lang(langLogs.voice.leave, `<@${member.user.id}>`, `<#${ovs.channelId}>`, `<t:${timestamp}:f>`);
			embedVSU.setColor(Application.colors().logEmbedColor.delete);
		} else if (ovs.channelId !== nvs.channelId && ovs.channelId != null && nvs.channelId != null) {
			// User Switched the Channel
			vsu = LanguageConvert.lang(langLogs.voice.switch, `<@${member.user.id}>`, `<#${ovs.channelId}>`, `<#${nvs.channelId}>`, `<t:${timestamp}:f>`);
		} else if (ovs.serverDeaf !== nvs.serverDeaf && nvs.serverDeaf === true) {
			// User got Deafened
			vsu = LanguageConvert.lang(langLogs.voice.serverdeaf, `<@${member.user.id}>`, `<#${nvs.channelId}>`, `<t:${timestamp}:f>`);
		} else if (ovs.serverDeaf !== nvs.serverDeaf && nvs.serverDeaf === false) {
			// User got Undeafened
			vsu = LanguageConvert.lang(langLogs.voice.noserverdeaf, `<@${member.user.id}>`, `<#${nvs.channelId}>`, `<t:${timestamp}:f>`);
		} else if (ovs.serverMute !== nvs.serverMute && nvs.serverMute === true) {
			// User got Muted
			vsu = LanguageConvert.lang(langLogs.voice.servermute, `<@${member.user.id}>`, `<#${nvs.channelId}>`, `<t:${timestamp}:f>`);
		} else if (ovs.serverMute !== nvs.serverMute && nvs.serverMute === false) {
			// User got Unmuted
			vsu = LanguageConvert.lang(langLogs.voice.noservermute, `<@${member.user.id}>`, `<#${nvs.channelId}>`, `<t:${timestamp}:f>`);
		} else if (ovs.selfDeaf !== nvs.selfDeaf && nvs.selfDeaf === true) {
			// User Deafened them self
			vsu = LanguageConvert.lang(langLogs.voice.selfdeaf, `<@${member.user.id}>`, `<#${nvs.channelId}>`, `<t:${timestamp}:f>`);
		} else if (ovs.selfDeaf !== nvs.selfDeaf && nvs.selfDeaf === false) {
			// User Undeafened them self
			vsu = LanguageConvert.lang(langLogs.voice.noselfdeaf, `<@${member.user.id}>`, `<#${nvs.channelId}>`, `<t:${timestamp}:f>`);
		} else if (ovs.selfMute !== nvs.selfMute && nvs.selfMute === true) {
			// User Muted them self
			vsu = LanguageConvert.lang(langLogs.voice.selfmute, `<@${member.user.id}>`, `<#${nvs.channelId}>`, `<t:${timestamp}:f>`);
		} else if (ovs.selfMute !== nvs.selfMute && nvs.selfMute === false) {
			// User Unmuted them self
			vsu = LanguageConvert.lang(langLogs.voice.noselfmute, `<@${member.user.id}>`, `<#${nvs.channelId}>`, `<t:${timestamp}:f>`);
		} else if (ovs.selfVideo !== nvs.selfVideo && nvs.selfVideo === true) {
			// User stared they webcam
			vsu = LanguageConvert.lang(langLogs.voice.webcam, `<@${member.user.id}>`, `<#${nvs.channelId}>`, `<t:${timestamp}:f>`);
		} else if (ovs.selfVideo !== nvs.selfVideo && nvs.selfVideo === false) {
			// User stopped they webcam
			vsu = LanguageConvert.lang(langLogs.voice.nowebcam, `<@${member.user.id}>`, `<#${nvs.channelId}>`, `<t:${timestamp}:f>`);
		} else if (ovs.sessionId !== nvs.sessionId && nvs.sessionId != null) {
			// Session Id changed
			return;
		} else if (ovs.streaming !== nvs.streaming && nvs.streaming === true) {
			// User started sharing they screen
			vsu = LanguageConvert.lang(langLogs.voice.screensharing, `<@${member.user.id}>`, `<#${nvs.channelId}>`, `<t:${timestamp}:f>`);
		} else if (ovs.streaming !== nvs.streaming && nvs.streaming === false) {
			// User stopped sharing they screen
			vsu = LanguageConvert.lang(langLogs.voice.noscreensharing, `<@${member.user.id}>`, `<#${nvs.channelId}>`, `<t:${timestamp}:f>`);
		} else if (ovs.suppress !== nvs.suppress && nvs.suppress === true) {
			// User is suppressed
			// console.log(`${DateTime.utc().toFormat(timeFormat)} Suppress - true`);
			// console.log(nvs.suppress);
			return;
		} else if (ovs.suppress !== nvs.suppress && nvs.suppress === false) {
			// User is unsuppressed
			// console.log(`${DateTime.utc().toFormat(timeFormat)} Suppress - false`);
			// console.log(nvs.suppress);
			return;
		} else if (ovs.requestToSpeakTimestamp !== nvs.requestToSpeakTimestamp && nvs.requestToSpeakTimestamp != null) {
			// User requested to speak timestamp
			vsu = LanguageConvert.lang(langLogs.voice.requesttospeak, `<@${member.user.id}>`, `<#${nvs.channelId}>`, `<t:${timestamp}:f>`);
		} else {
			// Something happened
			// console.log(ovs);
			// console.log(nvs);
			return;
		}

		if (vsu !== ".") {
			embedVSU.setDescription(vsu)
				.setFooter({ text: "voiceStateUpdate" })
				.setTimestamp(new Date());

			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [embedVSU] });
		}
	}
};
