
const { readdirSync } = require('fs');
const { DateTime } = require('luxon');
const timeFormat = 'LL'+'/'+'dd'+'/'+'yyyy'+'-'+'h'+':'+'mm'+':'+'ss'+'-'+'a';

module.exports = (client) =>{
    // Grabs folders and files out of the strings, one by one (for loop).
    const eventFolders = readdirSync('./src/core/events');
    for (const folder of eventFolders) {
        const eventFilesJS = readdirSync(`./src/core/events/${folder}`).filter(files => files.endsWith('.js'));
        const eventReady = eventFilesJS.filter(files => files.endsWith('ready.js'));
        const eventFiles = eventFilesJS.filter(files => !files.endsWith('ready.js'));
        for (const fileR of eventReady) {
            const eventR = require(`../events/${folder}/${fileR}`);
            // Calls files as an event once or on ON.
            if (eventR) {
                client.on(eventR.name, (...args) => eventR.execute(...args));
            };
        };
        for (const file of eventFiles) {
            const event = require(`../events/${folder}/${file}`);
            // Calls files as an event once or on ON.
            if (event) {
                client.on(event.name, (...args) => event.execute(...args));
            };
        };
    };
    console.log('[' + DateTime.utc().toFormat(timeFormat) + '][Discord]', 'Event Heandler loaded');
};