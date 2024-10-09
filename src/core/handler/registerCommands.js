/* eslint-disable no-console */
const { readdirSync } = require("fs");
// eslint-disable-next-line no-unused-vars
const { REST, Routes, Message } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
const lang = require(`../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
const langDev = lang.cmd.dev;
const { Utils, LanguageConvert } = require("../../tools/utils.js");
require("dotenv").config();

class RegisterCommands {
	/**
	 * Register SlashCommands Localy.
	 *
	 * @param {Message} interaction
	 * @param {any} globalclient
	 */
	static registerLocal(interaction, globalclient) {
		// eslint-disable-next-line no-undef
		const clientID = globalclient.user.id;
		const guildID = interaction.guild.id;
		const commands = [];
		const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
		// Getting Directory name from list and filter out .js filesin to a string.
		const load_dir = (subDirs) => {
			const commandFiles = readdirSync(`./src/commands/${subDirs}`).filter(cmdFile => cmdFile.endsWith(".js") && !cmdFile.startsWith("#"));
			// Grabs files out of the string, one by one (for loop) and Sets Command in the Collection.
			for (const cmdFile of commandFiles) {
				const command = require(`../../${subDirs}/${cmdFile}`);
				if (command == null) return;
				if (command.data.name) commands.push(command.data.toJSON());
				// If Name is undefined or Admin False, continue (for loop).
				if (!command.data.name) continue;
			}
		};
		// Directory name array list.
		const subCmdDirs = readdirSync("./src/commands/");
		subCmdDirs.forEach(subDir => load_dir(subDir));
		(async () => {
			try {
				// eslint-disable-next-line no-console
				console.log(`[${DateTime.utc().toFormat(timeFormat)}] Started refreshing ${commands.length} guild (/) commands.`);
				const data = await rest.put(
					// Local commands
					Routes.applicationGuildCommands(clientID, guildID),
					{ body: commands }
				);
				const conMsg = `[${DateTime.utc().toFormat(timeFormat)}] Successfully reloaded ${data.length} guild (/) commands.`;
				const replyMsg = { content: LanguageConvert.lang(langDev.deploy.localadd, data.length) };
				// eslint-disable-next-line no-console
				console.log(conMsg);
				Utils.messageReply(interaction, replyMsg);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
			}
		})();
	}
	/**
	 * Register SlashCommands Globaly.
	 *
	 * @param {Message} interaction
	 * @param {any} globalclient
	 */
	static registerGlobal(interaction, globalclient) {
		// eslint-disable-next-line no-undef
		const clientID = globalclient.user.id;
		const lang = require(`../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langDev = lang.cmd.dev;
		const { Utils, LanguageConvert } = require("../../tools/utils.js");

		const commands = [];
		const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
		// Getting Directory name from list and filter out .js filesin to a string.
		const load_dir = (subDirs) => {
			const commandFiles = readdirSync(`./src/commands/${subDirs}`).filter(cmdFile => cmdFile.endsWith(".js") && !cmdFile.startsWith("#"));
			// Grabs files out of the string, one by one (for loop) and Sets Command in the Collection.
			for (const cmdFile of commandFiles) {
				const command = require(`../../commands/${subDirs}/${cmdFile}`);
				if (command == null) return;
				if (command.data.name) commands.push(command.data.toJSON());
				// If Name is undefined and/or Admin False, continue (for loop).
				if (!command.data.name) continue;
			}
		};
		// Directory name array list.
		const subCmdDirs = readdirSync("./src/commands/");
		subCmdDirs.forEach(subDir => load_dir(subDir));
		(async () => {
			try {
				// eslint-disable-next-line no-console
				console.log(`[${DateTime.utc().toFormat(timeFormat)}] Started refreshing ${commands.length} application (/) commands.`);
				const data = await rest.put(
					// Local commands
					Routes.applicationCommands(clientID),
					{ body: commands }
				);
				const conMsg = `[${DateTime.utc().toFormat(timeFormat)}] Successfully reloaded ${data.length} application (/) commands.`;
				const replyMsg = { content: LanguageConvert.lang(langDev.deploy.globaladd, data.length) };
				// eslint-disable-next-line no-console
				console.log(conMsg);
				Utils.messageReply(interaction, replyMsg);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
			}
		})();
	}
	/**
	 * Unregister SlashCommands Localy.
	 *
	 * @param {Message} interaction
	 * @param {any} globalclient
	 */
	static unregisterLocal(interaction, globalclient) {
		// eslint-disable-next-line no-undef
		const clientID = globalclient.user.id;
		const getGuildID = interaction.guild.id;
		const lang = require(`../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langDev = lang.cmd.dev;

		const commands = [];
		const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
		// Getting Directory name from list and filter out .js filesin to a string.
		const load_dir = (subDirs) => {
			const commandFiles = readdirSync(`./src/commands/${subDirs}`).filter(cmdFile => cmdFile.endsWith(".js") && !cmdFile.startsWith("#"));
			// Grabs files out of the string, one by one (for loop) and Sets Command in the Collection.
			for (const cmdFile of commandFiles) {
				const command = require(`../../commands/${subDirs}/${cmdFile}`);
				if (command == null) return;
				if (command.data.name) commands.push(command.data.toJSON());
				// If Name is undefined or Admin False, continue (for loop).
				if (!command.data.name) continue;
			}
		};
		// Directory name array list.
		const subCmdDirs = readdirSync("./src/commands/");
		subCmdDirs.forEach(subDir => load_dir(subDir));
		(async () => {
			try {
				// eslint-disable-next-line no-console
				console.log(`[${DateTime.utc().toFormat(timeFormat)}] Started removing all guild (/) commands.`);
				rest.put(
					// Local commands
					Routes.applicationGuildCommands(clientID, getGuildID),
					{ body: [] }
				);
				const conMsg = `[${DateTime.utc().toFormat(timeFormat)}] Successfully deleted all guild (/) commands.`;
				const replyMsg = { content: langDev.deploy.localremove };
				// eslint-disable-next-line no-console
				console.log(conMsg);
				Utils.messageReply(interaction, replyMsg);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
			}
		})();
	}
	/**
	 * Unregister SlashCommands Globaly.
	 *
	 * @param {Message} interaction
	 * @param {any} globalclient
	 */
	static unregisterGlobal(interaction, globalclient) {
		// eslint-disable-next-line no-undef
		const clientID = globalclient.user.id;
		const lang = require(`../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langDev = lang.cmd.dev;

		const commands = [];
		const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
		// Getting Directory name from list and filter out .js filesin to a string.
		const load_dir = (subDirs) => {
			const commandFiles = readdirSync(`./src/commands/${subDirs}`).filter(cmdFile => cmdFile.endsWith(".js") && !cmdFile.startsWith("#"));
			// Grabs files out of the string, one by one (for loop) and Sets Command in the Collection.
			for (const cmdFile of commandFiles) {
				const command = require(`../../commands/${subDirs}/${cmdFile}`);
				if (command == null) return;
				if (command.data.name) commands.push(command.data.toJSON());
				// If Name is undefined and/or Admin False, continue (for loop).
				if (!command.data.name) continue;
			}
		};
		// Directory name array list.
		const subCmdDirs = readdirSync("./src/commands");
		subCmdDirs.forEach(subDir => load_dir(subDir));
		(async () => {
			try {
				// eslint-disable-next-line no-console
				console.log(`[${DateTime.utc().toFormat(timeFormat)}] Started removing all application (/) commands.`);
				rest.put(
					// Local commands
					Routes.applicationCommands(clientID),
					{ body: [] }
				);
				const conMsg = `[${DateTime.utc().toFormat(timeFormat)}] Successfully deleted all application (/) commands.`;
				const replyMsg = { content: langDev.deploy.globalremove };
				// eslint-disable-next-line no-console
				console.log(conMsg);
				Utils.messageReply(interaction, replyMsg);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
			}
		})();
	}
}
module.exports.RegisterCommands = RegisterCommands;