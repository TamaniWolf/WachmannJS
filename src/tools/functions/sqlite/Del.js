/* eslint-disable prefer-const */
/* eslint-disable no-undef */
// Require SQLite and Databases
const SQLite = require("better-sqlite3");
const sql_Config = new SQLite("./data/sqlite/config.sqlite");
const sql_AuditLogs = new SQLite("./data/sqlite/auditLog.sqlite");
const sql_Moderation = new SQLite("./data/sqlite/moderation.sqlite");

class Del {
	// Regular
	// AuditLog
	static auditLogs(id) {
		let data;
		globalclient.delAuditLogs = sql_AuditLogs.prepare("DELETE FROM auditlog WHERE AuditLogID = ?");
		data = globalclient.delAuditLogs.run(id);
		return data;
	}
	static auditLogsMsgDel(id) {
		let data;
		globalclient.delMessageDel = sql_AuditLogs.prepare("DELETE FROM messagedel WHERE AuditLogID = ?");
		data = globalclient.delMessageDel.run(id);
		return data;
	}
	// Moderation
	static moderation(id) {
		let data;
		globalclient.delModeration = sql_Moderation.prepare("DELETE FROM moderation WHERE ModerationID = ?");
		data = globalclient.delModeration.run(id);
		return data;
	}
	static captcha(id) {
		let data;
		globalclient.delModerationCaptcha = sql_Moderation.prepare("DELETE FROM captcha WHERE ModerationID = ?");
		data = globalclient.delModerationCaptcha.run(id);
		return data;
	}
	static nospam(id) {
		let data;
		globalclient.delModerationNoSpam = sql_Moderation.prepare("DELETE FROM nospam WHERE ModerationID = ?");
		data = globalclient.delModerationNoSpam.run(id);
		return data;
	}
	// By Guild
	// Config By Guild
	static botConfigByGuild(id) {
		let data;
		globalclient.delConfigByGuild = sql_Config.prepare("DELETE FROM config WHERE GuildID = ?");
		data = globalclient.delConfigByGuild.run(id);
		return data;
	}
	// AuditLog By Guild
	static auditLogsByGuild(id) {
		let data;
		globalclient.delAuditLogsByGuild = sql_AuditLogs.prepare("DELETE FROM auditlog WHERE GuildID = ?");
		data = globalclient.delAuditLogsByGuild.run(id);
		return data;
	}
	static auditLogsMsgDelByGuild(id) {
		let data;
		globalclient.delMessageDelByGuild = sql_AuditLogs.prepare("DELETE FROM messagedel WHERE GuildID = ?");
		data = globalclient.delMessageDelByGuild.run(id);
		return data;
	}
	// Moderation by Guild
	static moderationByGuild(id) {
		let data;
		globalclient.delModerationByGuild = sql_Moderation.prepare("DELETE FROM moderation WHERE GuildID = ?");
		data = globalclient.delModerationByGuild.run(id);
		return data;
	}
	static captchaByGuild(id) {
		let data;
		globalclient.delModerationCaptchaByGuild = sql_Moderation.prepare("DELETE FROM captcha WHERE GuildID = ?");
		data = globalclient.delModerationCaptchaByGuild.run(id);
		return data;
	}
	static noSpamByGuild(id) {
		let data;
		globalclient.delModerationNoSpamByGuild = sql_Moderation.prepare("DELETE FROM nospam WHERE GuildID = ?");
		data = globalclient.delModerationNoSpamByGuild.run(id);
		return data;
	}
	// By Type
	// Moderation by Type
	static moderationByType(id, type) {
		let data;
		globalclient.delModerationByType = sql_Moderation.prepare("DELETE FROM moderation WHERE ModerationID = ? AND Type = ?");
		data = globalclient.delModerationByType.run(id, type);
		return data;
	}
	static captchaByType(id, type) {
		let data;
		globalclient.delModerationCaptchByType = sql_Moderation.prepare("DELETE FROM captcha WHERE ModerationID = ? AND Type = ?");
		data = globalclient.delModerationCaptchByType.run(id, type);
		return data;
	}
	static moderationNoSpamByType(id, type) {
		let data;
		globalclient.delModerationNoSpamByType = sql_Moderation.prepare("DELETE FROM nospam WHERE ModerationID = ? AND Type = ?");
		data = globalclient.delModerationNoSpamByType.run(id, type);
		return data;
	}
}

exports.Del = Del;