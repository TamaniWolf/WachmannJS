
const { Events } = require('discord.js');
module.exports = {
    name: Events.GuildCreate,
    description: 'Loggin bot\'s beeing added to the server.',
    once: true,
    async execute(guild) {
        console.log(`The Bot Joined a new server: ${guild.name}`);
    },
};
