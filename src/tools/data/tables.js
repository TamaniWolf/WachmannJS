/* eslint-disable no-console */
const timeFormat = "LL" + "/" + "dd" + "/" + "yyyy" + "-" + "h" + ":" + "mm" + ":" + "ss" + "-" + "a";
const { DateTime } = require("luxon");
require("dotenv").config();

module.exports = () => {
	const { DB } = require("../functions/sqlite/prepare");
	// CONFIG
	// Config
	// Check if the table config exists.
	const tableConfig = DB.config().prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'config';").get();
	if (!tableConfig["count(*)"]) {
		// If the table isn't there, create it and setup the database correctly.
		DB.config().prepare("CREATE TABLE config (ConfigID TEXT PRIMARY KEY, GuildID TEXT, ShardID TEXT, BotID TEXT, Lang TEXT);").run();
		// Ensure that the "id" row is always unique and indexed.
		DB.config().prepare("CREATE UNIQUE INDEX idx_config_id ON config (ConfigID);").run();
		DB.config().pragma("synchronous = 1");
		DB.config().pragma("journal_mode = wal");
	} else if (tableConfig["count(*)"]) {
		require("./column/config/config")();
	}
	//
	// MODERATION
	// AuditLog
	// Check if the table auditlog exists.
	const tableAuditLog = DB.auditLogs().prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'auditlog';").get();
	if (!tableAuditLog["count(*)"]) {
		// If the table isn't there, create it and setup the database correctly.
		DB.auditLogs().prepare("CREATE TABLE auditlog (AuditLogID VARCHAR PRIMARY KEY, GuildID VARCHAR, Type VARCHAR, Date VARCHAR);").run();
		// Ensure that the "id" row is always unique and indexed.
		DB.auditLogs().prepare("CREATE UNIQUE INDEX idx_auditlog_id ON auditlog (AuditLogID);").run();
		DB.auditLogs().pragma("synchronous = 1");
		DB.auditLogs().pragma("journal_mode = wal");
	} else if (tableAuditLog["count(*)"]) {
		require("./column/auditLog/auditlog")();
	}
	// Check if the table msgdel exists.
	const tableMsgDel = DB.auditLogs().prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'messagedel';").get();
	if (!tableMsgDel["count(*)"]) {
		// If the table isn't there, create it and setup the database correctly.
		DB.auditLogs().prepare("CREATE TABLE messagedel (AuditLogID VARCHAR PRIMARY KEY, GuildID VARCHAR, Type VARCHAR, Count VARCHAR, Date VARCHAR);").run();
		// Ensure that the "id" row is always unique and indexed.
		DB.auditLogs().prepare("CREATE UNIQUE INDEX idx_messagedel_id ON messagedel (AuditLogID);").run();
		DB.auditLogs().pragma("synchronous = 1");
		DB.auditLogs().pragma("journal_mode = wal");
	} else if (tableMsgDel["count(*)"]) {
		require("./column/auditLog/messageDel")();
	}
	//
	// Moderation
	// Check if the table moderation exists.
	const tableModeration = DB.moderation().prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'moderation';").get();
	if (!tableModeration["count(*)"]) {
		// If the table isn't there, create it and setup the database correctly.
		DB.moderation().prepare("CREATE TABLE moderation (ModerationID VARCHAR PRIMARY KEY, GuildID VARCHAR, Type VARCHAR, Extra VARCHAR, Object VARCHAR);").run();
		// Ensure that the "id" row is always unique and indexed.
		DB.moderation().prepare("CREATE UNIQUE INDEX idx_moderation_id ON moderation (ModerationID);").run();
		DB.moderation().pragma("synchronous = 1");
		DB.moderation().pragma("journal_mode = wal");
	} else if (tableModeration["count(*)"]) {
		require("./column/moderation/moderation")();
	}
	//
	// Get Guilds data and pass it on.
	// eslint-disable-next-line no-undef
	const guildsCache = globalclient.guilds.cache.size;
	if (guildsCache != 0) {
		// eslint-disable-next-line no-undef
		globalclient.guilds.cache.each(guild => {
			const { SQLiteTableData } = require("./startData.js");
			SQLiteTableData.data(guild);
		});
	}
	console.log(`[${DateTime.utc().toFormat(timeFormat)}][Discord] Database created.`);
};