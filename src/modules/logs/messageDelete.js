/* eslint-disable no-inline-comments */
const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const prefix = process.env.PREFIX;
require("dotenv").config();
module.exports = {
	name: "messageDelete",
	description: "Loggin bot's beeing added to the server.",
	call: "on", // client.once = 'once', client.on = 'on'
	async execute(message) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel();
		const { DateTime } = require("luxon");
		// SQLite
		const { Get, Set, Del } = require("../../tools/functions/sqlite/prepare");

		// eslint-disable-next-line no-undef
		const getGuildObj = await globalclient.guilds.fetch(message.guildId);
		// Fetch AuditLog
		const fetchedLogs = await getGuildObj.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MessageDelete
		});
		const botLog = fetchedLogs.entries.first();
		// Data Null
		let dataAuditLog;

		const embedMsgDel = new EmbedBuilder()
			.setColor("Orange")
			.setDescription(`*Anon* **Deleted** Uncached Message in <#${message.channelId}>`);
		if (botLog == null) {
			// Bot and Command
			if (message.author != null && message.content != null) {
				let check = true;
				let msgLower = message.content.toLowerCase();
				const argsLower = msgLower.split(/ +/);
				if (msgLower.startsWith("<@")) {msgLower = msgLower.replace(`${argsLower[0]} `, "");}
				const exCmdString = process.env.EXTERNAL_COMMANDS;
				const exCmdTrim = exCmdString.split(/,+/);
				const exCmdArray = exCmdTrim.map(obj => {
					return obj.trim();
				});
				exCmdArray.forEach(c => {
					if (msgLower.startsWith(c) && process.env.LOG_COMMANDS === "false") {check = false;}
				});
				if (check === false) {return;}
				if (message.author.bot === true && process.env.LOG_BOTS === "false") {return;} else
					if (msgLower.startsWith(`${prefix}`) && process.env.LOG_COMMANDS) {return;} else
						if (msgLower.startsWith("/") && process.env.LOG_COMMANDS) {return;} else {
							// console.log(process.env.LOG_BOTS);
							let icon2;
							// Old AuditLog Entry + New Message
							icon2 = message.author.avatarURL();
							if(message.author.avatar == null) {
								icon2 = "attachment://discord_logo_gray.png";
							}
							if (message.content) {
								let msgCont = message.content;
								if (msgCont.length > 1024) {
									const slcmsgcont = msgCont.slice(1020);
									const rplcmsgcont = msgCont.replace(slcmsgcont, "...");
									msgCont = rplcmsgcont;
								}
								embedMsgDel.addFields(
									{ name: "Content:", value: `${msgCont}` }
								);
							}
							if (message.embeds.length !== 0) {
								const embedFilter = message.embeds.map(function(obj) {return obj.data;});
								let embedContent = "";
								if (embedFilter && embedFilter[0].author) {embedContent += `***Name:*** ${embedFilter[0].author.name}\n`;}
								if (embedFilter && embedFilter[0].color) {embedContent += `***Color:*** ${embedFilter[0].color}\n`;}
								if (embedFilter && embedFilter[0].description) {embedContent += `***Content:***\n${embedFilter[0].description}\n`;}
								if (embedFilter && embedFilter[0].fields) {embedContent += "***Fields:*** One or more.\n";}
								if (embedFilter && embedFilter[0].timestamp) {embedContent += `***Time:*** ${embedFilter[0].timestamp}\n`;}
								embedMsgDel.addFields(
									{ name: "Embed:", value: `${embedContent}` }
								);
							}
							embedMsgDel.setAuthor({ name: `${message.author.tag}`, iconURL: `${icon2}` })
								.setDescription(`${message.author} **Deleted** There own Message in ${message.channel}`)
								.setFooter({ text: `MemberID: ${message.author.id}` })
								.setTimestamp(new Date());

							// eslint-disable-next-line no-undef
							globalclient.channels.cache.get(logChannel).send({ embeds: [embedMsgDel] });
						}
			}
			// Icon
			let icon2 = "";
			if(message.author == null) {
				icon2 = "attachment://discord_logo_gray.png";
			}
			// Uncached Messages
			if (message.author == null) {
				// if (dataAuditLog.AuditLogID === id && dataAuditLog.Count >= extra.count) {
				// Old AuditLog Entry + New Message
				icon2 = "attachment://discord_logo_gray.png";
				embedMsgDel.setAuthor({ name: " ", iconURL: `${icon2}` })
					.setDescription(`*Anon* **Deleted** Uncached Message in <#${message.channelId}>`)
					.setFooter({ text: "MemberID: Unknown" })
					.setTimestamp(new Date());
				// };
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [embedMsgDel] });
			}
		}
		if (botLog != null) {
			const { executor, id, extra, target } = botLog;
			const createdTimestampLog = botLog.createdTimestamp;
			const dt = DateTime.now().minus({ seconds: 5 });
			const time = dt.toMillis();
			if (time > createdTimestampLog) {
				dataAuditLog = { AuditLogID: `${id}`, GuildID: `${message.guild.id}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
			}
			dataAuditLog = Get.auditLogs(id);
			if (dataAuditLog == null) {dataAuditLog = "0";}
			// Bot and Command
			if (message.author != null && message.content != null) {
				let check = true;
				let msgLower = message.content.toLowerCase();
				const argsLower = msgLower.split(/ +/);
				if (msgLower.startsWith("<@")) {msgLower = msgLower.replace(`${argsLower[0]} `, "");}
				const exCmdString = process.env.EXTERNAL_COMMANDS;
				const exCmdTrim = exCmdString.split(/,+/);
				const exCmdArray = exCmdTrim.map(obj => {
					return obj.trim();
				});
				exCmdArray.forEach(c => {
					if (msgLower.startsWith(c) && process.env.LOG_COMMANDS === "false") {check = false;}
				});
				if (check === false) {return;}
				if (executor.bot === true && process.env.LOG_BOTS === "false") {return;}
				if (msgLower.startsWith(`${prefix}`) && process.env.LOG_COMMANDS === "false") {return;}
				if (msgLower.startsWith("/") && process.env.LOG_COMMANDS === "false") {return;}
			}
			// Icon
			let icon2 = executor.avatarURL();
			if(executor.avatar == null) {
				icon2 = "attachment://discord_logo_gray.png";
			}
			// Uncached Messages
			if (message.author == null) {
				if (dataAuditLog === "0") {
					// New AuditLog Entry + New Message
					embedMsgDel.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
						.setDescription(`${executor} **Deleted** Uncached Message by ${target} in ${extra.channel}`)
						.setFooter({ text: `MemberID: ${target.id}` })
						.setTimestamp(new Date());
					dataAuditLog = { AuditLogID: `${id}`, GuildID: `${message.guild.id}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
					Set.auditLogs(dataAuditLog);
				}
				if (dataAuditLog.AuditLogID === id && dataAuditLog.Count < extra.count) {
					// Highter counter + New Message
					embedMsgDel.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
						.setDescription(`${executor} **Deleted** Uncached Message by ${target} in ${extra.channel}`)
						.setFooter({ text: `MemberID: ${target.id}` })
						.setTimestamp(new Date());
					dataAuditLog = { AuditLogID: `${id}`, GuildID: `${message.guild.id}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
					Set.auditLogs(dataAuditLog);
				}
				// eslint-disable-next-line no-undef
				globalclient.channels.cache.get(logChannel).send({ embeds: [embedMsgDel] });
			}
			// Cached Messages
			if (message.author != null) {
				// System
				if (message.system === true && executor.bot === false) {
					if (dataAuditLog === "0") {
						// New AuditLog Entry + New Message
						embedMsgDel.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
							.setDescription(`${executor} **Deleted** a System Message send as ${target} in ${extra.channel}`)
							.setFooter({ text: `MemberID: ${target.id}` })
							.setTimestamp(new Date());
						dataAuditLog = { AuditLogID: `${id}`, GuildID: `${message.guild.id}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
						Set.auditLogs(dataAuditLog);
					}
					if (dataAuditLog.AuditLogID === id && dataAuditLog.Count < extra.count) {
						// Highter counter + New Message
						embedMsgDel.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
							.setDescription(`${executor} **Deleted** a System Message send as ${target} in ${extra.channel}`)
							.setFooter({ text: `MemberID: ${target.id}` })
							.setTimestamp(new Date());
						dataAuditLog = { AuditLogID: `${id}`, GuildID: `${message.guild.id}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
						Set.auditLogs(dataAuditLog);
					}
					if (dataAuditLog.AuditLogID === id && dataAuditLog.Count >= extra.count) {
						// Old AuditLog Entry + New Message
						icon2 = message.author.avatarURL();
						if(message.author.avatar == null) {
							icon2 = "attachment://discord_logo_gray.png";
						}
						embedMsgDel.setAuthor({ name: `${message.author.tag}`, iconURL: `${icon2}` })
							.setDescription(`${message.author} **Deleted** a System Message send as Thereself in ${message.channel}`)
							.setFooter({ text: `MemberID: ${message.author.id}` })
							.setTimestamp(new Date());
					}
					// eslint-disable-next-line no-undef
					globalclient.channels.cache.get(logChannel).send({ embeds: [embedMsgDel] });
				}
				// Member
				if (message.system === false && executor.bot === false) {
					if (dataAuditLog === "0") {
						// New AuditLog Entry + New Message
						if (message.content) {
							let msgCont = message.content;
							if (msgCont.length > 1024) {
								const slcmsgcont = msgCont.slice(1020);
								const rplcmsgcont = msgCont.replace(slcmsgcont, "...");
								msgCont = rplcmsgcont;
							}
							embedMsgDel.addFields(
								{ name: "Content:", value: `${msgCont}` }
							);
						}
						if (message.embeds.length !== 0) {
							const embedFilter = message.embeds.map(function(obj) {return obj.data;});
							let embedContent = "";
							if (embedFilter && embedFilter[0].author) {embedContent += `***Name:*** ${embedFilter[0].author.name}\n`;}
							if (embedFilter && embedFilter[0].color) {embedContent += `***Color:*** ${embedFilter[0].color}\n`;}
							if (embedFilter && embedFilter[0].description) {embedContent += `***Content:***\n${embedFilter[0].description}\n`;}
							if (embedFilter && embedFilter[0].fields) {embedContent += "***Fields:*** One or more.\n";}
							if (embedFilter && embedFilter[0].timestamp) {embedContent += `***Time:*** ${embedFilter[0].timestamp}\n`;}
							embedMsgDel.addFields(
								{ name: "Embed:", value: `${embedContent}` }
							);
						}
						embedMsgDel.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
							.setDescription(`${executor} **Deleted** a Message by ${target} in ${extra.channel}`)
							.setFooter({ text: `MemberID: ${target.id}` })
							.setTimestamp(new Date());
						dataAuditLog = { AuditLogID: `${id}`, GuildID: `${message.guild.id}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
						Set.auditLogs(dataAuditLog);
					} else
						if (dataAuditLog.AuditLogID === id && dataAuditLog.Count < extra.count) {
							// Highter counter + New Message
							if (message.content) {
								let msgCont = message.content;
								if (msgCont.length > 1024) {
									const slcmsgcont = msgCont.slice(1020);
									const rplcmsgcont = msgCont.replace(slcmsgcont, "...");
									msgCont = rplcmsgcont;
								}
								embedMsgDel.addFields(
									{ name: "Content:", value: `${msgCont}` }
								);
							}
							if (message.embeds.length !== 0) {
								const embedFilter = message.embeds.map(function(obj) {return obj.data;});
								let embedContent = "";
								if (embedFilter && embedFilter[0].author) {embedContent += `***Name:*** ${embedFilter[0].author.name}\n`;}
								if (embedFilter && embedFilter[0].color) {embedContent += `***Color:*** ${embedFilter[0].color}\n`;}
								if (embedFilter && embedFilter[0].description) {embedContent += `***Content:***\n${embedFilter[0].description}\n`;}
								if (embedFilter && embedFilter[0].fields) {embedContent += "***Fields:*** One or more.\n";}
								if (embedFilter && embedFilter[0].timestamp) {embedContent += `***Time:*** ${embedFilter[0].timestamp}\n`;}
								embedMsgDel.addFields(
									{ name: "Embed:", value: `${embedContent}` }
								);
							}
							embedMsgDel.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
								.setDescription(`${executor} **Deleted** a Message by ${target} in ${extra.channel}`)
								.setFooter({ text: `MemberID: ${target.id}` })
								.setTimestamp(new Date());
							dataAuditLog = { AuditLogID: `${id}`, GuildID: `${message.guild.id}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
							Set.auditLogs(dataAuditLog);
						} else {
							// if (dataAuditLog.AuditLogID === id && dataAuditLog.Count >= extra.count) {
							// Old AuditLog Entry + New Message
							icon2 = message.author.avatarURL();
							if(message.author.avatar == null) {
								icon2 = "attachment://discord_logo_gray.png";
							}
							if (message.content) {
								let msgCont = message.content;
								if (msgCont.length > 1024) {
									const slcmsgcont = msgCont.slice(1020);
									const rplcmsgcont = msgCont.replace(slcmsgcont, "...");
									msgCont = rplcmsgcont;
								}
								embedMsgDel.addFields(
									{ name: "Content:", value: `${msgCont}` }
								);
							}
							if (message.embeds.length !== 0) {
								const embedFilter = message.embeds.map(function(obj) {return obj.data;});
								let embedContent = "";
								if (embedFilter && embedFilter[0].author) {embedContent += `***Name:*** ${embedFilter[0].author.name}\n`;}
								if (embedFilter && embedFilter[0].color) {embedContent += `***Color:*** ${embedFilter[0].color}\n`;}
								if (embedFilter && embedFilter[0].description) {embedContent += `***Content:***\n${embedFilter[0].description}\n`;}
								if (embedFilter && embedFilter[0].fields) {embedContent += "***Fields:*** One or more.\n";}
								if (embedFilter && embedFilter[0].timestamp) {embedContent += `***Time:*** ${embedFilter[0].timestamp}\n`;}
								embedMsgDel.addFields(
									{ name: "Embed:", value: `${embedContent}` }
								);
							}
							embedMsgDel.setAuthor({ name: `${message.author.tag}`, iconURL: `${icon2}` })
								.setDescription(`${message.author} **Deleted** There own Message in ${message.channel}`)
								.setFooter({ text: `MemberID: ${message.author.id}` })
								.setTimestamp(new Date());
						}
					// eslint-disable-next-line no-undef
					globalclient.channels.cache.get(logChannel).send({ embeds: [embedMsgDel] });
				}
				// Bot
				if (message.system === false && executor.bot === true) {
					// Normal Message
					if (dataAuditLog === "0") {
						// New AuditLog Entry + New Message
						if (message.content) {
							let msgCont = message.content;
							if (msgCont.length > 1024) {
								const slcmsgcont = msgCont.slice(1020);
								const rplcmsgcont = msgCont.replace(slcmsgcont, "...");
								msgCont = rplcmsgcont;
							}
							embedMsgDel.addFields(
								{ name: "Content:", value: `${msgCont}` }
							);
						}
						if (message.embeds.length !== 0) {
							const embedFilter = message.embeds.map(function(obj) {return obj.data;});
							let embedContent = "";
							if (embedFilter && embedFilter[0].author) {embedContent += `***Name:*** ${embedFilter[0].author.name}\n`;}
							if (embedFilter && embedFilter[0].color) {embedContent += `***Color:*** ${embedFilter[0].color}\n`;}
							if (embedFilter && embedFilter[0].description) {embedContent += `***Content:***\n${embedFilter[0].description}\n`;}
							if (embedFilter && embedFilter[0].fields) {embedContent += "***Fields:*** One or more.\n";}
							if (embedFilter && embedFilter[0].timestamp) {embedContent += `***Time:*** ${embedFilter[0].timestamp}\n`;}
							embedMsgDel.addFields(
								{ name: "Embed:", value: `${embedContent}` }
							);
						}
						embedMsgDel.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
							.setDescription(`Bot ${executor} **Deleted** a Message by ${target} in ${extra.channel}`)
							.setFooter({ text: `MemberID: ${target.id}` })
							.setTimestamp(new Date());
						dataAuditLog = { AuditLogID: `${id}`, GuildID: `${message.guild.id}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
						Set.auditLogs(dataAuditLog);
					} else
						if (dataAuditLog.AuditLogID === id && dataAuditLog.Count < extra.count) {
							// Highter counter + New Message
							if (message.content) {
								let msgCont = message.content;
								if (msgCont.length > 1024) {
									const slcmsgcont = msgCont.slice(1020);
									const rplcmsgcont = msgCont.replace(slcmsgcont, "...");
									msgCont = rplcmsgcont;
								}
								embedMsgDel.addFields(
									{ name: "Content:", value: `${msgCont}` }
								);
							}
							if (message.embeds.length !== 0) {
								const embedFilter = message.embeds.map(function(obj) {return obj.data;});
								let embedContent = "";
								if (embedFilter && embedFilter[0].author) {embedContent += `***Name:*** ${embedFilter[0].author.name}\n`;}
								if (embedFilter && embedFilter[0].color) {embedContent += `***Color:*** ${embedFilter[0].color}\n`;}
								if (embedFilter && embedFilter[0].description) {embedContent += `***Content:***\n${embedFilter[0].description}\n`;}
								if (embedFilter && embedFilter[0].fields) {embedContent += "***Fields:*** One or more.\n";}
								if (embedFilter && embedFilter[0].timestamp) {embedContent += `***Time:*** ${embedFilter[0].timestamp}\n`;}
								embedMsgDel.addFields(
									{ name: "Embed:", value: `${embedContent}` }
								);
							}
							embedMsgDel.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
								.setDescription(`Bot ${executor} **Deleted** a Message by ${target} in ${extra.channel}`)
								.setFooter({ text: `MemberID: ${target.id}` })
								.setTimestamp(new Date());
							dataAuditLog = { AuditLogID: `${id}`, GuildID: `${message.guild.id}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
							Set.auditLogs(dataAuditLog);
						} else
							if (dataAuditLog.AuditLogID === id && dataAuditLog.Count >= extra.count) {
								// Old AuditLog Entry + New Message
								if (message.content) {
									let msgCont = message.content;
									if (msgCont.length > 1024) {
										const slcmsgcont = msgCont.slice(1020);
										const rplcmsgcont = msgCont.replace(slcmsgcont, "...");
										msgCont = rplcmsgcont;
									}
									embedMsgDel.addFields(
										{ name: "Content:", value: `${msgCont}` }
									);
								}
								if (message.embeds.length !== 0) {
									const embedFilter = message.embeds.map(function(obj) {return obj.data;});
									let embedContent = "";
									if (embedFilter && embedFilter[0].author) {embedContent += `***Name:*** ${embedFilter[0].author.name}\n`;}
									if (embedFilter && embedFilter[0].color) {embedContent += `***Color:*** ${embedFilter[0].color}\n`;}
									if (embedFilter && embedFilter[0].description) {embedContent += `***Content:***\n${embedFilter[0].description}\n`;}
									if (embedFilter && embedFilter[0].fields) {embedContent += "***Fields:*** One or more.\n";}
									if (embedFilter && embedFilter[0].timestamp) {embedContent += `***Time:*** ${embedFilter[0].timestamp}\n`;}
									embedMsgDel.addFields(
										{ name: "Embed:", value: `${embedContent}` }
									);
								}
								icon2 = message.author.avatarURL();
								if(message.author.avatar == null) {
									icon2 = "attachment://discord_logo_gray.png";
								}
								embedMsgDel.setAuthor({ name: `${message.author.tag}`, iconURL: `${icon2}` })
									.setDescription(`Bot ${message.author} **Deleted** There own Message in ${message.channel}`)
									.setFooter({ text: `BotID: ${message.author.id}` })
									.setTimestamp(new Date());
							}
					// eslint-disable-next-line no-undef
					globalclient.channels.cache.get(logChannel).send({ embeds: [embedMsgDel] });
				}
				if (message.system === true && executor.bot === true) {
					// System Message
					if (dataAuditLog === "0") {
						// New AuditLog Entry + New Message
						embedMsgDel.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
							.setDescription(`Bot ${executor} **Deleted** a System Message send as ${target} in ${extra.channel}`)
							.setFooter({ text: `MemberID: ${target.id}` })
							.setTimestamp(new Date());
						dataAuditLog = { AuditLogID: `${id}`, GuildID: `${message.guild.id}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
						Set.auditLogs(dataAuditLog);
					} else
						if (dataAuditLog.AuditLogID === id && dataAuditLog.Count < extra.count) {
							// Highter counter + New Message
							embedMsgDel.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
								.setDescription(`Bot ${executor} **Deleted** a System Message send as ${target} in ${extra.channel}`)
								.setFooter({ text: `MemberID: ${target.id}` })
								.setTimestamp(new Date());
							dataAuditLog = { AuditLogID: `${id}`, GuildID: `${message.guild.id}`, Type: "Message_Delete", Count: `${extra.count}`, Date: `${botLog.createdTimestamp}` };
							Set.auditLogs(dataAuditLog);
						} else
							if (dataAuditLog.AuditLogID === id && dataAuditLog.Count >= extra.count) {
								// Old AuditLog Entry + New Message
								icon2 = message.author.avatarURL();
								if(message.author.avatar == null) {
									icon2 = "attachment://discord_logo_gray.png";
								}
								embedMsgDel.setAuthor({ name: `${message.author.tag}`, iconURL: `${icon2}` })
									.setDescription(`Bot ${message.author} **Deleted** a System Message send as Thereself in ${message.channel}`)
									.setFooter({ text: `BotID: ${message.author.id}` })
									.setTimestamp(new Date());
							}
					// eslint-disable-next-line no-undef
					globalclient.channels.cache.get(logChannel).send({ embeds: [embedMsgDel] });
				}
			}
		}
		let dataAuditLogDate;
		// eslint-disable-next-line prefer-const
		dataAuditLogDate = Get.allAuditLogs("Message_Delete");
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
	}
};
