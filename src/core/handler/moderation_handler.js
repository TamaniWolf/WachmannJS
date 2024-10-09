/* eslint-disable no-console */
const { readdirSync } = require("fs");
const { DateTime } = require("luxon");
const timeFormat = "LL" + "/" + "dd" + "/" + "yyyy" + "-" + "h" + ":" + "mm" + ":" + "ss" + "-" + "a";

module.exports = (globalclient) => {
	const enabledModulesSplit = process.env.ENABLE_MODULES.split(/,+/);
	const enabledModulesTrim = enabledModulesSplit.map(obj => { return obj.trim(); });
	const modulesEnabled = enabledModulesTrim.toString();
	if (modulesEnabled !== "") {
		// Filtering out .js files in to a string.
		const mod_files = readdirSync("./src/modules/moderation").filter(files => files.endsWith(".js") && !files.startsWith("#"));
		// Grabs files out of the string, one by one (for loop).
		for (const file of mod_files) {
			const mod = require(`../../modules/moderation/${file}`);
			// Calls files as an event.
			const enabledModules = enabledModulesTrim.filter(m => m === mod.name).toString();
			if (mod == null || mod.once == null || mod.name !== enabledModules) continue;
			if (mod.once === true) globalclient.once(mod.event, (...args) => mod.execute(...args));
			if (mod.once === false) globalclient.on(mod.event, (...args) => mod.execute(...args));
		}
		console.log(`[${DateTime.utc().toFormat(timeFormat)}][Discord] Moderation Handler loaded`);
	}
	if (modulesEnabled === "") console.log(`[${DateTime.utc().toFormat(timeFormat)}][Discord] Moderation Handler Disabled`);
};