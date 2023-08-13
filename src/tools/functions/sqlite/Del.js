
// Require SQLite and Databases
const SQLite = require("better-sqlite3");
const sql_AuditLogs = new SQLite('./data/sqlite/auditLog.sqlite');

class Del {
    // AuditLog
    static auditLogs(id) {
        let data;
        globalclient.delAuditLogs = sql_AuditLogs.prepare("DELETE FROM auditlog WHERE AuditLogID = ?");
        data = globalclient.delAuditLogs.run(id);
        return data;
    };
    static auditLogsMsgDel(id) {
        let data;
        globalclient.delMessageDel = sql_AuditLogs.prepare("DELETE FROM messagedel WHERE AuditLogID = ?");
        data = globalclient.delMessageDel.run(id);
        return data;
    };
    // AuditLog By Guild
    static auditLogsByGuild(id) {
        let data;
        globalclient.delAuditLogsByGuild = sql_AuditLogs.prepare("DELETE FROM auditlog WHERE GuildID = ?");
        data = globalclient.delAuditLogsByGuild.run(id);
        return data;
    };
    static auditLogsMsgDelByGuild(id) {
        let data;
        globalclient.delMessageDelByGuild = sql_AuditLogs.prepare("DELETE FROM messagedel WHERE GuildID = ?");
        data = globalclient.delMessageDelByGuild.run(id);
        return data;
    };
};

exports.Del = Del;