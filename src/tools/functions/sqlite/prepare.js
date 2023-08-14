// Require SQLite functions
const { Get } = require("./Get");
const { Set } = require("./Set");
const { Del } = require("./Del");
const { DB } = require("./DB");

// Export SQLite functions
exports.Get = Get;
exports.Set = Set;
exports.Del = Del;
exports.DB = DB;