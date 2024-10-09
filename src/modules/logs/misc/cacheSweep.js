/* eslint-disable no-console */
const { Events } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = {
	name: Events.CacheSweep,
	description: "Log Cache Sweeping.",
	once: false,
	async execute(threads) {
		console.info(`[${DateTime.utc().toFormat(timeFormat)}][Discord] Cache ${threads}`);
	}
};