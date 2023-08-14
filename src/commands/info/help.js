
// Require and set
const { DateTime } = require('luxon');
const fs = require('node:fs');
const timeFormat = 'LL'+'/'+'dd'+'/'+'yyyy'+'-'+'h'+':'+'mm'+':'+'ss'+'-'+'a';
require('dotenv').config();

module.exports = {
    name: 'help',
	cooldown: 5,
	prefix: 'false',
    async execute(message, args, prefix, commandName, globalclient) {
        if (message != null || message.channel.id != null || message.guild.id != null) {
            // Context
            const { DevCheck } = require('../../tools/functions/devCheck');
            const botMaster = await DevCheck.BotMaster(message);
            const botMasterRole = await DevCheck.BotMasterRole(message);
            const botChannel = await DevCheck.BotChannel(message);
            if (message.guild == null || botChannel === true) {
                function read(file, callback) {
                    fs.readFile(file, 'utf8', function(err, data) {
                        if (err) {
                            console.log(err);
                        }
                        callback(data);
                    });
                }
                read('data/text/help.txt', function(data) {
                    let a = data.replace('%s',`<@${message.author.id}>`)
                    message.reply(a);
                });
            // Error Messages
            } else {
                if (botMasterRole === true || botMaster === true) {
                    await message.reply({ content: `Nope, not here, try somewhere else.`, ephemeral: true });
                };
            };
        } else {
            console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command \'adminhelp\' returned \'null / undefined\'.`);
        };
    },
};
