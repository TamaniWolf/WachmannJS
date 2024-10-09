/* eslint-disable no-console */
const { Events } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = {
	name: Events.ShardResume,
	description: "Log Shard Resume.",
	once: false,
	async execute(shardId, replayedEvents) {
		// console.log("shardResume.js");
		// console.log(shardId);
		// console.log(replayedEvents);

		console.info(`[${DateTime.utc().toFormat(timeFormat)}][Discord] Shards ${shardId} resumed. Replayed Events: ${replayedEvents}`);
	}
};