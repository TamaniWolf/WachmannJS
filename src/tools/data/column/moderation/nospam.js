require("dotenv").config();

module.exports = () => {
	const { DB } = require("../../../functions/sqlite/prepare");
	// Config.
	const guildID = DB.moderation().prepare("SELECT count(*) FROM pragma_table_info('nospam') WHERE name = 'GuildID';").get();
	if (!guildID["count(*)"]) {
		DB.moderation().prepare("ALTER TABLE nospam ADD COLUMN GuildID VARCHAR;").run();
	}
	const type = DB.moderation().prepare("SELECT count(*) FROM pragma_table_info('nospam') WHERE name = 'Type';").get();
	if (!type["count(*)"]) {
		DB.moderation().prepare("ALTER TABLE nospam ADD COLUMN Type VARCHAR;").run();
	}
	const extra = DB.moderation().prepare("SELECT count(*) FROM pragma_table_info('nospam') WHERE name = 'Extra';").get();
	if (!extra["count(*)"]) {
		DB.moderation().prepare("ALTER TABLE nospam ADD COLUMN Extra VARCHAR;").run();
	}
	const object = DB.moderation().prepare("SELECT count(*) FROM pragma_table_info('nospam') WHERE name = 'Object';").get();
	if (!object["count(*)"]) {
		DB.moderation().prepare("ALTER TABLE nospam ADD COLUMN Object VARCHAR;").run();
	}
};
