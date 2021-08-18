if (process.env.NODE_ENV !== "production") {
	const dotenv = require("dotenv");
	dotenv.config();
}

const mongoose = require("mongoose");
const db = mongoose.connection;

mongoose
	.connect(process.env.CONNECTIONSTRING, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((response) => {
		console.log("Connected to Mongoose");
		const app = require("./app");
	})
	.catch((err) => {
		console.log("Mongodb is not connected: ", err);
	});

module.exports = db;
