/* eslint-disable no-console */
const fs = require("node:fs");

class TextFileReader {
	/**
	 * Read sections in Text files.
	 *
	 * @param {String} config The Read mode to use (paragraph or file)
	 * @param {String} filename The Name of the file
	 * @param {String} dirpath The Directory path to the file
	 * @param {String} [paragraph] (Optional) The Paragraph to use
	 * @returns {Promise<String>} The Text section
	 */
	static read(config, filename, dirpath, paragraph) {
		const file_path = `./${dirpath}/${filename}.txt`;
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
				readed(file_path, async function(data) {
					let data_in = data;
					if (config === "paragraph") {
						data_in = data_in.split("\n\n");
						// handle crlf line endings
						data_in = data_in[0].split("\r\n\r\n");

						if (Array.isArray(data_in)) {
							let text;
							data_in.forEach(async (item) => {

								if (item.startsWith(paragraph)) text = item;
								if (!item.startsWith(paragraph)) text = "";

								if (text.length >= 1999) console.error("Text Paragraph too long.");

								if (text.startsWith(paragraph)) {
									text = text.replace(paragraph, "");
									resolve(text || "");
								}
							});
						}
					} else if (config === "file") {
						if (data_in.length >= 1999) data_in = data_in.split("\n\n");
						// handle crlf line endings
						if (data_in.length === 1) data_in = data_in[0].split("\r\n\r\n");
						resolve(data_in || "");
					}
				});
			} catch(err) {
				reject(err);
			}
		});
	}
}
module.exports.TextFileReader = TextFileReader;