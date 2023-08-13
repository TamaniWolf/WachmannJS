
const timeFormat = 'LL'+'/'+'dd'+'/'+'yyyy'+'-'+'h'+':'+'mm'+':'+'ss'+'-'+'a';
const { DateTime } = require('luxon');
require('dotenv').config();

module.exports = () => {
    const { DB } = require('../../functions/sqlite/prepare');
    //
    // MODERATION
    // AuditLog
    // Check if the table auditlog exists.
    const tableAuditLog = DB.auditLogs().prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'auditlog';").get();
    if (!tableAuditLog['count(*)']) {
        // If the table isn't there, create it and setup the database correctly.
        DB.auditLogs().prepare("CREATE TABLE auditlog (AuditLogID VARCHAR PRIMARY KEY, GuildID VARCHAR, Type VARCHAR, Date VARCHAR);").run();
        // Ensure that the "id" row is always unique and indexed.
        DB.auditLogs().prepare("CREATE UNIQUE INDEX idx_auditlog_id ON auditlog (AuditLogID);").run();
        DB.auditLogs().pragma("synchronous = 1");
        DB.auditLogs().pragma("journal_mode = wal");
    } else if (tableAuditLog['count(*)']) {
        require('./column/auditLog/auditlog')();
    };
    // Check if the table msgdel exists.
    const tableMsgDel = DB.auditLogs().prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'messagedel';").get();
    if (!tableMsgDel['count(*)']) {
        // If the table isn't there, create it and setup the database correctly.
        DB.auditLogs().prepare("CREATE TABLE messagedel (AuditLogID VARCHAR PRIMARY KEY, GuildID VARCHAR, Type VARCHAR, Count VARCHAR, Date VARCHAR);").run();
        // Ensure that the "id" row is always unique and indexed.
        DB.auditLogs().prepare("CREATE UNIQUE INDEX idx_messagedel_id ON messagedel (AuditLogID);").run();
        DB.auditLogs().pragma("synchronous = 1");
        DB.auditLogs().pragma("journal_mode = wal");
    } else if (tableMsgDel['count(*)']) {
        require('./column/auditLog/messageDel')();
    };

    console.log(`[${DateTime.utc().toFormat(timeFormat)}][Discord] Database created.`);
};