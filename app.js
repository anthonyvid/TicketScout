const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("cookie-session");
const dotenv = require("dotenv");
const passport = require("passport");

const app = express();

console.log("in app.js");

app.use(express.json());
app.use(express.static("public"));

// Passport Config
require("./config/passport")(passport);

//Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
		cookie: { _expires: 36000000 }, //10 hour cookie
	})
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	res.locals.logout_msg = req.flash("logout_msg");
	res.locals.invalid_auth = req.flash("invalid_auth");
	res.locals.welcome_back = req.flash("welcome_back");
	res.locals.success_update = req.flash("success_update");
	next();
});

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Routes
app.use("/", require("./routes/userRouter"));
app.use("/admin", require("./routes/adminRouter"));

app.listen(process.env.PORT);

module.exports = app;
