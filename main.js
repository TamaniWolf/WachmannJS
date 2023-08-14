/* eslint-disable no-console */
const { Application } = require("./src/core/application/Application.js");

// Application Start
Application.init();
Application.start();

// Application Stop
process.on("SIGINT", () => Application.stop());
process.on("SIGTERM", () => Application.stop());
process.on("exit", () => Application.stop());

// Error Listener
process.on("unhandledRejection", (e) => {
	console.error(e);
});
process.on("uncaughtException", (e, ee) => {
	console.error(ee);
	console.error(e);
});
// //--------END--------//