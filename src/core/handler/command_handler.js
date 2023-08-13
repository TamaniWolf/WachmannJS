
const fs = require('fs');
const { DateTime } = require('luxon');
const timeFormat = 'LL'+'/'+'dd'+'/'+'yyyy'+'-'+'h'+':'+'mm'+':'+'ss'+'-'+'a';

module.exports = (globalclient) => {
    // Getting Directory name from list and filter out .js filesin to a string.
    const load_dir = (dirs) =>{
        const commandFiles = fs.readdirSync(`./src/commands/${dirs}`).filter(file => file.endsWith('.js'));
        // Grabs files out of the string, one by one (for loop) and Sets Command in the Collection.
        for (const file of commandFiles) {
            const command = require(`../../commands/${dirs}/${file}`);
            if (command == null) {
                return;
            };
            if (command.name) {
                globalclient.commands.set(command.name, command);
            } else {
                // If Name is undefined and/or Admin False, continue (for loop).
                continue;
            };
        }
    };
    // Directory name array list.
    const dirs = fs.readdirSync(`./src/commands`);
    dirs.forEach(c => load_dir(c));
    console.log('[' + DateTime.utc().toFormat(timeFormat) + '][Discord]', 'Command Heandler loaded');
}