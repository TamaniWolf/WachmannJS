// Require SQLite and Databases
const { existsSync, mkdirSync } = require("node:fs");
const SQLite = require("better-sqlite3");
const { SQL } = require("./SQL.js");

class Create {
	/**
	 * Create a Database with the given parameters.
	 *
	 * @param {String} dbFilename The Filename of the Database
	 * @returns {void} Nothing
	 */
	static database(dbFilename) {
		if (!existsSync("./data/sqlite")) mkdirSync("./data/sqlite");
		if (!existsSync(`./data/sqlite/${dbFilename}.sqlite`)) {
			const newDB = new SQLite(`./data/sqlite/${dbFilename}.sqlite`);
			newDB.close();
		}
	}

	/**
	 * Create a Table with the given parameters.
	 *
	 * @param {*} database - The Database to be used
	 * @param {String} tableName - The Table name to be used
	 * @param {String} tableID - The Table ID (Primary Key) to be used
	 * @remark
	 * tableID is the first Column in the Table, the Primary Key
	 * @returns {void} Nothing
	 */
	static table(database, tableName, tableID) {
		const dataTable = database.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = '${tableName}';`).get();
		if (!dataTable["count(*)"]) {
			// If the table isn't there, create it and setup the database correctly.
			database.prepare(`CREATE TABLE ${tableName} (${tableID} VARCHAR PRIMARY KEY);`).run();
			// Ensure that the "id" row is always unique and indexed.
			database.prepare(`CREATE UNIQUE INDEX idx_${tableName}_id ON ${tableName} (${tableID});`).run();
			database.pragma("synchronous = 1");
			database.pragma("journal_mode = wal");
		} else if (dataTable["count(*)"]) {
			return;
		}
	}

	/**
	 * Create a Table with columns or add columns with the given parameters.
	 *
	 * @param {*} database - The Database to be used
	 * @param {String} table - The Table name to be used/created "table"
	 * @param {String} id - The Unique Identifier "TableID" and first column of this table
	 * @param {String} columns - The Column's to be created "ColumnName TEXT, etc."
	 * @remark
	 * "id" is already the first column, so you don't need to think about that.
	 * @returns {void} Nothing
	 */
	static tableWithColums(database, table, id, columns) {
		// setTimeout(function () {
		let sqlDB = "";
		if (database === "Config") sqlDB = SQL.config();
		if (database === "AuditLogs") sqlDB = SQL.auditLogs();
		if (database === "Moderation") sqlDB = SQL.moderation();
		if (sqlDB === "") return;
		const dataTable = sqlDB.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = '${table}';`).get();
		if (!dataTable["count(*)"]) {
			// If the table isn't there, create it and setup the database correctly.
			const allColumns = `${id} VARCHAR PRIMARY KEY, ${columns}`;
			sqlDB.prepare(`CREATE TABLE ${table} (${allColumns});`).run();
			// Ensure that the "id" row is always unique and indexed.
			sqlDB.prepare(`CREATE UNIQUE INDEX idx_${table}_id ON ${table} (${id});`).run();
			sqlDB.pragma("synchronous = 1");
			sqlDB.pragma("journal_mode = wal");
		} else if (dataTable["count(*)"]) {
			// require(`./columns/${database}/${table}`)();
			if (database !== "") this.privatTableColumns(sqlDB, table, columns);
			if (database === "") return;
		}
		// }, 500);
	}

	/**
	 * Create or Add the missiong Columns to the Tables of Database Config
	 *
	 * @param {*} database - The Database to be used
	 * @param {String} table - The Table name to be used
	 * @param {String} columns - The Column's to be created "ColumnName TEXT, etc."
	 * @returns {void} Nothing
	 * @private
	 */
	static privatTableColumns(database, table, columns) {
		const columnArray = columns.split(", ");
		columnArray.forEach(column => {
			const columnParam = column.split(" ");
			const dataColumn = database.prepare(`SELECT count(*) FROM pragma_table_info('${table}') WHERE name = '${columnParam[0]}';`).get();
			if (!dataColumn["count(*)"]) {
				database.prepare(`ALTER TABLE ${table} ADD COLUMN ${column};`).run();
			}
		});
	}

	/**
	 * Create a Column with the given parameters.
	 *
	 * @param {*} database - The Database to be used
	 * @param {String} table - The Table to be used
	 * @param {String} columnName - The Column name to be used
	 * @param {String} columnType - The Column type to be used
	 * @returns {void} Nothing
	 */
	static column(database, table, columnName, columnType) {
		const dataColumn = database.prepare(`SELECT count(*) FROM pragma_table_info('${table}') WHERE name = '${columnName[0]}';`).get();
		if (!dataColumn["count(*)"]) {
			database.prepare(`ALTER TABLE ${table} ADD COLUMN ${columnName} ${columnType};`).run();
		}
	}
}

exports.Create = Create;
