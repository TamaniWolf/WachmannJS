require("dotenv").config();

module.exports = () => {
	const { DB } = require("../../../functions/sqlite/prepare");
	// Config.
	const guildID = DB.moderation().prepare("SELECT count(*) FROM pragma_table_info('moderation') WHERE name = 'GuildID';").get();
	if (!guildID["count(*)"]) {
		DB.moderation().prepare("ALTER TABLE moderation ADD COLUMN GuildID VARCHAR;").run();
	}
	const type = DB.moderation().prepare("SELECT count(*) FROM pragma_table_info('moderation') WHERE name = 'Type';").get();
	if (!type["count(*)"]) {
		DB.moderation().prepare("ALTER TABLE moderation ADD COLUMN Type VARCHAR;").run();
	}
	const extra = DB.moderation().prepare("SELECT count(*) FROM pragma_table_info('moderation') WHERE name = 'Extra';").get();
	if (!extra["count(*)"]) {
		DB.moderation().prepare("ALTER TABLE moderation ADD COLUMN Extra VARCHAR;").run();
	}
};
