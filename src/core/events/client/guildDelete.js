
const { Events } = require('discord.js');
module.exports = {
    name: Events.GuildDelete,
    description: 'Loggin bot\'s beeing added to the server.',
    once: true,
    async execute(guild) {
        console.log(`The Bot left a server: ${guild.name}`);
        ['leave'].forEach(systemHandler =>{
            require(`../../../modules/database/create/${systemHandler}.js`)(guild);
        });
    },
};
