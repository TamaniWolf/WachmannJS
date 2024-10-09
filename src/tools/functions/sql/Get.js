// Require SQLite and Databases
const { SQL } = require("./SQL.js");

class Get {
	// Costum Get's

	/**
	 * Get a set of Data from an Database by the given parameters value.
	 *
	 * @remarks
	 * You will need to created the SQL String yourself. better-sqlite3 is used here.
	 * @param {String} database - The Database to be used
	 * @param {String} sqlString - The SQL String to be used
	 * @param {String|Number|Boolean|Array} value - The Value's to be search for
	 * @returns {Object|undefined} Database Record
	 */
	static costumGet(database, sqlString, value) {
		if (database === "Config") return SQL.config().prepare(sqlString).get(value);
		if (database === "AuditLogs") return SQL.auditLogs().prepare(sqlString).get(value);
		if (database === "Moderation") return SQL.moderation().prepare(sqlString).get(value);
	}

	/**
	 * Get one set of Data from an Database by the given parameters value.
	 *
	 * @param {String} database - The Database to be used
	 * @param {String} table - The Database Table to search in
	 * @param {String} column - The Column to be search with
	 * @param {String|Number|Boolean|Array} value - The Value to be search for
	 * @returns {Object|undefined} Database Record
	 */
	static costumGetOne(database, table, column, value) {
		const sqlString = `SELECT * FROM ${table} WHERE ${column} = ?`;
		if (database === "Config") return SQL.config().prepare(sqlString).get(value);
		if (database === "AuditLogs") return SQL.auditLogs().prepare(sqlString).get(value);
		if (database === "Moderation") return SQL.moderation().prepare(sqlString).get(value);
	}

	/**
	 * Get all set's of Data from an Database by the given parameters value.
	 *
	 * @param {String} database - The Database to be used
	 * @param {String} table - The Database Table to search in
	 * @param {String} column - The Column to be search with
	 * @param {String|Number|Boolean|Array} value - The Value to be search for
	 * @returns {Object|undefined} Database Record
	 */
	static costumGetAll(database, table, column, value) {
		const sqlString = `SELECT * FROM ${table} WHERE ${column} = ?`;
		if (database === "Config") return SQL.config().prepare(sqlString).all(value);
		if (database === "AuditLogs") return SQL.auditLogs().prepare(sqlString).all(value);
		if (database === "Moderation") return SQL.moderation().prepare(sqlString).all(value);
	}

	// Config
	// By ID

	/**
	 * Get the first matching Dataset of a Table in Database Config by the given ID.
	 *
	 * @remarks
	 * The Config name is equel to the Databases table name.
	 * @param {String} table - The Name of the config
	 * @param {String} id - The Unique Entry ID to be search for
	 * @returns {Object|undefined} Database Record
	 */
	static configByID(table, id) {
		return SQL.config().prepare(`SELECT * FROM ${table} WHERE ConfigID = ?`).get(id);
	}

	// All

	/**
	 * Get all matching Dataset of a Table in Database Config by the given GuildID.
	 *
	 * @remarks
	 * The Config name is equel to the Databases table name.
	 * @param {String} table - The Name of the config
	 * @param {String|Number} guildId - The GuildID to be search for
	 * @returns {Object|undefined} Database Record
	 */
	static configAll(table, guildId) {
		return SQL.config().prepare(`SELECT * FROM ${table} WHERE GuildID = ?`).all(guildId);
	}

	// AuditLogs
	// By ID

	/**
	 * Get the first matching Dataset of a Table in Database AuditLogs by the given ID.
	 *
	 * @remarks
	 * The AuditLogs name is equel to the Databases table name.
	 * @param {String} table - The Name of the auditLogs
	 * @param {String} id - The Unique Entry ID to be search for
	 * @returns {Object|undefined} Database Record
	 */
	static auditLogsByID(table, id) {
		return SQL.auditLogs().prepare(`SELECT * FROM ${table} WHERE AuditLogID = ?`).get(id);
	}

	// All

	/**
	 * Get the first matching Dataset of a Table in Database AuditLogs by the given Type.
	 *
	 * @remarks
	 * The AuditLogs name is equel to the Databases table name.
	 * @param {String} table - The Name of the auditLogs
	 * @param {String} type - The Type to be search for
	 * @returns {Object|undefined} Database Record
	 */
	static auditLogsAllByType(table, type) {
		return SQL.auditLogs().prepare(`SELECT * FROM ${table} WHERE Type = ? ORDER BY Date ASC LIMIT 5`).all(type);
	}

	// Moderation
	// By ID

	/**
	 * Get the first matching Dataset of a Table in Database Moderation by the given ID.
	 *
	 * @remarks
	 * The Moderation name is equel to the Databases table name.
	 * @param {String} table - The Name of the moderation
	 * @param {String} id - The Unique Entry ID to be search for
	 * @returns {Object|undefined} Database Record
	 */
	static moderationByID(table, id) {
		return SQL.moderation().prepare(`SELECT * FROM ${table} WHERE ModerationID = ?`).get(id);
	}

	// All

	/**
	 * Get all matching Dataset of a Table in Database Moderation by the given GuildID.
	 *
	 * @remarks
	 * The Moderation name is equel to the Databases table name.
	 * @param {String} table - The Name of the moderation
	 * @param {String|Number} guildId - The GuildID to be search for
	 * @returns {Object|undefined} Database Record
	 */
	static moderationAll(table, guildId) {
		return SQL.moderation().prepare(`SELECT * FROM ${table} WHERE GuildID = ?`).all(guildId);
	}

	// By ID and Type

	/**
	 * Get the matching Dataset of a Table in Database Moderation by the given ID.
	 *
	 * @remarks
	 * The Moderation name is equel to the Databases table name.
	 * @param {String} table - The Name of the moderation
	 * @param {String} id - The Unique Entry ID to be search for
	 * @returns {Object|undefined} Database Record
	 */
	static moderationByIDAndType(table, id, type) {
		return SQL.moderation().prepare(`SELECT * FROM ${table} WHERE ModerationID = ? AND Type = ?`).get(id, type);
	}
}

exports.Get = Get;