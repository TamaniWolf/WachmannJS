// Require SQLite functions
const { Get } = require("./Get.js");
const { Set } = require("./Set.js");
const { Del } = require("./Del.js");
const { DB } = require("./DB.js");

// Export SQLite functions
exports.Get = Get;
exports.Set = Set;
exports.Del = Del;
exports.DB = DB;