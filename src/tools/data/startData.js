/* eslint-disable max-len */
/* eslint-disable no-undef */
require("dotenv").config();

class SQLiteTableData {
	/**
	 * @param {Object} guild The Guild Object
	 * @returns {void} Database table data
	 */
	static data(guild) {
		// SQLite
		const { Get, Set } = require("../db.js");
		// Get/Set
		if (globalclient) {
			const getClientGuildId = guild.id;
			const getClientShardId = guild.shard.id;
			const getClientUserId = globalclient.user.id;
			if (getClientGuildId == null) return;
			const getBotConfigId = `${getClientGuildId}-${getClientShardId}`;
			// CONFIG
			// Config
			let dataConfig;
			dataConfig = Get.configByID("discord_bot", getBotConfigId);
			if (dataConfig == null) {
				dataConfig = { ConfigID: `${getBotConfigId}`, GuildID: `${getClientGuildId}`, ShardID: `${getClientShardId}`, BotID: `${getClientUserId}`, Lang: "en_US" };
				Set.configByData("discord_bot", dataConfig);
			}
		}
	}
}
exports.SQLiteTableData = SQLiteTableData;
