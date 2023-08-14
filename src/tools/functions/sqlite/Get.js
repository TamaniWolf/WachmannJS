/* eslint-disable prefer-const */
/* eslint-disable no-undef */
// Require SQLite and Databases
const SQLite = require("better-sqlite3");
const sql_AuditLogs = new SQLite("./data/sqlite/auditLog.sqlite");

class Get {
	// AuditLog
	static auditLogs(id) {
		let data;
		globalclient.getAuditLogs = sql_AuditLogs.prepare("SELECT * FROM auditlog WHERE AuditLogID = ?");
		data = globalclient.getAuditLogs.get(id);
		return data;
	}
	static auditLogsMsgDel(id) {
		let data;
		globalclient.getMessageDel = sql_AuditLogs.prepare("SELECT * FROM messagedel WHERE AuditLogID = ?");
		data = globalclient.getMessageDel.get(id);
		return data;
	}
	// AuditLog by Guild
	static auditLogsByGuild(id) {
		let data;
		globalclient.getAuditLogsByGuild = sql_AuditLogs.prepare("SELECT * FROM auditlog WHERE GuildID = ?");
		data = globalclient.getAuditLogsByGuild.get(id);
		return data;
	}
	static auditLogsMsgDelByGuild(id) {
		let data;
		globalclient.getMessageDelByGuild = sql_AuditLogs.prepare("SELECT * FROM messagedel WHERE GuildID = ?");
		data = globalclient.getMessageDelByGuild.get(id);
		return data;
	}
	// All AuditLog
	static allAuditLogs(id) {
		let data;
		globalclient.getAllAuditLogs = sql_AuditLogs.prepare("SELECT * FROM auditlog WHERE Type = ? ORDER BY Date ASC LIMIT 5");
		data = globalclient.getAllAuditLogs.all(id);
		return data;
	}
	static allAuditLogsMsgDel(id) {
		let data;
		globalclient.getAllMessageDel = sql_AuditLogs.prepare("SELECT * FROM messagedel WHERE Type = ? ORDER BY Date ASC LIMIT 5");
		data = globalclient.getAllMessageDel.all(id);
		return data;
	}
}

exports.Get = Get;