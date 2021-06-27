if (process.env.NODE_ENV !== "production") {
	require("dotenv").parse();
	dotenv.config();
}

const express = require("express");
const app = express();
const router = require("./router");
// const dbConnect = require("./mongoDb");

// const MongoStore = require("connect-mongodb-session")(session);
// const session = require("express-session");

// let sessionOptions = session({
// 	secret: "dsfjkopFdsvfjvf",
// 	store: new MongoStore({
// 		uri: process.env.CONNECTIONSTRING,
// 		collection: "sessions",
// 	}),
// 	resave: false,
// 	saveUninitialized: false,
// 	cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
// });

// app.use(sessionOptions);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

//where views are coming from
app.set("views", "views");
app.set("view engine", "ejs");

app.use("/", router);

//set port
app.listen(process.env.PORT || 3000);

module.exports = app;
