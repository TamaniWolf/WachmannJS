/* eslint-disable prefer-const */
// Require SQLite and Databases
const SQLite = require("better-sqlite3");
const sql_AuditLogs = new SQLite("./data/sqlite/auditLog.sqlite");

class DB {
	static auditLogs() {
		let data;
		data = sql_AuditLogs;
		return data;
	}
}

exports.DB = DB;