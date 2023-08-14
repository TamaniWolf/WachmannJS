/* eslint-disable no-async-promise-executor */
require("dotenv").config;

class DevCheck {
	// Bot Masters
	static BotMaster(message) {
		return new Promise((resolve, reject) => {
			try {
				let master;
				const msgAuthor = message.author.id;
				const serverOwnerList = process.env.SERVER_OWNER.split(/,+/g);
				const botMasterList = process.env.BOT_MASTER.split(/,+/g);
				const serverOwnerArray = serverOwnerList.map(obj => {
					return obj.trim();
				});
				const botMasterArray = botMasterList.map(obj => {
					return obj.trim();
				});
				const serverOwner = serverOwnerArray.filter(obj => obj === msgAuthor).toString();
				const botMaster = botMasterArray.filter(obj => obj === msgAuthor).toString();
				if (msgAuthor === serverOwner || msgAuthor === botMaster) {
					master = true;
				}
				const isMaster = master;
				resolve(isMaster || false);
			} catch(err) {
				reject(err);
			}
		});
	}
	// Bot Master Role
	static BotMasterRole(message) {
		return new Promise(async (resolve, reject) => {
			try {
				let masterRole;
				const guild = await message.client.guilds.fetch(process.env.SERVER_ID);
				const member = await guild.members.fetch(message.author.id);
				const role = await member.roles.cache.get(process.env.BOT_MASTER_ROLE);
				if (role != null) {
					masterRole = true;
				}
				const hasRole = masterRole;
				resolve(hasRole || false);
			} catch(err) {
				reject(err);
			}
		});
	}
	// Bot Channel
	static BotChannel(message) {
		return new Promise((resolve, reject) => {
			try {
				let channel;
				const msgChannel = message.channelId;
				const botChannelList = process.env.BOT_CHANNEL.split(/,+/g);
				const botChannelArray = botChannelList.map(obj => {
					return obj.trim();
				});
				const botChannel = botChannelArray.filter(obj => obj === msgChannel).toString();
				if (msgChannel === botChannel) {
					channel = true;
				}
				const isChannel = channel;
				resolve(isChannel || false);
			} catch(err) {
				reject(err);
			}
		});
	}
	// Log Channel
	static LogChannel() {
		return new Promise((resolve, reject) => {
			try {
				const logChannelList = process.env.BOT_CHANNEL.split(/,+/g);
				const logChannelArray = logChannelList.map(obj => {
					return obj.trim();
				});
				const firstChannel = logChannelArray[0].toString();
				resolve(firstChannel || false);
			} catch(err) {
				reject(err);
			}
		});
	}
}

module.exports.DevCheck = DevCheck;