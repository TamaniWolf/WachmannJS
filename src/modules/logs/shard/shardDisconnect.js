/* eslint-disable no-console */
const { Events } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = {
	name: Events.ShardDisconnect,
	description: "Log Shard Disconnect.",
	once: false,
	async execute(event, shardId) {
		// console.log("shardDisconnect.js");
		// console.log(event);
		// console.log(shardId);

		console.info(`[${DateTime.utc().toFormat(timeFormat)}][Discord] Shard Disconnect, Code: ${event.code}, wasClean: ${event.wasClean}, ShardId: ${shardId}`);
	}
};