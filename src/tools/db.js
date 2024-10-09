// Require SQLite functions
const { Create } = require("./functions/sql/Create.js");
const { Get } = require("./functions/sql/Get.js");
const { Set } = require("./functions/sql/Set.js");
const { Del } = require("./functions/sql/Del.js");
const { SQL } = require("./functions/sql/SQL.js");

// Export SQLite functions
exports.Create = Create;
exports.Get = Get;
exports.Set = Set;
exports.Del = Del;
exports.SQL = SQL;