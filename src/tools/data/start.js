const { existsSync, mkdirSync } = require("fs");
require("dotenv").config();

module.exports = () => {
	if (!existsSync("./data/sqlite")) {
		mkdirSync("./data/sqlite");
	}
	if (existsSync("./data/sqlite/auditLog.sqlite") && existsSync("./data/sqlite/config.sqlite")
	&& existsSync("./data/sqlite/moderation.sqlite")) {
		return;
	}
	if (!existsSync("./data/sqlite/auditLog.sqlite") || !existsSync("./data/sqlite/config.sqlite")
	|| !existsSync("./data/sqlite/moderation.sqlite")) {
		// Tables
		const tablesJS = require("./tables.js")();
		tablesJS;
	}
};
