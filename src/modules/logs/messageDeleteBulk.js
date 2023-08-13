
const { EmbedBuilder, AuditLogEvent } = require('discord.js');
require('dotenv').config();
module.exports = {
    name: 'messageDeleteBulk',
    description: 'Loggin bot\'s beeing added to the server.',
    call: 'on', // client.once = 'once', client.on = 'on'
    async execute(messages) {
        const { DevCheck } = require('../../tools/functions/devCheck');
        const logChannel = await DevCheck.LogChannel();
        const { DateTime } = require('luxon');
        // SQLite
        const { Get, Set, Del } = require('../../tools/functions/sqlite/prepare');
        let msgs = messages.map(function(obj) {
            return obj;
        });
        let getGuildID = msgs[0].guildId;
        let guild = await globalclient.guilds.fetch(getGuildID);
        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MessageBulkDelete,
        });
        const botLog = fetchedLogs.entries.first();
        const { executor, id, extra } = botLog;
        // Data Null
        let dataAuditLog;
        // Data Get
        dataAuditLog = Get.auditLogs(botLog.id);
        // Data Check
        if (dataAuditLog == null) {
            dataAuditLog = '0';
        };
            const MessageDelEmbed = new EmbedBuilder()
                .setColor('Orange')
                .setTimestamp(new Date());
            
            let icon2 = executor.avatarURL();
            if(executor.avatar == null) {
                icon2 = 'attachment://discord_logo_gray.png';
            };
            if (dataAuditLog === '0') {
                // New AuditLog Entry + New Message
                MessageDelEmbed.setAuthor({name: `${executor.tag}`, iconURL: `${icon2}`})
                    .setDescription(`${executor} **Bulk Deleted** ${messages.size} Messages in <#${msgs[0].channelId}>`)
                    .setFooter({text: `BotID: ${executor.id}`})
                    dataAuditLog = { AuditLogID: `${id}`, GuildID: `${getGuildID}`, Type: `Message_Delete`, Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
                    Set.auditLogs(dataAuditLog);
                    globalclient.channels.cache.get(logChannel).send({embeds: [MessageDelEmbed]});
            } else
            if (dataAuditLog.AuditLogID === id && dataAuditLog.Count < extra.count) {
                // Highter counter + New Message
                MessageDelEmbed.setAuthor({name: `${executor.tag}`, iconURL: `${icon2}`})
                    .setDescription(`${executor} **Bulk Deleted** ${messages.size} Messages in <#${msgs[0].channelId}>`)
                    .setFooter({text: `BotID: ${executor.id}`})
                    dataAuditLog = { AuditLogID: `${id}`, GuildID: `${getGuildID}`, Type: `Message_Delete`, Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
                    Set.auditLogs(dataAuditLog);
                    globalclient.channels.cache.get(logChannel).send({embeds: [MessageDelEmbed]});
            };
            let dataAuditLogDate;
            dataAuditLogDate = Get.allAuditLogs('Message_Delete');
            if (dataAuditLogDate.length < 4) {
                return;
            } else {
                dataAuditLogDate.forEach(date => {
                    let dtRemove = DateTime.now().minus({ days: 20 });
                    let timeNew = dtRemove.toMillis();
                    if (timeNew >= date.Date) {
                        Del.auditLogs(date.AuditLogID);
                    };
                });
            };
    },
};