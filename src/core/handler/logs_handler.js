/* eslint-disable no-console */
const { readdirSync } = require("fs");
const { DateTime } = require("luxon");
const timeFormat = "LL" + "/" + "dd" + "/" + "yyyy" + "-" + "h" + ":" + "mm" + ":" + "ss" + "-" + "a";

module.exports = (globalclient) => {
	// Grabs folders and files out of the strings, one by one (for loop).
	const load_dir = (mainDirs) => {
		if (mainDirs.startsWith("#")) return;
		const log_files = readdirSync(`./src/modules/logs/${mainDirs}`).filter(files => files.endsWith(".js") && !files.startsWith("#"));
		for (const file of log_files) {
			const log = require(`../../modules/logs/${mainDirs}/${file}`);
			// Calls files as an event once or on.
			if (log == null || log.once == null) continue;
			if (log.once === true) globalclient.once(log.name, (...args) => log.execute(...args));
			if (log.once === false) globalclient.on(log.name, (...args) => log.execute(...args));
		}
	};
	const mainCmdDirs = readdirSync("./src/modules/logs");
	mainCmdDirs.forEach(mainDir => load_dir(mainDir));
	console.log("[" + DateTime.utc().toFormat(timeFormat) + "][Discord]", "Log Heandler loaded");
};