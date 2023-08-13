
// Require SQLite and Databases
const SQLite = require("better-sqlite3");
const sql_AuditLogs = new SQLite('./data/sqlite/auditLog.sqlite');

class Set {
    // AuditLog
    static auditLogs(id) {
        let data;
        globalclient.setAuditLogs = sql_AuditLogs.prepare("INSERT OR REPLACE INTO auditlog (AuditLogID, GuildID, Type, Date) VALUES (@AuditLogID, @GuildID, @Type, @Date);");
        data = globalclient.setAuditLogs.run(id);
        return data;
    };
    static auditLogsMsgDel(id) {
        let data;
        globalclient.setMessageDel = sql_AuditLogs.prepare("INSERT OR REPLACE INTO messagedel (AuditLogID, GuildID, Type, Count, Date) VALUES (@AuditLogID, @GuildID, @Type, @Count, @Date);");
        data = globalclient.setMessageDel.run(id);
        return data;
    };
};

exports.Set = Set;