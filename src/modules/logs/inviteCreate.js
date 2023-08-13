
const { EmbedBuilder, AuditLogEvent } = require('discord.js');
require('dotenv').config();
module.exports = {
    name: 'inviteCreate',
    description: 'Loggin bot\'s beeing added to the server.',
    call: 'on', // client.once = 'once', client.on = 'on'
    async execute(invite) {
        const { DevCheck } = require('../../tools/functions/devCheck');
        const logChannel = await DevCheck.LogChannel();
        // SQLite
        const fetchedLogs = await invite.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.InviteCreate,
        });
        const botLog = fetchedLogs.entries.first();
            const { executor, target } = botLog;
            let icon2 = executor.avatarURL();
            if(executor.avatar == null) {
                icon2 = 'attachment://discord_logo_gray.png';
            };
            const memberLeave = new EmbedBuilder()
            .setAuthor({name: `${executor.tag}`, iconURL: `${icon2}`})
            .setColor('Blue')
            .setDescription(`${executor} **Created** an Invite for This Server`)
            .addFields(
                { name: 'Link:', value: `https://discord.gg/${target.code}`, inline: true },
                { name: 'Channel:', value: `${target.channel}`, inline: true },
                // { name: 'Expires on:', value: ``, inline: true },
                // { name: 'More:', value: `` },
            )
            .setFooter({text: `MemberID: ${target.inviterId}`})
            .setTimestamp(new Date());
            globalclient.channels.cache.get(logChannel).send({embeds: [memberLeave]});
    },
};