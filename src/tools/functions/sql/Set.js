// Require SQLite and Databases
const { SQL } = require("./SQL.js");

class Set {
	// Costum Set's

	/**
	 * Set a set of Data from an Database by the given parameters value.
	 *
	 * @remarks
	 * You will need to created the SQL String yourself. better-sqlite3 is used here.
	 * @param {String} database - The Database to be used
	 * @param {String} sqlString - The SQL String to be used
	 * @param {String|Number|Boolean|Array} value - The Value's to be search for
	 * @returns {SQLite.RunResult | undefined} Database record
	 */
	static costumSet(database, sqlString, value) {
		if (database === "Config") return SQL.config().prepare(sqlString).run(value);
		if (database === "AuditLogs") return SQL.auditLogs().prepare(sqlString).run(value);
		if (database === "Moderation") return SQL.moderation().prepare(sqlString).run(value);
	}

	/**
	 * Set one set of Data from an Database by the given parameters value.
	 *
	 * @param {String} database - The Database to be used
	 * @param {String} table - The Database Table to search in
	 * @param {String} column - The Column to be search with
	 * @param {String|Number|Boolean|Array} value - The Value to be search for
	 * @returns {SQLite.RunResult | undefined} Database record
	 */
	static costumSetOne(database, table, column, value) {
		const sqlString = `SELECT * FROM ${table} WHERE ${column} = ?`;
		if (database === "Config") return SQL.config().prepare(sqlString).run(value);
		if (database === "AuditLogs") return SQL.auditLogs().prepare(sqlString).run(value);
		if (database === "Moderation") return SQL.moderation().prepare(sqlString).run(value);
	}

	// Config
	// By Data

	/**
	 * Set the provided Dataset in a Table in Database Config.
	 *
	 * @remarks
	 * The Config name is equel to the Databases table.
	 * @param {String} table - The Name of the config
	 * @param {Object} data - The Data to be inserted
	 * @returns {SQLite.RunResult | undefined} Database record
	 */
	static configByData(table, data) {
		let columns = "(DataID, GuildID, ShardID) VALUES (@DataID, @GuildID, @ShardID)";
		if (table === "discord_bot") columns = "(ConfigID, GuildID, ShardID, BotID, Lang) VALUES (@ConfigID, @GuildID, @ShardID, @BotID, @Lang)";
		return SQL.config().prepare(`INSERT OR REPLACE INTO ${table} ${columns};`).run(data);
	}

	// AuditLogs
	// By ID

	/**
	 * Set the first matching Dataset of a Table in Database AuditLogs by the given ID.
	 *
	 * @remarks
	 * The AuditLogs name is equel to the Databases table name.
	 * @param {String} table - The Name of the auditLogs
	 * @param {Object} data - The Data to be inserted
	 * @returns {SQLite.RunResult | undefined} Database record
	 */
	static auditLogsByData(table, data) {
		let columns = "(DataID, GuildID, ShardID) VALUES (@DataID, @GuildID, @ShardID)";
		if (table === "message_delete") columns = "(AuditLogID, GuildID, ShardID, Type, Count, Date) VALUES (@AuditLogID, @GuildID, @ShardID, @Type, @Count, @Date)";
		if (table === "auditlog") columns = "(AuditLogID, GuildID, ShardID, Type, Date) VALUES (@AuditLogID, @GuildID, @ShardID, @Type, @Date)";
		return SQL.auditLogs().prepare(`INSERT OR REPLACE INTO ${table} ${columns};`).run(data);
	}

	// Moderation
	// By ID

	/**
	 * Set the first matching Dataset of a Table in Database Moderation by the given ID.
	 *
	 * @remarks
	 * The Moderation name is equel to the Databases table name.
	 * @param {String} table - The Name of the moderation
	 * @param {Object} data - The Data to be inserted
	 * @returns {SQLite.RunResult | undefined} Database record
	 */
	static moderationByData(table, data) {
		let columns = "(DataID, GuildID, ShardID) VALUES (@DataID, @GuildID, @ShardID)";
		if (table === "moderation") columns = "(ModerationID, GuildID, ShardID, Type, Extra, Object) VALUES (@ModerationID, @GuildID, @ShardID, @Type, @Extra, @Object)";
		if (table === "captcha") columns = "(ModerationID, GuildID, ShardID, Type, MemberID, Attempts, Object) VALUES (@ModerationID, @GuildID, @ShardID, @Type, @MemberID, @Attempts, @Object)";
		if (table === "nospam") columns = "(ModerationID, GuildID, ShardID, Type, Extra, Object) VALUES (@ModerationID, @GuildID, @ShardID, @Type, @Extra, @Object)";
		return SQL.moderation().prepare(`INSERT OR REPLACE INTO ${table} ${columns};`).run(data);
	}

	// By ID and Type

	/**
	 * Set the matching Dataset of a Table in Database Moderation by the given ID.
	 *
	 * @remarks
	 * The Moderation name is equel to the Databases table name.
	 * @param {String} table - The Name of the moderation
	 * @param {Object} data - The Data to be inserted
	 * @returns {SQLite.RunResult | undefined} Database record
	 */
	static moderationByIDAndType(table, data) {
		let columns = "(DataID, GuildID, ShardID) VALUES (@DataID, @GuildID, @ShardID)";
		if (table === "moderation") columns = "(ModerationID, GuildID, ShardID, Type, Extra, Object) VALUES (@ModerationID, @GuildID, @ShardID, @Type, @Extra, @Object)";
		if (table === "captcha") columns = "(ModerationID, GuildID, ShardID, Type, MemberID, Attempts, Object) VALUES (@ModerationID, @GuildID, @ShardID, @Type, @MemberID, @Attempts, @Object)";
		if (table === "nospam") columns = "(ModerationID, GuildID, ShardID, Type, Extra, Object) VALUES (@ModerationID, @GuildID, @ShardID, @Type, @Extra, @Object)";
		return SQL.moderation().prepare(`INSERT OR REPLACE INTO ${table} ${columns};`).run(data);
	}
}

exports.Set = Set;