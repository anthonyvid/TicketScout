import express from "express";
import expressLayouts from "express-ejs-layouts";
import flash from "connect-flash";
import session from "cookie-session";
import passport from "passport";
import { db, configMongoConnection } from "./db.js";
const app = express();

//Connect to mongoDB
configMongoConnection();

app.use(express.json());
app.use(express.static("public"));

// Passport Config
import passportConfig from "./config/passport.js";
passportConfig(passport);

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
import userRouter from "./routes/userRouter.js";
import adminRouter from "./routes/adminRouter.js";
import ticketRouter from "./routes/ticketRouter.js";
import customerRouter from "./routes/customerRouter.js";
import paymentRouter from "./routes/paymentRouter.js";
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/tickets", ticketRouter);
app.use("/customers", customerRouter);
app.use("/payments", paymentRouter);

app.listen(process.env.PORT);

export default app;
