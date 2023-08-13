
const { DateTime } = require('luxon');
const fs = require('node:fs');
const timeFormat = 'LL'+'/'+'dd'+'/'+'yyyy'+'-'+'h'+':'+'mm'+':'+'ss'+'-'+'a';

module.exports = (globalclient) =>{
    let enabledModulesSplit = process.env.ENABLE_MODULES.split(/,+/);
    let enabledModulesTrim = enabledModulesSplit.map(obj => {return obj.trim();});
    let enabledModules = enabledModulesTrim.filter(m => m === 'logs').toString();
    if (enabledModules !== '') {
        // Filtering out .js files in to a string.
        const logs_files = fs.readdirSync(`./src/modules/logs`).filter(file => file.endsWith('.js'));
        // Grabs files out of the string, one by one (for loop).
        for(const file of logs_files){
            const log = require(`../../modules/logs/${file}`);
            // Calls files as an event once or on ON.
            if (log.call === 'once') {
                globalclient.once(log.name, (...args) => log.execute(...args));
            } else if (log.call === 'on') {
                globalclient.on(log.name, (...args) => log.execute(...args));
            } else if (!log.call) {
                continue;
            } else {
                console.error(`${log}\nUnknown Argument:\n Only \'once\' and \'on\' are passed to true.\n\n`);
                continue;
            };
        };

        console.log('[' + DateTime.utc().toFormat(timeFormat) + '][Discord]', 'Logs Heandler Loaded');
    } else {
        console.log('[' + DateTime.utc().toFormat(timeFormat) + '][Discord]', 'Logs Heandler Disabled');
    };
};