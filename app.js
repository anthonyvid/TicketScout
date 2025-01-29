import express from "express";
import expressLayouts from "express-ejs-layouts";
import flash from "connect-flash";
import session from "express-session"; // Changed to express-session
import passport from "passport";
import { configMongoConnection } from "./db.js";
import compression from "compression";

if (process.env.NODE_ENV === "development") {
	let dotenv;
	dotenv = await import("dotenv");
	dotenv.config();
}

const app = express();

// Connect to MongoDB
configMongoConnection();

app.use(compression());
app.use(express.json());
app.use(express.static("public"));

// Passport Config
import passportConfig from "./config/passport.js";
passportConfig(passport);

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session (Changed to express-session)
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false, // Set to false to avoid unnecessary session saving
		saveUninitialized: false, // Set to false to avoid saving empty sessions
		cookie: { secure: false, maxAge: 36000000 }, // Make sure the cookie has an expiration
	})
);

// `Passport` middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Flash messages
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

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Routes
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
