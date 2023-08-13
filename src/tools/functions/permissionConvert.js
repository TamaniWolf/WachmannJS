
const { PermissionsBitField } = require('discord.js');
require('dotenv').config;

class PermissionConvert {
    static permissionsBitField(bitfield) {
        return new Promise((resolve, reject) => {
            try {
                let permBitfield = '';
                if (bitfield != 0) {
                    let bitfieldIn = new PermissionsBitField(bitfield);
                    // General Server Permissions
                    if (bitfieldIn.has(PermissionsBitField.Flags.ViewChannel) === true) {
                        permBitfield += 'View Channels\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.ManageChannels) === true) {
                        permBitfield += 'Manage Channels\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.ManageRoles) === true) {
                        permBitfield += 'Manage Roles\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.ManageGuildExpressions) === true) {
                        permBitfield += 'Manage Expressions\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.ViewAuditLog) === true) {
                        permBitfield += 'View Audit Log\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.ViewGuildInsights) === true) {
                        permBitfield += 'View Server Insights\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.ManageWebhooks) === true) {
                        permBitfield += 'Manage Webhooks\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.ManageGuild) === true) {
                        permBitfield += 'Manage Server\n';
                    };
                    // Membership Permissions
                    if (bitfieldIn.has(PermissionsBitField.Flags.CreateInstantInvite) === true) {
                        permBitfield += 'Create Invite\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.ChangeNickname) === true) {
                        permBitfield += 'Change Nickname\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.ManageNicknames) === true) {
                        permBitfield += 'Manage Nicknames\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.KickMembers) === true) {
                        permBitfield += 'Kick Members\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.BanMembers) === true) {
                        permBitfield += 'Ban Members\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.ModerateMembers) === true) {
                        permBitfield += 'Timeout Members\n';
                    };
                    // Text Channel Permissions
                    if (bitfieldIn.has(PermissionsBitField.Flags.SendMessages) === true) {
                        permBitfield += 'Send Messages and Create Posts\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.SendMessagesInThreads) === true) {
                        permBitfield += 'Send Messages in Threads and Posts\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.CreatePublicThreads) === true) {
                        permBitfield += 'Create Public Threads\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.CreatePrivateThreads) === true) {
                        permBitfield += 'Create Private Threads\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.EmbedLinks) === true) {
                        permBitfield += 'Embed Links\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.AttachFiles) === true) {
                        permBitfield += 'Attach Files\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.AddReactions) === true) {
                        permBitfield += 'Add Reactions\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.UseExternalEmojis) === true) {
                        permBitfield += 'Use External Emojis\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.UseExternalStickers) === true) {
                        permBitfield += 'Use External Stickers\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.MentionEveryone) === true) {
                        permBitfield += 'Mention @everyone, @here, and All Roles\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.ManageMessages) === true) {
                        permBitfield += 'Manage Messages\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.ManageThreads) === true) {
                        permBitfield += 'Manage Threads and Posts\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.ReadMessageHistory) === true) {
                        permBitfield += 'Read Message History\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.SendTTSMessages) === true) {
                        permBitfield += 'Send Text-to-Speech Messages\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.UseApplicationCommands) === true) {
                        permBitfield += 'Use Application Commands\n';
                    };
                    // Voice Channel Permissions
                    if (bitfieldIn.has(PermissionsBitField.Flags.Connect) === true) {
                        permBitfield += 'Connect\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.Speak) === true) {
                        permBitfield += 'Speak\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.Stream) === true) {
                        permBitfield += 'Video\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.UseEmbeddedActivities) === true) {
                        permBitfield += 'User Activities\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.UseVAD) === true) {
                        permBitfield += 'Use Voice Activity\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.PrioritySpeaker) === true) {
                        permBitfield += 'Priority Speaker\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.MuteMembers) === true) {
                        permBitfield += 'Mute Members\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.DeafenMembers) === true) {
                        permBitfield += 'Deafe nMembers\n';
                    };
                    if (bitfieldIn.has(PermissionsBitField.Flags.MoveMembers) === true) {
                        permBitfield += 'Move Members\n';
                    };
                    // Stage Channel Permissions
                    if (bitfieldIn.has(PermissionsBitField.Flags.RequestToSpeak) === true) {
                        permBitfield += 'Request to Speak\n';
                    };
                    // Events Permissions
                    if (bitfieldIn.has(PermissionsBitField.Flags.ManageEvents) === true) {
                        permBitfield += 'Manage Events\n';
                    };
                    // Advanced Permissions
                    if (bitfieldIn.has(PermissionsBitField.Flags.Administrator) === true) {
                        permBitfield += 'Administrator\n';
                    };
                };
                const permNew = permBitfield;
                resolve(permNew || '');
            } catch(err) {
                reject(err);
            };
        });
    };
};

module.exports = PermissionConvert;

/**
    1  AddReactions: 
    2  Administrator: 
    3  AttachFiles: 
    4  BanMembers: 
    5  ChangeNickname: 
    6  Connect: 
    7  CreateInstantInvite: 
    8  CreatePrivateThreads: 
    9  CreatePublicThreads: 
    10 DeafenMembers: 
    11 EmbedLinks: 
    12 KickMembers: 
    13 ManageChannels: 
    14 ManageExpressions: 
    15 ManageEvents: 
    16 ManageGuild: 
    17 ManageMessages: 
    18 ManageNicknames: 
    19 ManageRoles: 
    20 ManageThreads: 
    21 ManageWebhooks: 
    22 MentionEveryone: 
    23 ModerateMembers: 
    24 MoveMembers: 
    25 MuteMembers: 
    26 PrioritySpeaker: 
    27 ReadMessageHistory: 
    28 RequestToSpeak: 
    29 SendMessages: 
    30 SendMessagesInThreads: 
    31 SendTTSMessages: 
    32 Speak: 
    33 Stream: 
    34 UseApplicationCommands: 
    35 UseEmbeddedActivities: 
    36 UseExternalEmojis: 
    37 UseExternalStickers: 
    38 UseVAD: 
    39 ViewAuditLog: 
    40 ViewChannel: 
    42 ViewGuildInsights: 
 */