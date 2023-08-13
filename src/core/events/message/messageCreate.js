
// Require discord.js, fs, Luxon.
const { Events, Message, Collection } = require('discord.js');
// Require dotenv as config (.env).
require('dotenv').config();

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */
    async execute(message) {
        // Check for Bot.
        if (!message.author || message.author.bot) {
            return;
        };

        // Get Arguments and Command Name from Message.
        let prefix;
        const startsWithPrefix = message.content.startsWith(process.env.PREFIX);
        const startsWithWachmann = message.content.startsWith(`<@${process.env.WACHMANN_ID}>`);
        let msg;let args;
        let msgNone;let argsNone;
        let msgPrefix;let argsPrefix;
        let msgWachmann;let argsWachmann;
        if (message.guild == null) {
            if (startsWithWachmann && !startsWithPrefix) {
                msgWachmann = message.content.replace(`<@${process.env.WACHMANN_ID}> `, '').toLowerCase();
                argsWachmann = msgWachmann.split(/ +/);
                msg = msgWachmann;
                args = argsWachmann;
                prefix = `<@${process.env.WACHMANN_ID}> `;
            } else if (!startsWithWachmann && !startsWithPrefix) {
                msgNone = message.content.toLowerCase();
                argsNone = msgNone.split(/ +/);
                msg = msgNone;
                args = argsNone;
            };
        } else if (startsWithPrefix && !startsWithWachmann) {
            msgPrefix = message.content.replace(process.env.PREFIX, '').toLowerCase();
            argsPrefix = msgPrefix.split(/ +/);
            msg = msgPrefix;
            args = argsPrefix;
            prefix = process.env.PREFIX;
        } else if (startsWithWachmann && !startsWithPrefix) {
            msgWachmann = message.content.replace(`<@${process.env.WACHMANN_ID}> `, '').toLowerCase();
            argsWachmann = msgWachmann.split(/ +/);
            msg = msgWachmann;
            args = argsWachmann;
            prefix = `<@${process.env.WACHMANN_ID}> `;
        } else { return; };
        let cmdArgs = args;
        const commandName = cmdArgs.shift().toLowerCase();
        if (!commandName) {
            return;
        };

        const { cooldowns } = globalclient;
        let command = globalclient.commands.get(commandName);
        if (command == null) { return; };

        // Cooldown
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        };

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 1) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if (now < expirationTime) {
                return;
            };
        };

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        // Check for Prefix and Prefix true.
        if (command.prefix === 'true') {
            //Execute Command.
            try {
                if (!startsWithWachmann && startsWithPrefix) {
                    command.execute(message, args, prefix, commandName, globalclient)
                };
            } catch (error) {
                console.error(error);
                message.channel.send({ content: 'There was an error while executing this command!', ephemeral: true });
            };
        } else
        // Check for Prefix and Prefix false.
        if (command.prefix === 'false') {
            //Execute Command.
            try {
                if (!startsWithPrefix && startsWithWachmann) {
                    command.execute(message, args, prefix, commandName, globalclient);
                } else if (message.guild == null) {
                    command.execute(message, args, prefix, commandName, globalclient);
                };
            } catch (error) {
                console.error(error);
                message.channel.send({ content: 'There was an error while executing this command!', ephemeral: true });
            };
        };
    },
};
