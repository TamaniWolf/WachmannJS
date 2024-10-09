// eslint-disable-next-line no-unused-vars
const { Message } = require("discord.js");
require("dotenv").config;

class DevCheck {
	// Bot Masters
	/**
	 * check if User is Bot Master.
	 *
	 * @param {Number} userId The User ID
	 * @returns {Promise<boolean>} Boolean: True or False
	 */
	static forBotMaster(userId) {
		return new Promise((resolve, reject) => {
			try {
				let master = false;
				let memberId = [""];
				let serverOwnerList = [""];
				let botMasterList = [""];
				if (userId) memberId = userId;
				if (process.env.SERVER_OWNER) serverOwnerList = process.env.SERVER_OWNER.split(/,+/g);
				if (process.env.BOT_MASTER) botMasterList = process.env.BOT_MASTER.split(/,+/g);
				const serverOwnerArray = serverOwnerList.map(obj => {
					return obj.trim();
				});
				const botMasterArray = botMasterList.map(obj => {
					return obj.trim();
				});
				const serverOwner = serverOwnerArray.filter(obj => obj === memberId).toString();
				const botMaster = botMasterArray.filter(obj => obj === memberId).toString();
				if (memberId === serverOwner || memberId === botMaster) {
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
	/**
	 * Check if User has Bot Master Role.
	 *
	 * @param {Number} userId The User ID
	 * @returns {Promise<Boolean>} Boolean: True or False
	 */
	static forBotMasterRole(userId) {
		// eslint-disable-next-line no-async-promise-executor
		return new Promise(async (resolve, reject) => {
			try {
				let masterRole = false;
				// eslint-disable-next-line no-undef
				const guild = await globalclient.guilds.fetch(process.env.SERVER_ID);
				const member = await guild.members.fetch(userId);
				const role = member.roles.cache.get(process.env.BOT_MASTER_ROLE);
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
	/**
	 * Check if used Channel is Bot Channel.
	 *
	 * @param {Number} channelId The Channel ID
	 * @returns {Promise<Boolean>} Boolean: True or False
	 */
	static forBotChannel(channelId) {
		return new Promise((resolve, reject) => {
			try {
				let channel = false;
				const msgChannel = channelId;
				const botChannelList = process.env.BOT_CHANNEL.split(/,+/g);
				const botChannelArray = botChannelList.map(obj => {
					return obj.trim();
				});
				const botChannel = botChannelArray.filter(obj => obj === msgChannel).toString();
				if (msgChannel === botChannel) {
					channel = true;
				}
				const isChannel = channel;
				// if (firstChannel !== process.env.SERVER_ID) return;
				resolve(isChannel || false);
			} catch(err) {
				reject(err);
			}
		});
	}
	// Log Channel
	/**
	 * Check and get the Log Channel ID.
	 *
	 * @param {Number} guildId The Guild ID
	 * @returns {Promise<String>} The Log Channel ID
	 */
	static forLogChannel(guildId) {
		// eslint-disable-next-line no-async-promise-executor
		return new Promise(async (resolve, reject) => {
			try {
				// eslint-disable-next-line no-undef
				const getGuildObj = await globalclient.guilds.fetch(guildId);
				const logChannelList = process.env.LOG_CHANNEL.split(/,+/g);
				const logChannelArray = logChannelList.map(obj => {
					return obj.trim();
				});
				const logChannel = logChannelArray.filter(obj => getGuildObj.channels.cache.get(obj) !== undefined).toString();
				resolve(logChannel || "0");
			} catch(err) {
				reject(err);
			}
		});
	}
}

module.exports.DevCheck = DevCheck;