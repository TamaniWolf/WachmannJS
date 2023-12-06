const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: Events.GuildMemberAdd,
	description: "Log Joining Members.",
	once: false,
	async execute(member) {
		const { Application } = require("../../core/application/Application");
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel(member.guild.id);
		if (logChannel === "0") return;
		// BotAdd
		const fetchedBotAddLogs = await member.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.BotAdd
		});
		const botAddLog = fetchedBotAddLogs.entries.first();

		// Context
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(member.guild.id);
		const channel = await guild.channels.fetch(logChannel);
		const { Get } = require("../../tools/functions/sqlite/prepare");
		const getBotConfigID = `${guild.id}-${guild.shard.id}`;
		let dataLang;
		dataLang = Get.botConfig(getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "./data/lang/en_US.json" };
		const lang = require(`../../.${dataLang.Lang}`);
		const { LanguageConvert } = require("../../tools/functions/languageConvert");

		const logembed = new EmbedBuilder()
			.setColor(Application.colors().logEmbedColor.create)
			.setTimestamp(new Date());

		// eslint-disable-next-line no-undef
		const cachedInvites = globalInvites.get(member.guild.id);
		const newInvites = await member.guild.invites.fetch();
		let usedInvite = "None";
		usedInvite = newInvites.find(inv => cachedInvites.get(inv.code) < inv.uses);

		// Member no AuditLog
		if (botAddLog == null) {
			let iconMemberNoAuditLog = member.user.avatarURL();
			if (member.user.avatar == null) iconMemberNoAuditLog = "https://i.imgur.com/CN6k8gB.png";
			// const memberlogged = guild.members.cache.get(member.user.id);
			let oldNewTag;
			if (member.user.discriminator === "0") oldNewTag = `@${member.user.username}`;
			if (member.user.discriminator !== "0") oldNewTag = `@${member.user.username}#${member.user.discriminator}`;
			logembed.setAuthor({ name: oldNewTag, iconURL: iconMemberNoAuditLog })
				.setDescription(LanguageConvert.lang(lang.logs.Joined, member.user.id))
				.addFields(
					{ name: `${lang.logs.accountage}`, value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
					{ name: `${lang.logs.inviteused}`, value: `https://discord.gg/${usedInvite.code}`, inline: true }
				)
				.setFooter({ text: `${lang.logs.memberid} ${member.user.id}` });
			channel.send({ embeds: [logembed] });
			return;
		}
		const { executor, target } = botAddLog;
		// Bot
		if (target.id === member.id) {
			let iconBot = executor.avatarURL();
			if (executor.avatar == null) iconBot = "https://i.imgur.com/CN6k8gB.png";
			logembed.setAuthor({ name: `${executor.tag}`, iconURL: iconBot })
				.setDescription(LanguageConvert.lang(lang.logs.botadded, target, executor))
				.addFields(
					{ name: `${lang.logs.accountage}`, value: `<t:${parseInt(target.createdTimestamp / 1000)}:R>`, inline: false },
					{ name: `${lang.logs.inviteused}`, value: `https://discord.gg/${usedInvite.code}`, inline: true }
				)
				.setFooter({ text: `${lang.logs.botid} ${executor.id}` });
			channel.send({ embeds: [logembed] });
		}
		// Member
		if (target.id !== member.user.id) {
			let iconMember = member.user.avatarURL();
			if (member.user.avatar == null) iconMember = "https://i.imgur.com/CN6k8gB.png";
			const memberlogged = guild.members.cache.get(member.user.id);
			let oldNewTag;
			if (memberlogged.user.discriminator === "0") oldNewTag = `${member.user.username}`;
			if (memberlogged.user.discriminator !== "0") oldNewTag = `${member.user.username}${member.user.discriminator}`;
			logembed.setAuthor({ name: oldNewTag, iconURL: iconMember })
				.setDescription(LanguageConvert.lang(lang.logs.Joined, member.user.id))
				.addFields(
					{ name: `${lang.logs.accountage}`, value: `<t:${parseInt(memberlogged.user.createdTimestamp / 1000)}:R>`, inline: false },
					{ name: `${lang.logs.inviteused}`, value: `https://discord.gg/${usedInvite.code}`, inline: true }
				)
				.setFooter({ text: `${lang.logs.memberid} ${member.user.id}` });
			channel.send({ embeds: [logembed] });
		}
	}
};