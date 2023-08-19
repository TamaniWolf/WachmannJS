const { Events } = require("discord.js");
module.exports = {
	name: Events.GuildDelete,
	description: "Loggin bot's beeing added to the server.",
	once: true,
	async execute(guild) {
		// eslint-disable-next-line no-console
		console.log(`The Bot left a server: ${guild.name}`);
		["leave"].forEach(systemHandler =>{
			require(`../../../tools/database/create/${systemHandler}.js`)(guild);
		});
	}
};
