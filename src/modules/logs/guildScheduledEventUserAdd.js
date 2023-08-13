
const { EmbedBuilder } = require('discord.js');
require('dotenv').config();
module.exports = {
    name: 'guildScheduledEventUserAdd',
    description: 'Loggin bot\'s beeing added to the server.',
    call: 'on', // client.once = 'once', client.on = 'on'
    async execute(guildScheduledEvent, user) {
        const { DevCheck } = require('../../tools/functions/devCheck');
        const logChannel = await DevCheck.LogChannel();
        // SQLite
            let icon2 = user.avatarURL();
            if(user.avatar == null) {
                icon2 = 'attachment://discord_logo_gray.png';
            };
            const memberLeave = new EmbedBuilder()
                .setAuthor({name: `${user.tag}`, iconURL: `${icon2}`})
                .setColor('Blue')
                .setDescription(`${user} is **interested** in Event \`${guildScheduledEvent.name}\``)
                .setFooter({text: `MemberID: ${user.id}`})
                .setTimestamp(new Date());
                globalclient.channels.cache.get(logChannel).send({embeds: [memberLeave]});
    },
};