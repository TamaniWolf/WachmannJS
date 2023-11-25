/* eslint-disable prefer-const */
/* eslint-disable no-undef */
// Require SQLite and Databases
const SQLite = require("better-sqlite3");
const sql_Config = new SQLite("./data/sqlite/config.sqlite");
const sql_AuditLogs = new SQLite("./data/sqlite/auditLog.sqlite");
const sql_Moderation = new SQLite("./data/sqlite/moderation.sqlite");

class DB {
	static config() {
		let data;
		data = sql_Config;
		return data;
	}
	static auditLogs() {
		let data;
		data = sql_AuditLogs;
		return data;
	}
	static moderation() {
		let data;
		data = sql_Moderation;
		return data;
	}
}

exports.DB = DB;