import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import passport from "passport";

export const verifyEmailExists = async function (req, res) {
	const user = new User();
	const verified = await user.verifyEmailExists(req.params.id);

	if (!verified) {
		res.send("Not authorized");
	} else {
		req.flash("success_msg", "You are now verified and can log in");
		res.redirect("/");
	}
};

// Login Page
export const renderLogin = function (req, res) {
	res.render("logged-out/login", { layout: "layouts/logged-out-layout" });
};
// Login Handle
export const login = async function (req, res, next) {
	passport.authenticate("local", {
		successRedirect: "/dashboard",
		failureRedirect: "/",
		failureFlash: true,
	})(req, res, next);
};

export const clockIn = async function (req, res) {
	const user = new User();
	await user.clockIn(req.user, req.body.clockInTime);
	res.status(204).send();
};
export const clockOut = async function (req, res) {
	const user = new User();
	await user.clockOut(req.user, req.body.clockOutTime);
	res.status(204).send();
};
export const liveSearchResults = async function (req, res) {
	const user = new User();
	const results = await user.liveSearchResults(
		req.user.storename,
		req.body.search
	);
	res.json({ results });
};

export const renderResetPassword = function (req, res) {
	res.render("logged-out/resetPassword", {
		layout: "layouts/logged-out-layout",
	});
};

// Employee Register Page
export const renderEmployeeRegister = function (req, res) {
	res.render("logged-out/employeeRegister", {
		layout: "layouts/logged-out-layout",
	});
};
// Employee Register Handle
export const employeeRegister = async function (req, res) {
	const user = new User();
	const result = await user.employeeRegister(req.body);

	// No errors means passed registration
	if (!result) {
		req.flash("logout_msg", "Please verify your email address");
		res.redirect("/");
	} else {
		const [registrationErrors, data] = result;
		let { fullname, email, signUpCode, password, passwordConfirm } = data;

		res.render("logged-out/employeeRegister", {
			layout: "layouts/logged-out-layout",
			errors: Object.values(registrationErrors),
			fullname: !errors.fullname ? fullname : undefined,
			email: !errors.email ? email : undefined,
			signUpCode: !errors.signUpCode ? signUpCode : undefined,
			password: !errors.password ? password : undefined,
			passwordConfirm: !errors.passwordConfirm
				? passwordConfirm
				: undefined,
		});
	}
};

// Password Recovery Page
export const renderRecovery = function (req, res) {
	res.render("logged-out/recovery", { layout: "layouts/logged-out-layout" });
};
// Password Recovery Handle
export const forgotPassword = async function (req, res) {
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
export const renderAccountSettings = async function (req, res) {
	const user = new User();
	const store = await user.getStore(req.user.storename);

	res.render(`logged-in/account-settings`, {
		layout: "layouts/logged-in-layout",
		user: req.user,
		store,
	});
};

export const updateAccountInfo = async function (req, res) {
	const user = new User();
	const emailError = await user.updateAccountInfo(req.user.email, req.body);

	if (Object.keys(emailError).length === 0) {
		req.flash("success_update", "Successfully Updated Information");
		res.redirect("/account-settings");
	} else {
		const store = user.getStore(req.user.storename);

		res.render("logged-in/account-settings", {
			layout: "layouts/logged-in-layout",
			errors: Object.values(emailError),
			user: req.user,
			store,
		});
	}
};

// Logout Handle
export const logout = async function (req, res) {
	req.logout();
	req.flash("logout_msg", "You are logged out");
	res.redirect("/");
};

// Dashboard Page
export const renderDashboard = async function (req, res) {
	const user = new User();
	const totalNewTickets = await user.getTotalTicketsForStatus(
		req.user.storename,
		"New"
	);
	const totalReplyTickets = await user.getTotalTicketsForStatus(
		req.user.storename,
		"Reply"
	);
	const totalPriorityTickets = await user.getTotalTicketsForStatus(
		req.user.storename,
		"Priority"
	);
	const [result, store] = await new Ticket().updateTicketList(
		req.user.storename
	);

	res.render("logged-in/dashboard", {
		layout: "layouts/logged-in-layout",
		user: req.user,
		tickets: result,
		store: store,
		totalNewTickets,
		totalPriorityTickets,
		totalReplyTickets,
	});
};

export const getStore = async function (req, res) {
	const user = new User();
	const store = await user.getStore(req.user.storename);
	res.json({ store });
};
// Customers Page
// const renderStoreCustomers = function (req, res) {
// 	res.render("logged-in/customers", {
// 		layout: "layouts/logged-in-layout",
// 		user: req.user,
// 	});
// };

export const changeAccountPassword = async function (req, res) {
	const user = new User();
	const passwordError = await user.changeAccountPassword(
		req.user.password,
		req.body
	);

	console.log(passwordError);

	if (Object.keys(passwordError).length == 0) {
		req.flash("success_update", "Successfully Updated Information");
		res.redirect("/account-settings");
	} else {
		req.flash("logout_msg", Object.values(passwordError));
		res.redirect("/account-settings");
	}
};
