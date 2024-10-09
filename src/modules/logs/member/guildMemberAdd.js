const { EmbedBuilder, AuditLogEvent, Events } = require("discord.js");
require("dotenv").config();

module.exports = {
	name: Events.GuildMemberAdd,
	description: "Log Joining Members.",
	once: false,
	async execute(member) {
		const { Application } = require("../../../tools/core.js");
		const { DevCheck, LanguageConvert } = require("../../../tools/utils.js");
		// Log Channel
		const logChannel = await DevCheck.forLogChannel(member.guild.id);
		if (logChannel == null || logChannel === "0") return;
		// Language
		const lang = require(`../../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
		const langLogs = lang.modules.logs;

		// Fetch AuditLog
		const fetchedBotAddLogs = await member.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.BotAdd
		});
		const botAddLog = fetchedBotAddLogs.entries.first();

		// Main Body
		// eslint-disable-next-line no-undef
		const guild = await globalclient.guilds.fetch(member.guild.id);
		const channel = await guild.channels.fetch(logChannel);

		const logembed = new EmbedBuilder()
			.setColor(Application.colors().logEmbedColor.create)
			.setFooter({ text: "MemberAdd" })
			.setTimestamp(new Date());

		// eslint-disable-next-line no-undef
		const cachedInvites = globalInvites.get(member.guild.id);
		const newInvites = await member.guild.invites.fetch();
		let usedInvite = null;
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
				.setDescription(LanguageConvert.lang(langLogs.member.Joined, member.user.id))
				.addFields(
					{ name: `${langLogs.all.accountage}`, value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true }
				)
				.setFooter({ text: `${langLogs.all.memberid} ${member.user.id}` });
			if (usedInvite != null) {
				logembed.addFields(
					{ name: `${langLogs.member.inviteused}`, value: `https://discord.gg/${usedInvite.code}`, inline: true }
				);
			}
			channel.send({ embeds: [logembed] });
			return;
		}
		const { executor, target } = botAddLog;
		// Bot
		if (target.id === member.id) {
			let iconBot = executor.avatarURL();
			if (executor.avatar == null) iconBot = "https://i.imgur.com/CN6k8gB.png";
			logembed.setAuthor({ name: `${executor.tag}`, iconURL: iconBot })
				.setDescription(LanguageConvert.lang(langLogs.member.botadded, target, executor))
				.addFields(
					{ name: `${langLogs.all.accountage}`, value: `<t:${parseInt(target.createdTimestamp / 1000)}:R>`, inline: false }
				)
				.setFooter({ text: `${langLogs.all.botid} ${executor.id}` });
			if (usedInvite != null) {
				logembed.addFields(
					{ name: `${langLogs.all.inviteused}`, value: `https://discord.gg/${usedInvite.code}`, inline: true }
				);
			}
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
				.setDescription(LanguageConvert.lang(langLogs.member.Joined, member.user.id))
				.addFields(
					{ name: `${langLogs.all.accountage}`, value: `<t:${parseInt(memberlogged.user.createdTimestamp / 1000)}:R>`, inline: false }
				)
				.setFooter({ text: `${langLogs.all.memberid} ${member.user.id}` });
			if (usedInvite != null) {
				logembed.addFields(
					{ name: `${langLogs.member.inviteused}`, value: `https://discord.gg/${usedInvite.code}`, inline: true }
				);
			}
			channel.send({ embeds: [logembed] });
		}
	}
};