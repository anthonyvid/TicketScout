import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import { getStore } from "../models/Helper.js";
import passport from "passport";

export const logout = async function (req, res) {
	req.logout();
	req.flash("logout_msg", "You are logged out");
	res.redirect("/");
};

export const renderLogin = function (req, res) {
	res.render("logged-out/login", { layout: "layouts/logged-out-layout" });
};

export const renderRecovery = function (req, res) {
	res.render("logged-out/recovery", { layout: "layouts/logged-out-layout" });
};

export const renderPasswordRecovery = function (req, res) {
	res.render("logged-out/passwordRecovery", {
		layout: "layouts/logged-out-layout",
	});
};

export const renderEmployeeRegister = function (req, res) {
	res.render("logged-out/employeeRegister", {
		layout: "layouts/logged-out-layout",
		fullname: undefined,
		email: undefined,
		signUpCode: undefined,
		password: undefined,
		passwordConfirm: undefined,
	});
};

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

export const renderResetPassword = function (req, res) {
	res.render("logged-out/resetPassword", {
		layout: "layouts/logged-out-layout",
	});
};

export const renderAccountSettings = async function (req, res) {
	const store = await getStore(req.user.storename);

	res.render(`logged-in/account-settings`, {
		layout: "layouts/logged-in-layout",
		user: req.user,
		store,
	});
};

export const getStoreData = async function (req, res) {
	const store = await getStore(req.user.storename);
	res.json({ store });
};

export const verifyUserExists = async function (req, res) {
	const user = new User();
	const verified = await user.verifyUserExists(req.params.id);

	if (!verified) {
		res.status(404).send("Not authorized");
	} else {
		req.flash("success_msg", "You are now verified and can log in");
		res.redirect("/");
	}
};

export const recoverPassword = async function (req, res) {
	const user = new User();
	const result = await user.recoverPassword(
		req.body.email,
		req.body.password,
		req.body.passwordConfirm
	);

	if (!Object.keys(result).length) {
		req.flash("success_msg", "Password successfully changed");
		res.redirect("/");
	} else {
		res.render("logged-out/passwordRecovery", {
			layout: "layouts/logged-out-layout",
			errors: Object.values(result),
		});
	}
};

export const login = async function (req, res, next) {
	passport.authenticate("local", {
		successRedirect: "/dashboard",
		failureRedirect: "/",
		failureFlash: true,
	})(req, res, next);
};

export const employeeRegister = async function (req, res) {
	const user = new User();
	const { errors, data } = await user.employeeRegister(req.body);

	let { fullname, email, signUpCode, password, passwordConfirm } = data;

	res.json({
		errors: Object.values(errors),
		fullname: !errors.fullname ? fullname : undefined,
		email: !errors.email ? email : undefined,
		signUpCode: !errors.signUpCode ? signUpCode : undefined,
		password: !errors.password ? password : undefined,
		passwordConfirm: !errors.passwordConfirm ? passwordConfirm : undefined,
	});
};

export const forgotPassword = async function (req, res) {
	let user = new User();
	const result = await user.forgotPassword(req.body.email);

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

export const updateAccountInfo = async function (req, res) {
	const user = new User();
	const emailError = await user.updateAccountInfo(req.user.email, req.body);

	if (!Object.keys(emailError).length) {
		req.flash("success_update", "Successfully Updated Information");
		res.redirect("/account-settings");
	} else {
		const store = await getStore(req.user.storename);

		res.render("logged-in/account-settings", {
			layout: "layouts/logged-in-layout",
			errors: Object.values(emailError),
			user: req.user,
			store,
		});
	}
};

export const changeAccountPassword = async function (req, res) {
	const user = new User();
	const passwordError = await user.changeAccountPassword(
		req.user.password,
		req.body
	);

	if (!Object.keys(passwordError).length) {
		req.flash("success_update", "Successfully Updated Information");
		res.redirect("/account-settings");
	} else {
		req.flash("logout_msg", Object.values(passwordError));
		res.redirect("/account-settings");
	}
};
