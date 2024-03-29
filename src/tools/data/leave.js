require("dotenv").config();

module.exports = (guild) => {
	// SQLite
	const { Del } = require("../functions/sqlite/prepare");
	const getClientGuildId = guild.id;
	if (getClientGuildId === "100000000000000000") return;
	// Config
	Del.botConfig(getClientGuildId);
	// Moderation
	Del.auditLogsByGuild(getClientGuildId);
	Del.auditLogsMsgDelByGuild(getClientGuildId);
	Del.moderationByGuild(getClientGuildId);
	Del.captchaByGuild(getClientGuildId);
	Del.noSpamByGuild(getClientGuildId);
};
