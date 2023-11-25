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
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) return;

			const { Get } = require("../../../tools/functions/sqlite/prepare");
			let dataLang = Get.botConfig();
			if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
			const lang = require(`../../../.${dataLang.Lang}`);
			const { LanguageConvert } = require("../../../tools/functions/languageConvert");
			// Cooldown
			// eslint-disable-next-line no-undef
			const { cooldowns } = globalclient;

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
					return interaction.reply({ content: LanguageConvert.lang(lang.error.cmdcooldown, command.data.name, prasInted), ephemeral: true });
				}
			}

			timestamps.set(interaction.user.id, now);
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

			try {
				await command.execute(interaction);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
				await interaction.reply({ content: lang.error.cmderror, ephemeral: true });
			}
		}
	}
};
