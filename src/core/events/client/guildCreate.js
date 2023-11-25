const { Events } = require("discord.js");
module.exports = {
	name: Events.GuildCreate,
	description: "Log Bot Joining Servers.",
	once: false,
	async execute(guild) {
		// eslint-disable-next-line no-console
		console.log(`The Bot Joined a new server: ${guild.name}`);
	}
};
