const { Events } = require("discord.js");
module.exports = {
	name: Events.GuildCreate,
	description: "Loggin bot's beeing added to the server.",
	once: true,
	async execute(guild) {
		// eslint-disable-next-line no-console
		console.log(`The Bot Joined a new server: ${guild.name}`);
	}
};
