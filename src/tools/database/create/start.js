const fs = require("fs");
require("dotenv").config();

module.exports = () => {
	if (!fs.existsSync("./data/sqlite")) {
		fs.mkdirSync("./data/sqlite");
	}
	if (fs.existsSync("./data/sqlite/auditLog.sqlite")) {
		return;
	} else {
		// Tables
		const tablesJS = require("./tables.js")();
		tablesJS;
	}
};
