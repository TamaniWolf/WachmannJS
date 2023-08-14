/* eslint-disable no-inline-comments */
const { EmbedBuilder, AuditLogEvent } = require("discord.js");
require("dotenv").config();
module.exports = {
	name: "guildBanAdd",
	description: "Loggin bot's beeing added to the server.",
	call: "on", // client.once = 'once', client.on = 'on'
	async execute(ban) {
		const { DevCheck } = require("../../tools/functions/devCheck");
		const logChannel = await DevCheck.LogChannel();
		const fetchedLogs = await ban.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MemberBanAdd
		});
		const log = fetchedLogs.entries.first();
		if (logChannel === "100000000000000000") {
			return;
		}
		const { reason, executor, target } = log;
		let icon2 = executor.avatarURL();
		if(executor.avatar == null) {
			icon2 = "attachment://discord_logo_gray.png";
		}

		const embedBanAdd = new EmbedBuilder()
			.setAuthor({ name: `${executor.tag}`, iconURL: `${icon2}` })
			.setColor("Red")
			.setDescription(`**${target} got banned by ${executor}**`)
			.setFooter({ text: `MemberID: ${target.id}` })
			.setTimestamp(new Date());
		if (target.id === ban.user.id && reason != null) {
			embedBanAdd.addFields(
				{ name: "**Reason:**", value: `${reason}` }
			);
		}
		if (target.id === ban.user.id) {
			// eslint-disable-next-line no-undef
			globalclient.channels.cache.get(logChannel).send({ embeds: [embedBanAdd] });
		}
	}
};