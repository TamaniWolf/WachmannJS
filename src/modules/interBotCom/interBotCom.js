/* eslint-disable no-console */
class Canni {
	static Response(message) {
		const msgLow = message.content.toLowerCase();
		const msgSplit = msgLow.split(" ");
		if (msgSplit.indexOf(`<@${process.env.WACHMANN_ID}>`) >= 0) {
			if (msgSplit.indexOf("boops") >= 0) messageDelay(message, boops("canni"), 1000);
			if (msgSplit.indexOf("baps") >= 0) messageDelay(message, baps("canni"), 1000);
			// return;
		}
		if (msgSplit.indexOf(`<@${process.env.WACHMANN_ID}>`) < 0) {
			if (msgLow.indexOf("merry christmas") >= 0) messageDelay(message, xmas("canni"), 2000);
			if (msgLow.indexOf("happy new year") >= 0) messageDelay(message, newYear("canni"), 2000);
			// return;
		}
	}
}
class Sani {
	static Response(message) {
		// Placeholder responses
		const msgLow = message.content.toLowerCase();
		const msgSplit = msgLow.split(" ");
		if (msgSplit.indexOf(`<@${process.env.WACHMANN_ID}>`) >= 0) {
			if (msgLow.indexOf("hey hun~") >= 0) {
				setTimeout(function() {
					message.channel.send({ content: "Hey Sweetie~" });
				}.bind(this), 2200);
			}
			if (msgLow.indexOf("Oooh...") >= 0) {
				message.channel.send({ content: "Tja ^_^'" });
			}
			// return;
		}
		if (msgSplit.indexOf(`<@${process.env.WACHMANN_ID}>`) < 0) {
			return;
		}
	}
}
// Message Content
const newYear = function(fromBot) {
	let msgContent;
	if (fromBot === "canni") msgContent = "Happy New Year! The only day that I'm off duty.";
	if (fromBot === "sani") msgContent = "Happy New Year! The only day that I'm off duty.";
	return { content: msgContent };
};
const xmas = function(fromBot) {
	let msgContent;
	if (fromBot === "canni") msgContent = "I'm still on duty. But Merry Christmas to all of you as well and enjoy the festive days!";
	if (fromBot === "sani") msgContent = "I'm still on duty. But Merry Christmas to all of you as well and enjoy the festive days!";
	return { content: msgContent };
};
const baps = function(fromBot) {
	let msgContent;
	if (fromBot === "canni") msgContent = `Oof! <@${process.env.CANNI_ID}> What the hay!?`;
	if (fromBot === "sani") msgContent = `Oof! <@${process.env.SANI_ID}> What the hay!?`;
	return { content: msgContent };
};
const boops = function(fromBot) {
	let msgContent;
	if (fromBot === "canni") msgContent = `<@${process.env.CANNI_ID}> Hey, don't boop me.\nI have important work to do.`;
	if (fromBot === "sani") msgContent = `<@${process.env.SANI_ID}> Hey, don't boop me.\nI have important work to do.`;
	return { content: msgContent };
};
// Message send delay
function messageDelay(message, content, time) {
	setTimeout(function() {
		message.channel.send(content);
	}.bind(this), time);
}

module.exports.Canni = Canni;
module.exports.Sani = Sani;