/* eslint-disable max-len */
/* eslint-disable no-console */
require("dotenv").config;
// Language
const lang = require(`../../../data/lang/${process.env.BOTLANG}/${process.env.BOTLANG}.json`);
const langIBC = lang.modules.interbotcom;
// eslint-disable-next-line no-unused-vars
const { Message } = require("discord.js");
const { Utils, LanguageConvert } = require("../../tools/utils.js");
const { writeFile } = require("node:fs");

class InterBotCom {
	/**
	 * @param {Message} message The Message Object
	 */
	static Init(message) {
		const ibcConfig = require("../../../config/application/interBotCom.json");
		const msgLow = message.content.toLowerCase();
		const msgSplit = msgLow.split(" ");
		if (msgSplit.indexOf(`<@${process.env.WACHMANN_ID}>`) >= 0) {
			if (message.author.id === process.env.CANNI_ID) this.canni(ibcConfig, message, msgSplit, msgLow);
			if (message.author.id === process.env.SANI_ID) this.sani(ibcConfig, message, msgSplit, msgLow);
		}
		if (msgSplit.indexOf(`<@${process.env.WACHMANN_ID}>`) < 0) {
			this.holidays(ibcConfig, message, msgSplit, msgLow);
		}
	}

	/**
	 * @param {Object} ibcConfig The config file
	 * @param {Message} message The Message Object
	 * @param {Array<String>} msgSplit The Split up message
	 * @param {String} msgLow The lowercased message
	 */
	// eslint-disable-next-line no-unused-vars
	static canni(ibcConfig, message, msgSplit, msgLow) {
		if (msgSplit.indexOf("boops") >= 0) messageSendDelay(message, boops("canni"), 1000);
		if (msgSplit.indexOf("baps") >= 0) messageSendDelay(message, baps("canni"), 1000);
	}

	/**
	 * @param {Object} ibcConfig The config file
	 * @param {Message} message The Message Object
	 * @param {Array<String>} msgSplit The Split up message
	 * @param {String} msgLow The lowercased message
	 */
	// eslint-disable-next-line no-unused-vars
	static sani(ibcConfig, message, msgSplit, msgLow) {
		if (msgSplit.indexOf("boops") >= 0) messageSendDelay(message, boops("sani"), 1000);
		if (msgSplit.indexOf("baps") >= 0) messageSendDelay(message, baps("sani"), 1000);
	}

	/**
	 * @param {Object} ibcConfig The config file
	 * @param {Message} message The Message Object
	 * @param {Array<String>} msgSplit The Split up message
	 * @param {String} msgLow The lowercased message
	 */
	// eslint-disable-next-line no-unused-vars
	static holidays(ibcConfig, message, msgSplit, msgLow) {
		const christmas_day = [12, 25];
		const newyear_day = [1, 1];
		let content = "";
		if (Utils.check_date(christmas_day, 1) && msgLow.indexOf("merry christmas") >= 0 && message.author.id === process.env.CANNI_ID) {
			if (!ibcConfig.holidays.xmas.run) {
				content = { content: langIBC.holidays.christmas };
				ibcConfig.holidays.xmas.run = true;
			}
		}
		if (!Utils.check_date(christmas_day, 1)) {
			if (ibcConfig.holidays.xmas.run) {
				ibcConfig.holidays.xmas.run = false;
			}
		}
		if (Utils.check_date(newyear_day, 0) && msgLow.indexOf("happy new year") >= 0 && message.author.id === process.env.CANNI_ID) {
			if (!ibcConfig.holidays.newyear.run) {
				content = { content: langIBC.holidays.newyear };
				ibcConfig.holidays.newyear.run = true;
			}
		}
		if (!Utils.check_date(newyear_day, 0)) {
			if (ibcConfig.holidays.newyear.run) {
				ibcConfig.holidays.newyear.run = false;
			}
		}

		if (ibcConfig != undefined) writeFile("config/application/interBotCom.json", JSON.stringify(ibcConfig), (error) => { if (error) throw error; });
		if (content !== "") messageSendDelay(message, content, 5000);
	}
}

const baps = function(fromBot) {
	let msgContent;
	if (fromBot === "canni") msgContent = LanguageConvert.lang(langIBC.tocanni.baps, process.env.CANNI_ID);
	if (fromBot === "sani") msgContent = LanguageConvert.lang(langIBC.tosani.baps, process.env.SANI_ID);
	return { content: msgContent };
};

const boops = function(fromBot) {
	let msgContent;
	if (fromBot === "canni") msgContent = LanguageConvert.lang(langIBC.tocanni.boops, process.env.CANNI_ID);
	if (fromBot === "sani") msgContent = LanguageConvert.lang(langIBC.tosani.boops, process.env.SANI_ID);
	return { content: msgContent };
};

// Message send delay
/**
 * @param {Message} message The Message Object
 * @param {Object} content The Resonds message
 * @param {Number} time Time in millisecond
 */
function messageSendDelay(message, content, time) {
	setTimeout(function() {
		message.channel.send(content);
	}.bind(this), time);
}

exports.InterBotCom = InterBotCom;