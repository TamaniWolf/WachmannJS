/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const { WebhookType, ChannelType, SystemChannelFlagsBitField, Message, Interaction, Client, Guild } = require("discord.js");
const { DevCheck } = require("./functions/devCheck.js");
const { LanguageConvert } = require("./functions/languageConvert.js");
const PermissionConvert = require("./functions/permissionConvert.js");
const { TextFileReader } = require("./functions/txtReader.js");

const Utils = {

	/**
     * @param {String} string
     */
	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	/**
     * @param {String} str
     * @param  {Array<String>} args
     */
	parseReply(str, ...args) {
		let i = 0;
		args = args.flat();
		return str.replace(/%s/g, () => args[i++]);
	},

	/**
	 * @param {Message|Interaction} message The Message or Interaction Object
	 * @param {Object} content The Message content as Object
	 */
	async messageReply(message, content) {
		if (message.constructor === Message) {
			if (!message.guild.large) await message.reply(content);
			if (message.guild.large) await message.channel.send(content);
		} else {
			await message.reply(content);
		}
	},

	/**
	 * @param {Interaction} interaction The Interaction Object
	 * @param {Object} content The Interaction content as Object
	 */
	async interactionReply(interaction, content) {
		await interaction.reply(content);
	},

	/**
     * @param {Number} min
     * @param {Number} max
     * @param {Boolean} precise
     */
	getRandomIntFromInterval(min, max, precise = false) {
		if (precise) {
			return Math.random() * (max - min + 1) + min;
		}
		return Math.floor(Math.random() * (max - min + 1) + min);
	},

	/**
     * @param {Number} limit
     * @param {Boolean} precise
     */
	chancePercent(limit, precise = false) {
		return (Utils.getRandomIntFromInterval(0, 100, precise) <= limit);
	},

	/**
     * @param {Client} client
     * @param {String} type
     */
	get_Emoji(client, type) {
		const foundEmoji = client.emojis.cache.find(emoji => emoji.name.toLowerCase() === type.toLowerCase());

		if (foundEmoji) {
			return foundEmoji;
		}
		return "";
	},

	/**
     * @param {Guild} guild
     * @param {String} id
     */
	find_user_by_id(guild, id) {
		if (guild === null) {
			return null;
		}
		const member = guild.members.resolve(id);
		return member?.user;
	},

	/**
     * @param {String} env
     */
	test_ENV(env) {
		if (process.env[env]) {
			return true;
		} else {
			console.warn("Warning no ENV variable called: " + env);
			return false;
		}
	},

	/**
     * @param {Client} client
     * @param {String} id
     */
	guild_by_id(client, id) {
		return client.guilds.resolve(id);
	},

	/**
	 * @param {Number} seconds
	 * @returns {String|null}
	 */
	rateLimitPerUser(seconds) {
		let rateLimitValue = null;
		if (seconds === 0) rateLimitValue = "OFF";
		if (seconds === 5) rateLimitValue = "5s";
		if (seconds === 10) rateLimitValue = "10s";
		if (seconds === 15) rateLimitValue = "15s";
		if (seconds === 30) rateLimitValue = "30s";
		if (seconds === 60) rateLimitValue = "1m";
		if (seconds === 120) rateLimitValue = "2m";
		if (seconds === 300) rateLimitValue = "5m";
		if (seconds === 600) rateLimitValue = "10m";
		if (seconds === 900) rateLimitValue = "15m";
		if (seconds === 1800) rateLimitValue = "30m";
		if (seconds === 3600) rateLimitValue = "1h";
		if (seconds === 7200) rateLimitValue = "2h";
		if (seconds === 21600) rateLimitValue = "6h";
		return rateLimitValue;
	},

	/**
	 * @param {Number} seconds
	 * @returns {String|null}
	 */
	defaultArchiveDuration(seconds) {
		let archiveDurationValue = null;
		if (seconds === 60) archiveDurationValue = "1 Hour";
		if (seconds === 1440) archiveDurationValue = "24 Hours";
		if (seconds === 4320) archiveDurationValue = "3 Days";
		if (seconds === 10080) archiveDurationValue = "1 Week";
		return archiveDurationValue;
	},

	/**
	 * @param {Number} bitfield
	 * @returns {String|null}
	 */
	systemChannelFlagsBitField(bitfield) {
		let sysChannelFlagsNames = "";
		const bitfields = new SystemChannelFlagsBitField(bitfield);
		if (bitfields.has(SystemChannelFlagsBitField.Flags.SuppressGuildReminderNotifications)) {
			sysChannelFlagsNames += "Suppress Guild Reminder Notifications\n";
		}
		if (bitfields.has(SystemChannelFlagsBitField.Flags.SuppressJoinNotificationReplies)) {
			sysChannelFlagsNames += "Suppress Join Notification Replies\n";
		}
		if (bitfields.has(SystemChannelFlagsBitField.Flags.SuppressJoinNotifications)) {
			sysChannelFlagsNames += "Suppress Join Notifications\n";
		}
		if (bitfields.has(SystemChannelFlagsBitField.Flags.SuppressPremiumSubscriptions)) {
			sysChannelFlagsNames += "Suppress Premium Subscriptions\n";
		}
		if (bitfields.has(SystemChannelFlagsBitField.Flags.SuppressRoleSubscriptionPurchaseNotificationReplies)) {
			sysChannelFlagsNames += "Suppress Role Subscription Purchase Notification Replies\n";
		}
		if (bitfields.has(SystemChannelFlagsBitField.Flags.SuppressRoleSubscriptionPurchaseNotifications)) {
			sysChannelFlagsNames += "Suppress Role Subscription Purchase Notifications\n";
		}
		if (sysChannelFlagsNames === "") sysChannelFlagsNames = null;
		return sysChannelFlagsNames;
	},

	/**
	 * @param {Number} int
	 * @returns {String|null}
	 */
	channel_type_name(int) {
		let channelTypeName = null;
		if (int == ChannelType.AnnouncementThread) channelTypeName = "Announcement Thread";
		if (int == ChannelType.DM) channelTypeName = "DM";
		if (int == ChannelType.GroupDM) channelTypeName = "Group DM";
		if (int == ChannelType.GuildAnnouncement) channelTypeName = "Announcement Channel";
		if (int == ChannelType.GuildCategory) channelTypeName = "Category";
		if (int == ChannelType.GuildDirectory) channelTypeName = "Server Directory";
		if (int == ChannelType.GuildForum) channelTypeName = "Forum";
		if (int == ChannelType.GuildMedia) channelTypeName = "Media";
		if (int == ChannelType.GuildStageVoice) channelTypeName = "Stage";
		if (int == ChannelType.GuildText) channelTypeName = "Text Channel";
		if (int == ChannelType.GuildVoice) channelTypeName = "Voice Channel";
		if (int == ChannelType.PrivateThread) channelTypeName = "Private Thread";
		if (int == ChannelType.PublicThread) channelTypeName = "Public Thread";
		return channelTypeName;
	},

	/**
	 * @param {Number} int
	 * @returns {String|null}
	 */
	webhook_type(int) {
		let webhookTypeName = null;
		if (int == WebhookType.Incoming) webhookTypeName = "Incoming";
		if (int == WebhookType.ChannelFollower) webhookTypeName = "Channel Follower";
		if (int == WebhookType.Application) webhookTypeName = "Application";
		return webhookTypeName;
	},

	/**
	 * @param {String} type "hex" or "int"
	 * @param {String|Number} code
	 * @returns {String|Number|null}
	 */
	convert_color_code(type, code) {
		let colorCode = null;
		if (type === "hex") {
			colorCode = code.toString();
			colorCode = parseInt(colorCode, 16);
			if (isNaN(colorCode)) colorCode = 0;
		}
		if (type === "int") {
			colorCode = Number(code).toString(16);
			colorCode = parseInt(colorCode, 16);
			if (colorCode === "0") colorCode = "#000000";
		}
		return colorCode;
	},

	/**
     * @param { [month: number, day: number] } date The Month and Day
     * @param {Number} [range] The number of days to range
     */
	check_date(date, range) {
		const today = new Date();
		const month = today.getMonth() + 1;
		const day = today.getDate();
		if (date[0] === month) {
			if (day - range <= date[1] && date[1] <= day + range) {
				return true;
			}
		}
		return false;
	}

};

module.exports.Utils = Utils;

module.exports.DevCheck = DevCheck;
module.exports.LanguageConvert = LanguageConvert;
module.exports.PermissionConvert = PermissionConvert;
module.exports.TextFileReader = TextFileReader;