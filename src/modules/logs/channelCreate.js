
const { EmbedBuilder, AuditLogEvent } = require('discord.js');
require('dotenv').config();
module.exports = {
    name: 'channelCreate',
    description: 'Loggin bot\'s beeing added to the server.',
    call: 'on', // client.once = 'once', client.on = 'on'
    async execute(channel) {
        const { DevCheck } = require('../../tools/functions/devCheck');
        const logChannel = await DevCheck.LogChannel();
        // SQLite
        const { Get } = require('../../tools/functions/sqlite/prepare');
        // AuditLog Fetch
        const FetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelCreate,
        });
        const channelCreateLog = FetchedLogs.entries.first();
        // Data Null
        let dataAuditLogID;
        // Data Get
        dataAuditLogID = Get.auditLogs(channelCreateLog.id);
        // Context
            const { targetType, actionType, executor, target } = channelCreateLog;
            if(targetType === 'Channel' && actionType === 'Create') {
                // Embed
                let icon2 = executor.avatarURL();
                if(executor.avatar == null) {
                    icon2 = 'attachment://discord_logo_gray.png';
                };
                const channelCreateEmbed = new EmbedBuilder()
                    .setAuthor({name: `${executor.tag}`, iconURL: `${icon2}`})
                    .setColor('Blue')
                // Bot/Member
                if (executor.bot === false) {
                    channelCreateEmbed.setFooter({text: `MemberID: ${executor.id}`});
                } else
                if (executor.bot === true) {
                    channelCreateEmbed.setFooter({text: `BotID: ${executor.id}`});
                };
                // Channel Type
                const ChannelTypeConvert = require('../../tools/functions/channelTypeConvert.js');
                let chaTypeNew = await ChannelTypeConvert.channelTypeNumber(target.type);
                if(chaTypeNew !== '') {
                    if (chaTypeNew === 'Category'){
                        channelCreateEmbed.setDescription(`${executor} **Created** ${chaTypeNew} \`${target.name}\``)
                    };
                    if (chaTypeNew !== 'Category'){
                        channelCreateEmbed.setDescription(`${executor} **Created** ${chaTypeNew} ${target}`)
                    };
                    // AddFields
                    channelCreateEmbed.setTimestamp(new Date());
                    globalclient.channels.cache.get(logChannel).send({embeds: [channelCreateEmbed]});
                };
            };
    },
};