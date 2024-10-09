// Require SQLite and Databases
const { SQL } = require("./SQL.js");

class Del {
	// Costum Del's

	/**
	 * Del a set of Data from an Database with the given parameters value.
	 *
	 * @remarks
	 * You will need to created the SQL String yourself. better-sqlite3 is used here.
	 * @param {String} database - The Database to be used
	 * @param {String} sqlString - The SQL String to be used
	 * @param {*} value - The Value's to be search for
	 * @returns {SQLite.RunResult | undefined} Database record
	 */
	static costumDel(database, sqlString, value) {
		if (database === "Config") return SQL.config().prepare(sqlString).run(value);
		if (database === "AuditLogs") return SQL.auditLogs().prepare(sqlString).run(value);
		if (database === "Moderation") return SQL.moderation().prepare(sqlString).run(value);
	}

	/**
	 * Del one set of Data from an Database with the given parameters value.
	 *
	 * @param {String} database - The Database to be used
	 * @param {String} table - The Database Table to search in
	 * @param {String} column - The Column to be search with
	 * @param {*} value - The Value to be search for
	 * @returns {SQLite.RunResult | undefined} Database record
	 */
	static costumDelOne(database, table, column, value) {
		const sqlString = `DELETE FROM ${table} WHERE ${column} = ?`;
		if (database === "Config") return SQL.config().prepare(sqlString).run(value);
		if (database === "AuditLogs") return SQL.auditLogs().prepare(sqlString).run(value);
		if (database === "Moderation") return SQL.moderation().prepare(sqlString).run(value);
	}

	/**
	 * Del all set's of Data from an Database with the given parameters value.
	 *
	 * @param {String} database - The Database to be used
	 * @param {String} table - The Database Table to search in
	 * @param {String} column - The Column to be search with
	 * @param {*} value - The Value to be search for
	 * @returns {SQLite.RunResult | undefined} Database record
	 */
	static costumDelAll(database, table, column, value) {
		const sqlString = `DELETE * FROM ${table} WHERE ${column} = ?`;
		if (database === "Config") return SQL.config().prepare(sqlString).all(value);
		if (database === "AuditLogs") return SQL.auditLogs().prepare(sqlString).all(value);
		if (database === "Moderation") return SQL.moderation().prepare(sqlString).all(value);
	}

	// Config
	// By ID

	/**
	 * Del the first matching Dataset of a Table in Database Config by the given ID.
	 *
	 * @remarks
	 * The Config name is equel to the Databases table name.
	 * @param {String} table - The Name of the config
	 * @param {String} id - The Unique Entry ID to be search for
	 * @returns {SQLite.RunResult | undefined} Database record
	 */
	static configByID(table, id) {
		return SQL.config().prepare(`DELETE FROM ${table} WHERE ConfigID = ?`).run(id);
	}

	// All

	/**
	 * Del all matching Dataset of a Table in Database Config by the given GuildID.
	 *
	 * @remarks
	 * The Config name is equel to the Databases table name.
	 * @param {String} table - The Name of the config
	 * @param {String|Number} guildId - The GuildID to be search for
	 * @returns {SQLite.RunResult | undefined} Database record
	 */
	static configAll(table, guildId) {
		return SQL.config().prepare(`DELETE FROM ${table} WHERE GuildID = ?`).all(guildId);
	}

	// AuditLogs
	// By ID

	/**
	 * Del the first matching Dataset of a Table in Database AuditLogs by the given ID.
	 *
	 * @remarks
	 * The AuditLogs name is equel to the Databases table name.
	 * @param {String} table - The Name of the auditLogs
	 * @param {String} id - The Unique Entry ID to be search for
	 * @returns {SQLite.RunResult | undefined} Database record
	 */
	static auditLogsByID(table, id) {
		return SQL.auditLogs().prepare(`DELETE FROM ${table} WHERE AuditLogID = ?`).run(id);
	}

	// All

	/**
	 * Del the first matching Dataset of a Table in Database AuditLogs by the given Type.
	 *
	 * @remarks
	 * The AuditLogs name is equel to the Databases table name.
	 * @param {String} table - The Name of the auditLogs
	 * @param {String|Number} guildId - The GuildID to be search for
	 * @returns {SQLite.RunResult | undefined} Database record
	 */
	static auditLogsAll(table, guildId) {
		return SQL.auditLogs().prepare(`DELETE FROM ${table} WHERE GuildID = ?`).run(guildId);
	}

	// Moderation
	// By ID

	/**
	 * Del the first matching Dataset of a Table in Database Moderation by the given ID.
	 *
	 * @remarks
	 * The Moderation name is equel to the Databases table name.
	 * @param {String} table - The Name of the moderation
	 * @param {String} id - The Unique Entry ID to be search for
	 * @returns {SQLite.RunResult | undefined} Database record
	 */
	static moderationByID(table, id) {
		return SQL.moderation().prepare(`DELETE FROM ${table} WHERE ModerationID = ?`).run(id);
	}

	// All

	/**
	 * Del all matching Dataset of a Table in Database Moderation by the given GuildID.
	 *
	 * @remarks
	 * The Moderation name is equel to the Databases table name.
	 * @param {String} table - The Name of the moderation
	 * @param {String|Number} guildId - The GuildID to be search for
	 * @returns {SQLite.RunResult | undefined} Database record
	 */
	static moderationAll(table, guildId) {
		return SQL.moderation().prepare(`DELETE FROM ${table} WHERE GuildID = ?`).all(guildId);
	}

	// By ID and Type

	/**
	 * Del the matching Dataset of a Table in Database Moderation by the given ID.
	 *
	 * @remarks
	 * The Moderation name is equel to the Databases table name.
	 * @param {String} table - The Name of the moderation
	 * @param {String} id - The Unique Entry ID to be search for
	 * @param {String} type The Type of the record
	 * @returns {SQLite.RunResult | undefined} Database record
	 */
	static moderationByIDAndType(table, id, type) {
		return SQL.moderation().prepare(`DELETE FROM ${table} WHERE ModerationID = ? AND Type = ?`).run(id, type);
	}
}

exports.Del = Del;