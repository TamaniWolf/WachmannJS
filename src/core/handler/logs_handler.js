/* eslint-disable no-console */
const { readdirSync } = require("fs");
const { DateTime } = require("luxon");
const timeFormat = "LL" + "/" + "dd" + "/" + "yyyy" + "-" + "h" + ":" + "mm" + ":" + "ss" + "-" + "a";

module.exports = (globalclient) => {
	const enabledModulesSplit = process.env.ENABLE_MODULES.split(/,+/);
	const enabledModulesTrim = enabledModulesSplit.map(obj => {return obj.trim();});
	const enabledModules = enabledModulesTrim.filter(m => m === "logs").toString();
	if (enabledModules !== "") {
		// Filtering out .js files in to a string.
		const logs_files = readdirSync("./src/modules/logs").filter(file => file.endsWith(".js"));
		// Grabs files out of the string, one by one (for loop).
		for (const file of logs_files) {
			const log = require(`../../modules/logs/${file}`);
			// Calls files as an event.
			if (log == null || log.once == null) continue;
			if (log.once === true) globalclient.once(log.name, (...args) => log.execute(...args));
			if (log.once === false) globalclient.on(log.name, (...args) => log.execute(...args));
		}
		console.log(`[${DateTime.utc().toFormat(timeFormat)}][Discord] Logs Heandler loaded`);
	}
	if (enabledModules === "") console.log(`[${DateTime.utc().toFormat(timeFormat)}][Discord] Logs Heandler Disabled`);
};