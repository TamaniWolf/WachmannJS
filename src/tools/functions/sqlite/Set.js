/* eslint-disable prefer-const */
/* eslint-disable no-undef */
// Require SQLite and Databases
const SQLite = require("better-sqlite3");
const sql_Config = new SQLite("./data/sqlite/config.sqlite");
const sql_AuditLogs = new SQLite("./data/sqlite/auditLog.sqlite");
const sql_Moderation = new SQLite("./data/sqlite/moderation.sqlite");

class Set {
	// Regular
	// Config
	static botConfig(id) {
		let data;
		globalclient.setConfig = sql_Config.prepare("INSERT OR REPLACE INTO config (ConfigID, GuildID, ShardID, BotID, Lang) VALUES (@ConfigID, @GuildID, @ShardID, @BotID, @Lang);");
		data = globalclient.setConfig.run(id);
		return data;
	}
	// AuditLog
	static auditLogs(id) {
		let data;
		globalclient.setAuditLogs = sql_AuditLogs.prepare("INSERT OR REPLACE INTO auditlog (AuditLogID, GuildID, Type, Date) VALUES (@AuditLogID, @GuildID, @Type, @Date);");
		data = globalclient.setAuditLogs.run(id);
		return data;
	}
	static auditLogsMsgDel(id) {
		let data;
		globalclient.setMessageDel = sql_AuditLogs.prepare("INSERT OR REPLACE INTO messagedel (AuditLogID, GuildID, Type, Count, Date) VALUES (@AuditLogID, @GuildID, @Type, @Count, @Date);");
		data = globalclient.setMessageDel.run(id);
		return data;
	}
	// Moderation
	static moderation(id) {
		let data;
		globalclient.setModeration = sql_Moderation.prepare("INSERT OR REPLACE INTO moderation (ModerationID, GuildID, Type, Extra, Object) VALUES (@ModerationID, @GuildID, @Type, @Extra, @Object);");
		data = globalclient.setModeration.run(id);
		return data;
	}
	static captcha(id) {
		let data;
		globalclient.setModerationCaptcha = sql_Moderation.prepare("INSERT OR REPLACE INTO captcha (ModerationID, GuildID, Type, MemberID, Attempts) VALUES (@ModerationID, @GuildID, @Type, @MemberID, @Attempts);");
		data = globalclient.setModerationCaptcha.run(id);
		return data;
	}
	static NoSpam(id) {
		let data;
		globalclient.setModerationNoSpam = sql_Moderation.prepare("INSERT OR REPLACE INTO nospam (ModerationID, GuildID, Type, Extra, Object) VALUES (@ModerationID, @GuildID, @Type, @Extra, @Object);");
		data = globalclient.setModerationNoSpam.run(id);
		return data;
	}
}

exports.Set = Set;