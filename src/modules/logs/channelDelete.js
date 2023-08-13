
const { EmbedBuilder, AuditLogEvent } = require('discord.js');
require('dotenv').config();
module.exports = {
    name: 'channelDelete',
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
            type: AuditLogEvent.ChannelDelete,
        });
        const channelDeleteLog = FetchedLogs.entries.first();
        // Data Null
        let dataAuditLogID;
        // Data Get
        dataAuditLogID = Get.auditLogs(channelDeleteLog.id);
        // Context
            const { targetType, actionType, executor, target } = channelDeleteLog;
            if(targetType === 'Channel' && actionType === 'Delete') {
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
                    channelCreateEmbed.setDescription(`${executor} **Deleted** ${chaTypeNew} \`${target.name}\``)
                    // AddFields
                    channelCreateEmbed.setTimestamp(new Date());
                    globalclient.channels.cache.get(logChannel).send({embeds: [channelCreateEmbed]});
                };
            };
    },
};