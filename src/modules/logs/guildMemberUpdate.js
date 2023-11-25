const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.GuildMemberUpdate,
	description: "Log edited Members.",
	call: "on",
	async execute(oldMember, newMember) {
		const { DateTime } = require("luxon");
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(newMember.guild.id);
		const { Application } = require("../../core/application/Application");
		const { Get, Set, Del } = require("../../tools/functions/sqlite/prepare");

		// eslint-disable-next-line no-undef
		const getGuildObj = await globalclient.guilds.fetch(newMember.guild.id);
		// const getMemberObj = await getGuildObj.members.fetch(newMember.user.id);
		const memberID = `<@${newMember.user.id}>`;
		await getGuildObj.roles.fetch();

		try {
			const memberUpdateFetchedLogs = await newMember.guild.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.MemberUpdate
			});
			const memberUpdateLog = memberUpdateFetchedLogs.entries.first();
			const memberRoleUpdateFetchedLogs = await newMember.guild.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.MemberRoleUpdate
			});
			const memberRoleUpdateLog = memberRoleUpdateFetchedLogs.entries.first();

			let dataAuditLogIDMember;
			let dataAuditLogIDRole;
			let icon2 = "";
			const getBotConfigID = `${getGuildObj.id}-${getGuildObj.shard.id}`;
			let dataLang;
			dataLang = Get.botConfig(getBotConfigID);
			if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
			const lang = require(`../../.${dataLang.Lang}`);
			const { LanguageConvert } = require("../../tools/functions/languageConvert");

			if (memberUpdateLog != null) {
				dataAuditLogIDMember = Get.auditLogs(memberUpdateLog.id);
			}
			if (memberRoleUpdateLog != null) {
				dataAuditLogIDRole = Get.auditLogs(memberRoleUpdateLog.id);
			}

			if (dataAuditLogIDMember == null || dataAuditLogIDMember.AuditLogID !== memberUpdateLog.id) {
				// Member Update
				const embedsMemberUpdate = new EmbedBuilder()
					.setColor(Application.colors().logEmbedColor.update);
				const { executor, changes, id, target } = memberUpdateLog;

				const arrayOfKey = changes.map(function(obj) {
					return obj.key;
				});
				const arrayOfOld = changes.map(function(obj) {
					return obj.old;
				});
				const arrayOfNew = changes.map(function(obj) {
					return obj.new;
				});
				const stringKey = arrayOfKey.toString();
				const stringOld = arrayOfOld.toString();
				const stringNew = arrayOfNew.toString();

				if (stringKey === "nick") {
					if (stringOld === "") embedsMemberUpdate.setDescription(LanguageConvert.lang(lang.logs.addnickto, stringNew, target));
					if (stringNew === "") embedsMemberUpdate.setDescription(LanguageConvert.lang(lang.logs.removenickfrom, stringOld, target));
					if (stringOld !== "" && stringNew !== "") {
						embedsMemberUpdate.setDescription(LanguageConvert.lang(lang.logs.editnickof, target))
							.addFields(
								{ name: `${lang.logs.before}`, value: `\`${stringOld}\``, inline: true },
								{ name: `${lang.logs.after}`, value: `\`${stringNew}\``, inline: true }
							);
					}
					dataAuditLogIDMember = { AuditLogID: `${id}`, GuildID: `${newMember.guild.id}`, Type: "Member_Update", Date: `${memberRoleUpdateLog.createdTimestamp}` };
				}

				icon2 = executor.avatarURL();
				if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
				embedsMemberUpdate.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: icon2 })
					.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [embedsMemberUpdate] });
				Set.auditLogs(dataAuditLogIDMember);
			}
			if (dataAuditLogIDRole == null || dataAuditLogIDRole.AuditLogID !== memberRoleUpdateLog.id) {
				// Member Role Update
				const embedsMemberRoleUpdate = new EmbedBuilder()
					.setColor(Application.colors().logEmbedColor.update);
				const { executor, changes, id, target } = memberRoleUpdateLog;

				const arrayOfKey = changes.map(function(obj) {
					return obj.key;
				});
				const arrayOfRoleId = changes.map(function(obj) {
					return obj.new.map(function(obj) {
						return obj.id;
					});
				});
				// const arrayOfRoleName = changes.map(function(obj) {
				// 	return obj.new.map(function(obj) {
				// 		return obj.name;
				// 	});
				// });
				const stringKey = arrayOfKey.toString();
				const stringRoleId = arrayOfRoleId.toString();
				// const stringRoleName = arrayOfRoleName.toString();
				const getRoleObj = await getGuildObj.roles.fetch(stringRoleId);

				if (stringKey === "$add") {
					embedsMemberRoleUpdate.setDescription(LanguageConvert.lang(lang.logs.addroleto, getRoleObj, `<@${target.id}>`));
				}
				if (stringKey === "$remove") {
					embedsMemberRoleUpdate.setDescription(LanguageConvert.lang(lang.logs.removerolefrom, getRoleObj, `<@${target.id}>`));
				}

				icon2 = executor.avatarURL();
				if (executor.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
				embedsMemberRoleUpdate.setAuthor({ name: `${executor.tag} (ID: ${executor.id})`, iconURL: icon2 })
					.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [embedsMemberRoleUpdate] });
				dataAuditLogIDRole = { AuditLogID: `${id}`, GuildID: `${newMember.guild.id}`, Type: "Member_Update", Date: `${memberRoleUpdateLog.createdTimestamp}` };
				Set.auditLogs(dataAuditLogIDRole);
			}
			if (dataAuditLogIDRole != null) {
				if (dataAuditLogIDRole.AuditLogID === memberRoleUpdateLog.id) return;
				const embedsIntegrationRoleUpdate = new EmbedBuilder()
					.setColor(Application.colors().logEmbedColor.update);

				const oldRoles = oldMember._roles;
				const newRoles = newMember._roles;

				if (oldRoles.length > newRoles.length) {
					oldRoles.forEach(long => {
						if (!newRoles.includes(long)) {
							const getRoleObj = getGuildObj.roles.cache.get(long);
							embedsIntegrationRoleUpdate.setDescription(LanguageConvert.lang(lang.logs.removerolefrom, getRoleObj, memberID));
						}
					});
				}
				if (newRoles.length > oldRoles.length) {
					newRoles.forEach(long => {
						if (!oldRoles.includes(long)) {
							const getRoleObj = getGuildObj.roles.cache.get(long);
							embedsIntegrationRoleUpdate.setDescription(LanguageConvert.lang(lang.logs.addroleto, getRoleObj, memberID));
						}
					});
				}

				icon2 = "https://i.imgur.com/CN6k8gB.png";
				embedsIntegrationRoleUpdate.setAuthor({ name: LanguageConvert.lang(lang.logs.interactionid), iconURL: icon2 })
					.setTimestamp(new Date());
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [embedsIntegrationRoleUpdate] });
			}

			let dataAuditLogDate;
			// eslint-disable-next-line prefer-const
			dataAuditLogDate = Get.allAuditLogs("Member_Update");
			if (dataAuditLogDate.length < 4) {
				return;
			} else {
				dataAuditLogDate.forEach(date => {
					const dtRemove = DateTime.now().minus({ days: 20 });
					const timeNew = dtRemove.toMillis();
					if (timeNew >= date.Date) {
						Del.auditLogs(date.AuditLogID);
					}
				});
			}

		} catch(err) {
			let errData;
			// eslint-disable-next-line no-undef
			if (globalclient.guilds.cache.get(getGuildObj.id) && err.code === 50013) {errData = `${err}\n[Client] The Bot/Member is Missing the requiered Permission.`;}
			// eslint-disable-next-line no-undef
			if (!globalclient.guilds.cache.get(getGuildObj.id) && err.code === 50013) {errData = `${err}\n[Client] The Bot left the Server ${getGuildObj.name}.`;}
			if (err.code !== 50013) {errData = err;}
			// eslint-disable-next-line no-console
			console.log(errData);
		}
	}
};