
const { EmbedBuilder, AuditLogEvent } = require('discord.js');
require('dotenv').config();
module.exports = {
    name: 'roleDelete',
    description: 'Loggin bot\'s beeing added to the server.',
    call: 'on', // client.once = 'once', client.on = 'on'
    async execute(role) {
        const { DevCheck } = require('../../tools/functions/devCheck');
        const logChannel = await DevCheck.LogChannel();
        const { DateTime } = require('luxon');
        // SQLite
        const { Get, Set, Del } = require('../../tools/functions/sqlite/prepare');
        // AuditLog Fetch
        if (role.tags.botId === globalclient.user.id) return;
        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleDelete,
        });
        const roleLog = fetchedLogs.entries.first();
        // Data Null
        let dataAuditLogID;
        // Data Check
        if (roleLog == null) {return;};
        dataAuditLogID = Get.auditLogs(roleLog.id);
        // Context
            const { targetType, actionType, executor, changes, id } = roleLog;
            if(dataAuditLogID == null) {
                if(targetType === 'Role' && actionType === 'Delete') {
                    var key = changes.filter(function(obj) {
                        return obj.key === 'name';
                    });
                    let icon2 = executor.avatarURL();
                    if(executor.avatar == null) {
                        icon2 = 'attachment://discord_logo_gray.png';
                    };
                    const roleChanges = new EmbedBuilder()
                        .setAuthor({name: `${executor.tag}`, iconURL: `${icon2}`})
                        .setColor('Yellow')
                        .setDescription(`${executor} **Deleted** Role \`${key[0].old}\``)
                        .setFooter({text: `MemberID: ${executor.id}`})
                        .setTimestamp(new Date());
                        dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${role.guild.id}`, Type: `Role_Delete`, Date: `${roleLog.createdTimestamp}` };
                        Set.auditLogs(dataAuditLogID);
                        globalclient.channels.cache.get(logChannel).send({embeds: [roleChanges]});
                };
            };
            let dataAuditLogDate;
            dataAuditLogDate = Get.allAuditLogs('Role_Delete');
            if (dataAuditLogDate != null && dataAuditLogDate.length < 4) {
                return;
            } else {
                dataAuditLogDate.forEach(date => {
                    let dtRemove = DateTime.now().minus({ days: 20 });
                    let timeNew = dtRemove.toMillis();
                    if (timeNew >= date.Date) {
                        Del.auditLogs(date.AuditLogID);
                    };
                });
            };
    },
};