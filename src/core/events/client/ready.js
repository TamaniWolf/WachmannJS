const { Events } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "LL" + "/" + "dd" + "/" + "yyyy" + "-" + "h" + ":" + "mm" + ":" + "ss" + "-" + "a";

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		const { Application } = require("../../application/Application.js");
		// Set Client (Bot) Activity.
		// client.user.setActivity('the Planning Office', {type: 'WATCHING'});
		// eslint-disable-next-line no-console
		console.log(`[${DateTime.utc().toFormat(timeFormat)}][Discord] logged in as ${client.user.tag}.`);
		global.globalclient = client;
		// eslint-disable-next-line no-console
		console.log(`[${DateTime.utc().toFormat(timeFormat)}] ▪ ▪ ▪  Module Start  ▪ ▪ ▪ `);

		const handlerList = ["logs_handler", "command_handler"];
		handlerList.forEach(modulesHandler =>{
			// eslint-disable-next-line no-undef
			require(`../../handler/${modulesHandler}`)(globalclient);
		});

		// eslint-disable-next-line no-console
		console.log(`[Time] ${DateTime.utc().toFormat(timeFormat)} [UTC]`);
		// eslint-disable-next-line no-console
		console.log("[NodeJS] ▪ ▪ ▪ ▪ ▪  DiscordBot Ready  ▪ ▪ ▪ ▪ ▪ ");

		Application.database();
	}
};
/*
0   PLAYING     "Playing {name}"
1   STREAMING   "Streaming {details}"   Only Twitch and YouTube urls work.
2   LISTENING   "Listening to {name}"
3   WATCHING    "Watching {name}"
4   CUSTOM      "{emoji} {name}"
5   COMPETING   "Competing in {name}"
*/