/* eslint-disable max-len */
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
const { DateTime } = require("luxon");
require("dotenv").config();

module.exports = () => {
	const { Create } = require("../db.js");
	// Config
	Create.tableWithColums("Config", "discord_bot", "ConfigID", "GuildID VARCHAR, ShardID VARCHAR, BotID VARCHAR, Lang TEXT");
	// AuditLogs
	Create.tableWithColums("AuditLogs", "auditlog", "AuditLogID", "GuildID VARCHAR, ShardID VARCHAR, Type VARCHAR, Date VARCHAR");
	Create.tableWithColums("AuditLogs", "message_delete", "AuditLogID", "GuildID VARCHAR, ShardID VARCHAR, Type VARCHAR, Count VARCHAR, Date VARCHAR");
	// Moderation
	Create.tableWithColums("Moderation", "moderation", "ModerationID", "GuildID VARCHAR, ShardID VARCHAR, Type VARCHAR, Extra VARCHAR, Object VARCHAR");
	Create.tableWithColums("Moderation", "captcha", "ModerationID", "GuildID VARCHAR, ShardID VARCHAR, Type VARCHAR, MemberID VARCHAR, Attempts VARCHAR");
	Create.tableWithColums("Moderation", "nospam", "ModerationID", "GuildID VARCHAR, ShardID VARCHAR, Type VARCHAR, Extra VARCHAR, Object VARCHAR");

	// Get Guilds data and pass it on.
	// eslint-disable-next-line prefer-const, no-undef
	const guildsCache = globalclient.guilds.cache.size;
	if (guildsCache !== 0) {
		// eslint-disable-next-line no-undef
		globalclient.guilds.cache.each(guild => {
			const { SQLiteTableData } = require("./startData.js");
			SQLiteTableData.data(guild);
		});
	}
	// eslint-disable-next-line no-console
	console.log(`[${DateTime.utc().toFormat(timeFormat)}][Discord] Database created.`);
};
