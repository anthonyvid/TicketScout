const User = require("../models/User");
const passport = require("passport");
const { json } = require("express");

// Login Page
exports.renderLogin = function (req, res) {
	res.render("logged-out/login", { layout: "layouts/logged-out-layout" });
};
// Login Handle
exports.login = async function (req, res, next) {
	passport.authenticate("local", {
		successRedirect: "/dashboard",
		failureRedirect: "/",
		failureFlash: true,
	})(req, res, next);
};

// Employee Register Page
exports.renderEmployeeRegister = function (req, res) {
	res.render("logged-out/employeeRegister", {
		layout: "layouts/logged-out-layout",
	});
};
// Employee Register Handle
exports.employeeRegister = async function (req, res) {
	const user = new User(req.body);
	const result = await user.employeeRegister();

	// No errors means passed registration
	if (!result) {
		req.flash("success_msg", "You are now registered and can log in");
		res.redirect("/");
	} else {
		const [registrationErrors, data] = result;
		let { fullname, email, signUpCode, password, passwordConfirm } = data;

		if (registrationErrors.hasOwnProperty("fullname")) {
			fullname = undefined;
		}
		if (registrationErrors.hasOwnProperty("email")) {
			email = undefined;
		}
		if (registrationErrors.hasOwnProperty("password")) {
			password = undefined;
		}
		if (registrationErrors.hasOwnProperty("passwordConfirm")) {
			passwordConfirm = undefined;
		}
		if (registrationErrors.hasOwnProperty("signUpCode")) {
			signUpCode = undefined;
		}

		res.render("logged-out/employeeRegister", {
			layout: "layouts/logged-out-layout",
			errors: Object.values(registrationErrors),
			fullname,
			email,
			signUpCode,
			password,
			passwordConfirm,
		});
	}
};

// Track shipment handle
exports.trackShipment = async function (req, res) {
	const user = new User();
	const result = await user.trackShipment(req.body, req.user);

	// // If errors found when tracking shipment
	// if (result.hasOwnProperty("tracking_error")) {
	// 	console.log("invalid tracking ");
	// 	res.redirect("logged-in/dashboard", {
	// 		layout: "layouts/logged-in-layout",
	// 		user: req.user,
	// 		result: Object.values(result),
	// 	});
	// }

	// // No errors found
	// console.log("passed tracking");
	// res.redirect("logged-in/dashboard", {
	// 	layout: "layouts/logged-in-layout",
	// 	user: req.user,
	// });
};

// Password Recovery Page
exports.renderRecovery = function (req, res) {
	res.render("logged-out/recovery", { layout: "layouts/logged-out-layout" });
};
// Password Recovery Handle
exports.forgotPassword = async function (req, res) {
	let user = new User();
	const result = await user.forgotPassword(req.body);

	if (typeof result == "undefined" || !result["error"]) {
		res.render("logged-out/recovery", {
			layout: "layouts/logged-out-layout",
			success: true,
		});
	} else if (result["error"]) {
		// If Invalid Email
		if (result.hasOwnProperty("error")) {
			res.render("logged-out/recovery", {
				layout: "layouts/logged-out-layout",
				result: Object.values(result),
				success: undefined,
			});
		}
	}
};
exports.renderAccountSettings = function (req, res) {
	res.render(`logged-in/account-settings`, {
		layout: "layouts/logged-in-layout",
		user: req.user,
	});
};

exports.renderCreateNewTicket = function (req, res) {
	res.render(`logged-in/create-new-ticket`, {
		layout: "layouts/logged-in-layout",
		user: req.user,
	});
};
exports.renderCreateNewCustomer = function (req, res) {
	res.render(`logged-in/create-new-customer`, {
		layout: "layouts/logged-in-layout",
		user: req.user,
	});
};
exports.renderCreateNewInvoice = function (req, res) {
	res.render(`logged-in/create-new-invoice`, {
		layout: "layouts/logged-in-layout",
		user: req.user,
	});
};
exports.renderCreateNewEstimate = function (req, res) {
	res.render(`logged-in/create-new-estimate`, {
		layout: "layouts/logged-in-layout",
		user: req.user,
	});
};

// Logout Handle
exports.logout = async function (req, res) {
	req.logout();
	req.flash("logout_msg", "You are logged out");
	res.redirect("/");
};

// Dashboard Page
exports.renderDashboard = function (req, res) {
	res.render("logged-in/dashboard", {
		layout: "layouts/logged-in-layout",
		user: req.user,
	});
};

// Tickets Page
exports.renderTickets = function (req, res) {
	res.render("logged-in/tickets", {
		layout: "layouts/logged-in-layout",
		user: req.user,
	});
};

//Create new ticket handle
exports.createNewTicket = function (req, res) {
	console.log(req.body);
};
