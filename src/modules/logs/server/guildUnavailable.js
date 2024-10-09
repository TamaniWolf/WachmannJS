/* eslint-disable no-console */
const { Events } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = {
	name: Events.GuildUnavailable,
	description: "Log Guild Unavailable.",
	once: false,
	async execute(guild) {
		// console.log("guildUnavailable.js");
		// console.log(guild);

		console.info(`[${DateTime.utc().toFormat(timeFormat)}][Discord] Guild ${guild.name} (ID: ${guild.id}) is unavailable.`);
	}
};