// const dotenv = require("dotenv");
// dotenv.config();
const mongoose = require("mongoose");
const db = mongoose.connection;

mongoose.connect(process.env.CONNECTIONSTRING, {
	useNewUrlParser: true,
});

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

// //open connection to databse
// const dbConnect = function (url = process.env.CONNECTIONSTRING) {
// 	mongoose
// 		.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
// 		.catch((err) => {
// 			console.error(err);
// 		});
// };

// module.exports = dbConnect;
