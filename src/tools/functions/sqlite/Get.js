/* eslint-disable prefer-const */
/* eslint-disable no-undef */
// Require SQLite and Databases
const SQLite = require("better-sqlite3");
const sql_Config = new SQLite("./data/sqlite/config.sqlite");
const sql_AuditLogs = new SQLite("./data/sqlite/auditLog.sqlite");
const sql_Moderation = new SQLite("./data/sqlite/moderation.sqlite");

class Get {
	// Regular
	// Config
	static botConfig(id) {
		let data;
		globalclient.getConfig = sql_Config.prepare("SELECT * FROM config WHERE ConfigID = ?");
		data = globalclient.getConfig.get(id);
		return data;
	}
	static botConfigByClient(id) {
		let data;
		globalclient.getConfigClient = sql_Config.prepare("SELECT * FROM config WHERE BotID = ?");
		data = globalclient.getConfigClient.get(id);
		return data;
	}
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
	// Moderation
	static moderation(id) {
		let data;
		globalclient.getModeration = sql_Moderation.prepare("SELECT * FROM moderation WHERE ModerationID = ?");
		data = globalclient.getModeration.get(id);
		return data;
	}
	// By Guild
	// Config by Guild
	static botConfigByGuild(id) {
		let data;
		globalclient.getConfigByGuild = sql_Config.prepare("SELECT * FROM config WHERE GuildID = ?");
		data = globalclient.getConfigByGuild.get(id);
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
	// Moderation by Guild
	static moderationByGuild(id) {
		let data;
		globalclient.getModerationByGuild = sql_Moderation.prepare("SELECT * FROM moderation WHERE GuildID = ?");
		data = globalclient.getModerationByGuild.get(id);
		return data;
	}
	// All
	// All Config
	static allBotConfig(id) {
		let data;
		globalclient.getAllConfig = sql_Config.prepare("SELECT * FROM config WHERE GuildID = ?");
		data = globalclient.getAllConfig.get(id);
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
	// All Moderation
	static allModeration(id) {
		let data;
		globalclient.getAllModeration = sql_Moderation.prepare("SELECT * FROM moderation WHERE GuildID = ?");
		data = globalclient.getAllModeration.get(id);
		return data;
	}
	// By Type
	// Moderation
	static moderationByType(id, type) {
		let data;
		globalclient.getModerationByType = sql_Moderation.prepare("SELECT * FROM moderation WHERE ModerationID = ? AND Type = ?");
		data = globalclient.getModerationByType.get(id, type);
		return data;
	}
	static moderationNoSpamByType(id, type) {
		let data;
		globalclient.getModerationNoSpamByType = sql_Moderation.prepare("SELECT * FROM nospam WHERE ModerationID = ? AND Type = ?");
		data = globalclient.getModerationNoSpamByType.get(id, type);
		return data;
	}
}

exports.Get = Get;