const fs = require("node:fs");
let help_list;

class Help {
	static start() {
		return new Promise(resolve => {
			const path = "./data/Text/help.txt";
			const prep = this.prepare_help;

			fs.readFile(path, function(err, buf) {
				if (err) console.error(err);
				help_list = prep(buf.toString());
			});

			return resolve(this);
		});
	}

	static prepare_help(data_in) {
		const pre = [];
		let tmp = "";

		data_in = data_in.split("\n\n");
		// handle crlf line endings
		if (data_in.length === 1) data_in = data_in[0].split("\r\n\r\n");
		const first = data_in.shift();

		data_in.forEach(function(item, index, array) {
			tmp += item + "\n";
			pre.push(tmp);

			if (tmp.length >= 1999) console.error("Help Paragraph too long.");

			tmp = (index === (array.length - 1)) ? "" : "\n";
		});

		pre.push(tmp);
		tmp = "";
		let count = 0;
		const res = [];
		res.push(first);

		pre.forEach(function(item) {
			if (count + item.length < 1999) {
				tmp += item;
				count += item.length;
			} else {
				res.push(tmp);
				tmp = item;
				count = item.length;
			}
		});

		res.push(tmp);
		return res;
	}
}
module.exports.Help = Help;