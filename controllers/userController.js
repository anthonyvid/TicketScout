const User = require("../models/User");
const passport = require("passport");

////////////////////////////////////////////////////

// Login Page
exports.renderLogin = function (req, res) {
	res.render("logged-out/login", { layout: "layouts/logged-out-layout" });
};
// Login Handle
exports.login = async function (req, res, next) {
	passport.authenticate("local", {
		successRedirect: "/overview",
		failureRedirect: "/",
		failureFlash: true,
	})(req, res, next);
};
////////////////////////////////////////////////////

// Employee Register Page
exports.renderEmployeeRegister = function (req, res) {
	res.render("logged-out/employeeRegister", {
		layout: "layouts/logged-out-layout",
	});
};
// Employee Register Handle
exports.employeeRegister = async function (req, res) {
	let user = new User(req.body);
	await user.employeeRegister();
};
////////////////////////////////////////////////////

// Password Recovery Page
exports.renderRecovery = function (req, res) {
	res.render("logged-out/recovery", { layout: "layouts/logged-out-layout" });
};
// Password Recovery Handle
exports.forgotPassword = async function (req, res) {
	let user = new User();
	const result = await user.forgotPassword(req.body);

	if (!result) {
		res.render("logged-out/recovery", {
			layout: "layouts/logged-out-layout",
			success: true,
		});
	} else {
		// If Invalid Email
		if (result.hasOwnProperty("email")) {
			console.log("errors");
			res.render("logged-out/recovery", {
				layout: "layouts/logged-out-layout",
				result: Object.values(result),
				success: undefined,
			});
		}
	}
};
////////////////////////////////////////////////////
//TODO: organize functions below

exports.renderOverview = function (req, res) {
	res.render("logged-in/overview", {
		layout: "layouts/logged-in-layout",
		user: req.user,
	});
};

exports.logout = async function (req, res) {
	req.logout();
	req.flash("logout_msg", "You are logged out");
	res.redirect("/");
};

// exports.tickets = function (req, res) {
// 	res.render("logged-in/tickets", { layout: "layouts/logged-in-layout" });
// };
