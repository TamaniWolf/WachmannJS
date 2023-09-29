class Canni {
	static Response(message) {
		const msgLow = message.content.toLowerCase();
		const msgSplit = msgLow.split(" ");
		if (msgSplit.indexOf(`<@${process.env.WACHMANN_ID}>`) >= 0) {
			if (msgSplit.indexOf("boops") >= 0) {
				setTimeout(function() {
					message.channel.send({ content: `<@${process.env.CANNI_ID}> Hey, don't boop me.\nI have important work to do.` });
				}.bind(this), 1500);
			}
			if (msgSplit.indexOf("baps") >= 0) {
				setTimeout(function() {
					message.channel.send({ content: `Oof! <@${process.env.CANNI_ID}> What the hay!?` });
				}.bind(this), 1000);
			}
		} else {
			if (msgLow.indexOf("merry christmas") >= 0) {
				setTimeout(function() {
					message.channel.send({ content: "I'm still on duty. But Merry Christmas to all of you as well and enjoy the festive days!" });
				}.bind(this), 2000);
			}
			if (msgLow.indexOf("happy new year") >= 0) {
				setTimeout(function() {
					message.channel.send({ content: "Happy New Year! The only day that I'm off duty." });
				}.bind(this), 2000);
			}
			// return;
		}
	}
}
class Sani {
	static Response(message) {
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
		} else {
			return;
		}
	}
}
module.exports.Canni = Canni;
module.exports.Sani = Sani;