/* eslint-disable no-console */
const { Events } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = {
	name: Events.ShardReady,
	description: "Log Shard Ready.",
	once: false,
	async execute(shardId, unavailableGuilds) {
		// console.log("shardReady.js");
		// console.log(shardId);
		// console.log(unavailableGuilds);

		if (unavailableGuilds == null) unavailableGuilds = "N/A";
		console.info(`[${DateTime.utc().toFormat(timeFormat)}][Discord] Shards ${shardId} ready.`);
		console.info(`[${DateTime.utc().toFormat(timeFormat)}][Discord] Guilds in Shards ${unavailableGuilds} unavailable.`);
	}
};