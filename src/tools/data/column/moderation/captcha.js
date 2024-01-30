require("dotenv").config();

module.exports = () => {
	const { DB } = require("../../../functions/sqlite/prepare");
	// Config.
	const guildID = DB.moderation().prepare("SELECT count(*) FROM pragma_table_info('captcha') WHERE name = 'GuildID';").get();
	if (!guildID["count(*)"]) {
		DB.moderation().prepare("ALTER TABLE captcha ADD COLUMN GuildID VARCHAR;").run();
	}
	const type = DB.moderation().prepare("SELECT count(*) FROM pragma_table_info('captcha') WHERE name = 'Type';").get();
	if (!type["count(*)"]) {
		DB.moderation().prepare("ALTER TABLE captcha ADD COLUMN Type VARCHAR;").run();
	}
	const memberID = DB.moderation().prepare("SELECT count(*) FROM pragma_table_info('captcha') WHERE name = 'Extra';").get();
	if (!memberID["count(*)"]) {
		DB.moderation().prepare("ALTER TABLE captcha ADD COLUMN Extra VARCHAR;").run();
	}
	const attempts = DB.moderation().prepare("SELECT count(*) FROM pragma_table_info('captcha') WHERE name = 'Object';").get();
	if (!attempts["count(*)"]) {
		DB.moderation().prepare("ALTER TABLE captcha ADD COLUMN Object VARCHAR;").run();
	}
};
