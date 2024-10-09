/* eslint-disable no-console */
const { Events } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = {
	name: Events.ShardReconnecting,
	description: "Log Shard Reconnecting.",
	once: false,
	async execute(shardId) {
		// console.log("shardReconnecting.js");
		// console.log(shardId);

		console.info(`[${DateTime.utc().toFormat(timeFormat)}][Discord] Shards ${shardId} reconnecting.`);
	}
};