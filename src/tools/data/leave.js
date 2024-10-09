require("dotenv").config();

module.exports = (guild) => {
	// SQLite
	const { Del } = require("../functions/sql/db.js");
	const getGuildId = guild.id;
	if (getGuildId === "100000000000000000") return;
	// CONFIG
	// Config
	Del.configAll("discord_bot", getGuildId);
	// MODERATION
	Del.auditLogsAll("auditlog", getGuildId);
	Del.auditLogsAll("message_delete", getGuildId);
	Del.moderationAll("moderation", getGuildId);
	Del.moderationAll("captcha", getGuildId);
	Del.moderationAll("nospam", getGuildId);
};
