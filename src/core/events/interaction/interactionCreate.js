// Require
// eslint-disable-next-line no-unused-vars
const { Events, Integration, Collection } = require("discord.js");
// Require dotenv as config (.env).
require("dotenv").config();
module.exports = {
	name: Events.InteractionCreate,
	once: false,
	/**
     * @param {Integration} interaction
     */
	async execute(interaction) {
		// eslint-disable-next-line no-undef
		const client = globalclient;

		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command || !command.data || command.prefix !== "slash") return;

			const langError = require(`../../../../data/lang/${process.env.BOTLANG}/error.json`);
			const { LanguageConvert } = require("../../../tools/utils.js");
			// Cooldown
			const { cooldowns } = client;

			if (!cooldowns.has(command.data.name)) cooldowns.set(command.data.name, new Collection());

			const now = Date.now();
			const timestamps = cooldowns.get(command.data.name);
			const defaultCooldownDuration = 3;
			const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

			if (timestamps.has(interaction.user.id)) {
				const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

				if (now < expirationTime) {
					const expiredTimestamp = Math.round(expirationTime / 1000);
					const prasInted = parseInt(expiredTimestamp);
					return interaction.reply({ content: LanguageConvert.lang(langError.command.cooldown, command.data.name, prasInted), ephemeral: true });
				}
			}

			timestamps.set(interaction.user.id, now);
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

			try {
				await command.execute(interaction);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
				await interaction.reply({ content: langError.command.execute, ephemeral: true });
			}
		}
	}
};
