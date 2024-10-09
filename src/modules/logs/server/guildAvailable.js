/* eslint-disable no-console */
const { Events } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = {
	name: Events.GuildAvailable,
	description: "Log Guild Available.",
	once: false,
	async execute(guild) {
		console.info(`[${DateTime.utc().toFormat(timeFormat)}][Discord] Guild ${guild.name} (ID: ${guild.id}) is available.`);
	}
};