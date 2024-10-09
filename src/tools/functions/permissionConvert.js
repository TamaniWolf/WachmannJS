/* eslint-disable max-len */
const { PermissionsBitField } = require("discord.js");
require("dotenv").config;

class PermissionConvert {
	/**
	 * Convert the Bitfiled value to the Permission Names.
	 *
	 * @param {BigInt} bitfield The Permissions Bitfiled
	 * @returns {Promise<String|null>} The Permissions name list
	 */
	static permissionsNames(bitfield) {
		return new Promise((resolve, reject) => {
			try {
				let bitfieldName = "";
				if (bitfield != null || bitfield !== 0n) {
					const bitfieldInt = new PermissionsBitField(bitfield);
					// General Server Permissions
					if (bitfieldInt.has(PermissionsBitField.Flags.ViewChannel) === true) bitfieldName += "View Channels\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageChannels) === true) bitfieldName += "Manage Channels\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageRoles) === true) bitfieldName += "Manage Roles\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.CreateGuildExpressions) === true) bitfieldName += "Create Expressions\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageGuildExpressions) === true) bitfieldName += "Manage Expressions\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ViewAuditLog) === true) bitfieldName += "View Audit Log\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ViewGuildInsights) === true) bitfieldName += "View Server Insights\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageWebhooks) === true) bitfieldName += "Manage Webhooks\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageGuild) === true) bitfieldName += "Manage Server\n";
					// Membership Permissions
					if (bitfieldInt.has(PermissionsBitField.Flags.CreateInstantInvite) === true) bitfieldName += "Create Invite\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ChangeNickname) === true) bitfieldName += "Change Nickname\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageNicknames) === true) bitfieldName += "Manage Nicknames\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.KickMembers) === true) bitfieldName += "Kick Members\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.BanMembers) === true) bitfieldName += "Ban Members\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ModerateMembers) === true) bitfieldName += "Timeout Members\n";
					// Text Channel Permissions
					if (bitfieldInt.has(PermissionsBitField.Flags.SendMessages) === true) bitfieldName += "Send Messages and Create Posts\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.SendMessagesInThreads) === true) bitfieldName += "Send Messages in Threads and Posts\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.CreatePublicThreads) === true) bitfieldName += "Create Public Threads\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.CreatePrivateThreads) === true) bitfieldName += "Create Private Threads\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.EmbedLinks) === true) bitfieldName += "Embed Links\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.AttachFiles) === true) bitfieldName += "Attach Files\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.AddReactions) === true) bitfieldName += "Add Reactions\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.UseExternalEmojis) === true) bitfieldName += "Use External Emojis\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.UseExternalStickers) === true) bitfieldName += "Use External Stickers\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.MentionEveryone) === true) bitfieldName += "Mention @everyone, @here, and All Roles\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageMessages) === true) bitfieldName += "Manage Messages\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageThreads) === true) bitfieldName += "Manage Threads and Posts\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ReadMessageHistory) === true) bitfieldName += "Read Message History\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.SendTTSMessages) === true) bitfieldName += "Send Text-to-Speech Messages\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.SendVoiceMessages) === true) bitfieldName += "Send Voice Messages\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.SendPolls) === true) bitfieldName += "Create Polls\n";
					// Voice Channel Permissions
					if (bitfieldInt.has(PermissionsBitField.Flags.Connect) === true) bitfieldName += "Connect\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.Speak) === true) bitfieldName += "Speak\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.Stream) === true) bitfieldName += "Video\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.UseSoundboard) === true) bitfieldName += "Use Soundboard\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.UseExternalSounds) === true) bitfieldName += "Use External Sounds\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.UseVAD) === true) bitfieldName += "Use Voice Activity\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.PrioritySpeaker) === true) bitfieldName += "Priority Speaker\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.MuteMembers) === true) bitfieldName += "Mute Members\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.DeafenMembers) === true) bitfieldName += "Deafe nMembers\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.MoveMembers) === true) bitfieldName += "Move Members\n";
					// if (bitfieldInt.has(PermissionsBitField.Flags.SetVoiceChannelStatus) === true) bitfieldName += "Set Voice Channel Status\n";
					// Apps Permissions
					if (bitfieldInt.has(PermissionsBitField.Flags.UseApplicationCommands) === true) bitfieldName += "Use Application Commands\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.UseEmbeddedActivities) === true) bitfieldName += "Use Activities\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.UseExternalApps) === true) bitfieldName += "Use External Apps\n";
					// Stage Channel Permissions
					if (bitfieldInt.has(PermissionsBitField.Flags.RequestToSpeak) === true) bitfieldName += "Request to Speak\n";
					// Events Permissions
					if (bitfieldInt.has(PermissionsBitField.Flags.CreateEvents) === true) bitfieldName += "Create Events\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageEvents) === true) bitfieldName += "Manage Events\n";
					// Advanced Permissions
					if (bitfieldInt.has(PermissionsBitField.Flags.Administrator) === true) bitfieldName += "Administrator\n";
					// Placeholder
					if (bitfieldInt.has(PermissionsBitField.Flags.ViewCreatorMonetizationAnalytics) === true) bitfieldName += "View Monetization\n";
				}
				if (bitfieldName === "") bitfieldName = null;
				const permNew = bitfieldName;
				resolve(permNew);
			} catch(err) {
				reject(err);
			}
		});
	}

	/**
	 * Convert the Bitfiled value to the individual Bitfiled values.
	 *
	 * @param {BigInt} bitfield The Permissions Bitfiled
	 * @returns {Promise<String|null>} The Permissions bitfield list
	 */
	static permissionsBitfields(bitfield) {
		return new Promise((resolve, reject) => {
			try {
				let bitfieldList = "";
				if (bitfield != null || bitfield !== 0n) {
					const bitfieldInt = new PermissionsBitField(bitfield);
					// General Server Permissions
					if (bitfieldInt.has(PermissionsBitField.Flags.ViewChannel) === true) bitfieldList += "1024n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageChannels) === true) bitfieldList += "16n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageRoles) === true) bitfieldList += "268435456n\n";
					// if (bitfieldInt.has(PermissionsBitField.Flags.CreateGuildExpressions) === true) bitfieldList += "8796093022208n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageGuildExpressions) === true) bitfieldList += "1073741824n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ViewAuditLog) === true) bitfieldList += "128n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ViewGuildInsights) === true) bitfieldList += "524288n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageWebhooks) === true) bitfieldList += "536870912n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageGuild) === true) bitfieldList += "32n\n";
					// Membership Permissions
					if (bitfieldInt.has(PermissionsBitField.Flags.CreateInstantInvite) === true) bitfieldList += "1n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ChangeNickname) === true) bitfieldList += "67108864n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageNicknames) === true) bitfieldList += "134217728n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.KickMembers) === true) bitfieldList += "2n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.BanMembers) === true) bitfieldList += "4n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageEvents) === true) bitfieldList += "8589934592n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ModerateMembers) === true) bitfieldList += "1099511627776n\n";
					// Text Channel Permissions
					if (bitfieldInt.has(PermissionsBitField.Flags.SendMessages) === true) bitfieldList += "2048n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.SendMessagesInThreads) === true) bitfieldList += "274877906944n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.CreatePublicThreads) === true) bitfieldList += "34359738368n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.CreatePrivateThreads) === true) bitfieldList += "68719476736n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.EmbedLinks) === true) bitfieldList += "16384n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.AttachFiles) === true) bitfieldList += "32768n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.AddReactions) === true) bitfieldList += "64n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.UseExternalEmojis) === true) bitfieldList += "262144n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.UseExternalStickers) === true) bitfieldList += "137438953472n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.MentionEveryone) === true) bitfieldList += "131072n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageMessages) === true) bitfieldList += "8192n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageThreads) === true) bitfieldList += "17179869184n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ReadMessageHistory) === true) bitfieldList += "65536n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.SendTTSMessages) === true) bitfieldList += "4096n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.UseApplicationCommands) === true) bitfieldList += "2147483648n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.SendVoiceMessages) === true) bitfieldList += "70368744177664n\n";
					// Voice Channel Permissions
					if (bitfieldInt.has(PermissionsBitField.Flags.Connect) === true) bitfieldList += "1048576n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.Speak) === true) bitfieldList += "2097152n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.Stream) === true) bitfieldList += "512n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.UseEmbeddedActivities) === true) bitfieldList += "549755813888n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.UseSoundboard) === true) bitfieldList += "4398046511104n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.UseExternalSounds) === true) bitfieldList += "35184372088832n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.UseVAD) === true) bitfieldList += "33554432n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.PrioritySpeaker) === true) bitfieldList += "256n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.MuteMembers) === true) bitfieldList += "4194304n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.DeafenMembers) === true) bitfieldList += "8388608n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.MoveMembers) === true) bitfieldList += "16777216n\n";
					// if (bitfieldInt.has(PermissionsBitField.Flags.VoiceChannelStatus) === true) bitfieldList += "n\n";
					// Stage Channel Permissions
					if (bitfieldInt.has(PermissionsBitField.Flags.RequestToSpeak) === true) bitfieldList += "4294967296n\n";
					// Events Permissions
					// if (bitfieldInt.has(PermissionsBitField.Flags.CreateEvents) === true) bitfieldList += "17592186044416n\n";
					if (bitfieldInt.has(PermissionsBitField.Flags.ManageEvents) === true) bitfieldList += "8589934592n\n";
					// Advanced Permissions
					if (bitfieldInt.has(PermissionsBitField.Flags.Administrator) === true) bitfieldList += "8n\n";
					// Placeholder
					// if (bitfieldInt.has(PermissionsBitField.Flags.ViewCreatorMonetizationAnalytics) === true) bitfieldList += "2199023255552n\n";
				}
				if (bitfieldList === "") bitfieldList = null;
				const permNew = bitfieldList;
				resolve(permNew);
			} catch(err) {
				reject(err);
			}
		});
	}

	/**
	 * Convert Permission Bitfields to Granted and Revoked values.
	 *
	 * @param {BigInt} bitfieldOld The Old Bitfield
	 * @param {BigInt} bitfieldNew The New Bitfield
	 * @returns {Promise<Object|null>} The Granted/Removed Object
	 */
	static permissions(bitfieldOld, bitfieldNew) {
		return new Promise((resolve, reject) => {
			try {
				if (bitfieldOld == null) bitfieldOld = 0n;
				if (bitfieldNew == null) bitfieldNew = 0n;
				const permissionsOld = new PermissionsBitField(bitfieldOld);
				const permissionsNew = new PermissionsBitField(bitfieldNew);

				// Revoked
				const permOld = permissionsOld.remove(bitfieldNew);
				// Granted
				const permNew = permissionsNew.remove(bitfieldOld);

				const perms = { granted: permNew.bitfield, revoked: permOld.bitfield };
				resolve(perms || null);
			} catch(err) {
				reject(err);
			}
		});
	}
}

module.exports = PermissionConvert;
