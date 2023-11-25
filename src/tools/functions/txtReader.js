/* eslint-disable no-console */
const fs = require("node:fs");

class TextFileReader {

	static read(txtfile, message) {
		const file_path = `data/text/${txtfile}.txt`;
		function readed(file, callback) {
			fs.readFile(file, "utf8", function(err, data) {
				if (err) {
					console.log(err);
				}
				callback(data);
			});
		}
		return new Promise((resolve, reject) => {
			try {
				let mention = message.author.id;
				if (mention !== null) { mention = `<@${message.author.id}>`; }
				if (mention == null) { mention = "User"; }
				readed(file_path, async function(data) {
					let data_in = data.replace("%s", mention);

					if (data_in.length >= 1999) data_in = data_in.split("\n\n");
					// handle crlf line endings
					if (data_in.length === 1) data_in = data_in[0].split("\r\n\r\n");

					resolve(data_in || "");
				});
			} catch(err) {
				reject(err);
			}
		});
	}
}
module.exports.TextFileReader = TextFileReader;