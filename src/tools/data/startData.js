/* eslint-disable max-len */
/* eslint-disable no-undef */
require("dotenv").config();

class SQLiteTableData {
	static data(guild) {
		// SQLite
		const { Get, Set } = require("../functions/sqlite/prepare");
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
			dataConfig = Get.botConfig(getBotConfigId);
			if (dataConfig == null) {
				dataConfig = { ConfigID: `${getBotConfigId}`, GuildID: `${getClientGuildId}`, ShardID: `${getClientShardId}`, BotID: `${getClientUserId}`, Lang: "./data/lang/en_US.json" };
				Set.botConfig(dataConfig);
			}
		}
	}
}
exports.SQLiteTableData = SQLiteTableData;