/* eslint-disable no-inline-comments */
const { EmbedBuilder, AuditLogEvent } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: "guildMemberUpdate",
	description: "Loggin bot's beeing added to the server.",
	call: "on", // client.once = 'once', client.on = 'on'
	async execute(oldMember, newMember) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel();
		if (newMember.guild.id !== process.env.SERVER_ID) return;
		// SQLite
		const { DateTime } = require("luxon");
		const { Get, Set, Del } = require("../../tools/functions/sqlite/prepare");
		// Member Update
		// eslint-disable-next-line no-undef
		if (newMember.user.id === globalclient.user.id && typeof newMember._roles == "undefined" || newMember.user.id === globalclient.user.id && newMember._roles.length <= 0) return;
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
			// Data Null
			let dataAuditLogID;
			// Context
			if (memberUpdateLog == null) {
				return;
			}
			if (memberRoleUpdateLog == null) {
				return;
			}
			if (memberUpdateLog && memberRoleUpdateLog == null || memberUpdateLog && memberRoleUpdateLog) {
				if (memberUpdateLog.createdTimestamp > memberRoleUpdateLog.createdTimestamp) {
					if (memberUpdateLog != null) {
						dataAuditLogID = Get.auditLogs(memberUpdateLog.id);
					}
					const { targetType, actionType, executor, changes, id, target } = memberUpdateLog;
					const createdTimestampLog = memberUpdateLog.createdTimestamp;
					const dt = DateTime.now().minus({ seconds: 5 });
					const time = dt.toMillis();
					if (dataAuditLogID != null && dataAuditLogID.AuditLogID === id) {
						return;
					} else if (time > createdTimestampLog) {
						dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${newMember.guild.id}`, Type: "Member_Update", Date: `${memberUpdateLog.createdTimestamp}` };
						Set.auditLogs(dataAuditLogID);
					} else {
						dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${newMember.guild.id}`, Type: "Member_Update", Date: `${memberUpdateLog.createdTimestamp}` };
						Set.auditLogs(dataAuditLogID);
					}
					if(targetType === "User" && actionType === "Update") {
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
						let icon2 = executor.avatarURL();
						if(executor.avatar == null) {
							icon2 = "attachment://discord_logo_gray.png";
						}
						const embedsMemberUpdate = new EmbedBuilder();
						if(stringKey === "nick") {
							if(executor.id === target.id) {
								embedsMemberUpdate.setColor("Blue");
								if(stringOld === "") {
									embedsMemberUpdate.setDescription(`${executor} added they Nickname \`${stringNew}\``);
								} else if(stringNew === "") {
									embedsMemberUpdate.setDescription(`${executor} removed they Nickname \`${stringOld}\``);
								} else {
									embedsMemberUpdate.setDescription(`${executor} changed they Nickname \`${stringOld}\` to \`${stringNew}\``);
								}
							} else {
								embedsMemberUpdate.setColor("Yellow");
								if(stringOld === "") {
									embedsMemberUpdate.setDescription(`${executor} added the Nickname \`${stringNew}\` to ${target}`);
								} else if(stringNew === "") {
									embedsMemberUpdate.setDescription(`${executor} removed the Nickname \`${stringOld}\` from ${target}`);
								} else {
									embedsMemberUpdate.setDescription(`${executor} changed the Nickname of ${target} from \`${stringOld}\` to \`${stringNew}\``);
								}
							}
							embedsMemberUpdate.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
								.setFooter({ text: `MemberID: ${target.id}` })
								.setTimestamp(new Date());
							// eslint-disable-next-line no-undef
							globalclient.channels.cache.get(logChannel).send({ embeds: [embedsMemberUpdate] });
						}
					}
				}
			}
			if (memberRoleUpdateLog && memberUpdateLog == null || memberRoleUpdateLog && memberUpdateLog) {
				if (memberRoleUpdateLog.createdTimestamp > memberUpdateLog.createdTimestamp) {
					if (memberRoleUpdateLog != null) {
						dataAuditLogID = Get.auditLogs(memberRoleUpdateLog.id);
					}
					const { targetType, actionType, executor, changes, id, target } = memberRoleUpdateLog;
					const createdTimestampLog = memberRoleUpdateLog.createdTimestamp;
					const dt = DateTime.now().minus({ seconds: 5 });
					const time = dt.toMillis();
					if (dataAuditLogID != null && dataAuditLogID.AuditLogID === id) {
						return;
					} else if (time > createdTimestampLog) {
						dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${newMember.guild.id}`, Type: "Member_Update", Date: `${memberRoleUpdateLog.createdTimestamp}` };
						Set.auditLogs(dataAuditLogID);
					} else {
						dataAuditLogID = { AuditLogID: `${id}`, GuildID: `${newMember.guild.id}`, Type: "Member_Update", Date: `${memberRoleUpdateLog.createdTimestamp}` };
						Set.auditLogs(dataAuditLogID);
					}
					if(targetType === "User" && actionType === "Update") {
						const arrayOfKey = changes.map(function(obj) {
							return obj.key;
						});
						const arrayOfNewName = changes.map(function(obj) {
							return obj.new.map(function(obj) {
								return obj.name;
							});
						});
						const stringKey = arrayOfKey.toString();
						const stringNewName = arrayOfNewName.toString();
						const embedsMemberUpdate = new EmbedBuilder();
						if (executor == null) {
							const icon2 = "attachment://discord_logo_gray.png";
							embedsMemberUpdate.setColor("Yellow");
							embedsMemberUpdate.setDescription(`${target} was given the \`${stringNewName}\` role by \`Intergration\`.`);
							embedsMemberUpdate.setAuthor({ name: "Intergration", iconURL: `${icon2}` })
								.setFooter({ text: `MemberID: ${target.id}` })
								.setTimestamp(new Date());
							// eslint-disable-next-line no-undef
							globalclient.channels.cache.get(logChannel).send({ embeds: [embedsMemberUpdate] });
							return;
						}
						let name2 = executor.tag;
						let icon2 = executor.avatarURL();
						if(executor.avatar == null) {
							icon2 = "attachment://discord_logo_gray.png";
						}
						if (stringKey === "$add") {
							embedsMemberUpdate.setColor("Yellow");
							if (executor.id === target.id) {
								name2 = target.tag;
								icon2 = target.avatarURL();
								if(target.avatar == null) {
									icon2 = "attachment://discord_logo_gray.png";
								}
								embedsMemberUpdate.setDescription(`${target} was given the \`${stringNewName}\` role by them self.`);
							} else {
								embedsMemberUpdate.setDescription(`${target} was given the \`${stringNewName}\` role by ${executor}.`);
							}
							embedsMemberUpdate.setAuthor({ name: `${name2}`, iconURL: `${icon2}` })
								.setFooter({ text: `MemberID: ${target.id}` })
								.setTimestamp(new Date());
							// eslint-disable-next-line no-undef
							globalclient.channels.cache.get(logChannel).send({ embeds: [embedsMemberUpdate] });
						}
						if (stringKey === "$remove") {
							embedsMemberUpdate.setColor("Yellow");
							if (executor.id === target.id) {
								name2 = target.tag;
								icon2 = target.avatarURL();
								if(target.avatar == null) {
									icon2 = "attachment://discord_logo_gray.png";
								}
								embedsMemberUpdate.setDescription(`${target} removed them self from the \`${stringNewName}\` role.`);
							} else {
								embedsMemberUpdate.setDescription(`${executor} removed ${target} from the \`${stringNewName}\` role.`);
							}
							embedsMemberUpdate.setAuthor({ name: `${name2}`, iconURL: `${icon2}` })
								.setFooter({ text: `MemberID: ${target.id}` })
								.setTimestamp(new Date());
							// eslint-disable-next-line no-undef
							globalclient.channels.cache.get(logChannel).send({ embeds: [embedsMemberUpdate] });
						}
					}
				}
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
			if (globalclient.guilds.get(guild.id) && err.code === 50013) {errData = `${err}\n[Client] The Bot/Member is Missing the requiered Permission.`;}
			// eslint-disable-next-line no-undef
			if (!globalclient.guilds.get(guild.id) && err.code === 50013) {errData = `${err}\n[Client] The Bot left the Server ${guild.name}.`;}
			if (err.code !== 50013) {errData = err;}
			// eslint-disable-next-line no-console
			console.log(errData);
		}
	}
};