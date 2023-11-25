/* eslint-disable no-undef */
/* eslint-disable no-console */
const { ActivityType, Events } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "LL" + "/" + "dd" + "/" + "yyyy" + "-" + "h" + ":" + "mm" + ":" + "ss" + "-" + "a";

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		const { Application } = require("../../application/Application.js");
		// Set Client (Bot) Activity.
		client.user.setActivity("the PEF Office", { type: ActivityType.Watching });
		console.log(`[${DateTime.utc().toFormat(timeFormat)}][Discord] logged in as ${client.user.tag}.`);
		const guildInvites = new Map();
		client.guilds.cache.forEach(guild => {
			guild.invites.fetch()
				.then(invites => {
					const codeUses = new Map();
					invites.each(inv => codeUses.set(inv.code, inv.uses));
					guildInvites.set(guild.id, codeUses);
				})
				.catch(err => {
					console.log("OnReady Error:", err);
				});
		});
		global.globalInvites = guildInvites;
		global.globalclient = client;
		console.log(`[${DateTime.utc().toFormat(timeFormat)}] ▪ ▪ ▪  Module Start  ▪ ▪ ▪ `);

		const handlerList = ["logs_handler", "command_handler", "moderation_handler"];
		handlerList.forEach(modulesHandler => {
			require(`../../handler/${modulesHandler}`)(globalclient);
		});

		console.log(`[Time] ${DateTime.utc().toFormat(timeFormat)} [UTC]`);
		console.log("[NodeJS] ▪ ▪ ▪ ▪ ▪  DiscordBot Ready  ▪ ▪ ▪ ▪ ▪ ");

		Application.database();
	}
};
/*
0   Playing     "Playing {name}"
1   Streaming   "Streaming {details}"   Only Twitch and YouTube urls work.
2   Listening   "Listening to {name}"
3   Watching    "Watching {name}"
4   Custom      "{emoji} {name}"
5   Competing   "Competing in {name}"
*/