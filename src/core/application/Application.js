
const path = require('node:path');
const fs = require('node:fs');
class Application {

    static stop() {
		process.exit(0);
	}

    static init() {
        // Array of Packages/Dependencies.
        const packArray = fs.readdirSync('./node_modules').filter(dir => !dir.startsWith('.'));
        // For loop throu the array.
        for (const pack of packArray) {
            // Checks if file exists and requires it if true.
            if (fs.existsSync(`./node_modules/${pack}`) === true) {
                // nothing
            } else {
                // If Above is false "emit" an self written Fatal error that some Dependencies are still not installed.
                process.exitCode = 5;
                let newPath = path.resolve('main.js');
                let newDirPath = path.resolve(`node_modules/${pack}`);
                return process.stderr.write(`${newPath}\n\n\nFATAL ERROR: Dependencies not installed - Missing '${pack}': \nENOENT: no such file or directory, open '${pack}'.\n  errno: -2\n  code: 'ENOENT'\n  syscall: 'open'\n  path: '${newDirPath}\\'\n\n`).then(process.exit());
            };
        };
    }

    static database() {
        // Database
        if (fs.existsSync('./data/sqlite/auditLog.sqlite')) {
            // Tables
            require('../../modules/database/create/tables.js');
        } else {
            require('../../modules/database/create/start.js')();
        };
    }

    static start() {
        require('./Wachmann.js');
    }
};

exports.Application = Application;