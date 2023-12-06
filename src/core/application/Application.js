/* eslint-disable no-console */
const path = require("node:path");
const { existsSync } = require("node:fs");

class Application {

	static stop(signal) {
		const date = new Date;
		if (signal === "SIGINT") { console.log(`[${date.toUTCString()}]\n > ▪ ▪ ▪  SIGINT Exit 0  ▪ ▪ ▪ < `); process.exit(0); }
		if (signal === "SIGTERM") { console.log(`[${date.toUTCString()}]\n > ▪ ▪ ▪  SIGTERM Exit 0  ▪ ▪ ▪ < `); process.exit(0); }
		if (signal === "exit") { console.log(`[${date.toUTCString()}]\n > ▪ ▪ ▪  exit Exit 0  ▪ ▪ ▪ < `); process.exit(0); }
		// eslint-disable-next-line no-undef
		if (signal === "STOP") globalclient.destroy().then(console.log(`[${date.toUTCString()}]\n > ▪ ▪ ▪  Shutdown  ▪ ▪ ▪ < `));
	}

	static init() {
		// Array of Packages/Dependencies.
		const packJSON = require("../../../config/application/config.json");
		const packArray = packJSON.packages;
		const newPath = path.resolve("main.js");
		let pack = "%s";
		let newDirPath = "%s";
		// Loops throu the array.
		packArray.forEach(obj => {
			if (!existsSync(`./node_modules/${obj}`)) {
				pack += `%e${obj}`;
				const dirPath = path.resolve(`node_modules/${obj}`);
				newDirPath += `%e'${dirPath}\\'`;
			}
		});
		if (pack !== "%s" || newDirPath !== "%s") {
			pack = pack.replace(/%s%e/gi, "");
			pack = pack.replace(/%e/gi, ", ");
			newDirPath = newDirPath.replace(/%s%e/gi, "");
			newDirPath = newDirPath.replace(/%e/gi, ",\n	");
			process.exitCode = 5;
			return process.stderr.write(`${newPath}\n\n\nFATAL ERROR: Dependencies not installed - Missing '${pack}': ` +
				`\nENOENT: no such files or directorys, open '${pack}'.` +
				"\n  errno: -2" +
				"\n  code: 'ENOENT'" +
				"\n  syscall: 'open'" +
				`\n  path: ${newDirPath}` +
				"\n" +
				"\n")
				.then(process.exit());
		}
	}

	static database() {
		if (existsSync("./data/sqlite/auditLog.sqlite") && existsSync("./data/sqlite/config.sqlite")
		&& existsSync("./data/sqlite/moderation.sqlite")) {
			require("../../tools/data/tables.js")();
		}
		if (!existsSync("./data/sqlite/auditLog.sqlite") || !existsSync("./data/sqlite/config.sqlite")
		|| !existsSync("./data/sqlite/moderation.sqlite")) {
			require("../../tools/data/start.js")();
		}
	}

	static start() {
		require("./Wachmann.js");
	}

	static colors() {
		const colors = {
			logEmbedColor: {
				ban: "DarkRed",
				unban: "DarkGreen",
				create: "Green",
				update: "Yellow",
				delete: "Red",
				guildupdate: "Orange"
			}
		};
		return colors;
	}
}

exports.Application = Application;