
const { EmbedBuilder, AuditLogEvent } = require('discord.js');
require('dotenv').config();
module.exports = {
    name: 'guildBanRemove',
    description: 'Loggin bot\'s beeing added to the server.',
    call: 'on', // client.once = 'once', client.on = 'on'
    async execute(ban) {
        const { DevCheck } = require('../../tools/functions/devCheck');
        const logChannel = await DevCheck.LogChannel();
        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanRemove,
        });
        const banLog = fetchedLogs.entries.first();
        if (logChannel === '100000000000000000') {
            return;
        };
        const { reason, executor, target } = banLog;
            let icon2 = executor.avatarURL();
            if(executor.avatar == null) {
                icon2 = 'attachment://discord_logo_gray.png';
            };
            
            const embedBanRemove = new EmbedBuilder()
                .setAuthor({name: `${executor.tag}`, iconURL: `${icon2}`})
                .setColor('DarkGreen')
                .setDescription(`${target} got **Unbanned** by ${executor}`)
                .setFooter({text: `MemberID: ${target.id}`})
                .setTimestamp(new Date());
            if (target.id === ban.user.id && reason != null) {
                embedBanRemove.addFields(
                    { name: '**Reason:**', value: `${reason}` },
                )
            };
            if (target.id === ban.user.id) {
                globalclient.channels.cache.get(logChannel).send({embeds: [embedBanRemove]});
            };
    },
};