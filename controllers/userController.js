const User = require("../models/User");
const passport = require("passport");
const { json } = require("express");
const fetch = require("node-fetch");

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
exports.renderCreateNewPayment = async function (req, res) {
	const user = new User();
	const paymentSettings = await user.getPaymentSettings(req.user.storename);

	res.render(`logged-in/create-new-payment`, {
		layout: "layouts/logged-in-layout",
		user: req.user,
		payments: paymentSettings,
	});
};

// Logout Handle
exports.logout = async function (req, res) {
	req.logout();
	req.flash("logout_msg", "You are logged out");
	res.redirect("/");
};

// Dashboard Page
exports.renderDashboard = async function (req, res) {
	const user = new User();
	const [result, store] = await user.updateTicketList(req.user.storename);

	res.render("logged-in/dashboard", {
		layout: "layouts/logged-in-layout",
		user: req.user,
		tickets: result,
		store: store,
	});
};

// Tickets Page
exports.renderStoreTickets = async function (req, res) {
	const user = new User();
	const [result, store] = await user.updateTicketList(req.user.storename);

	res.render("logged-in/tickets", {
		layout: "layouts/logged-in-layout",
		user: req.user,
		tickets: result,
		store: store,
	});
};

exports.renderStoreCustomers = async function (req, res) {
	const user = new User();
	const [result, store] = await user.updateCustomerList(req.user.storename);
	res.render("logged-in/customers", {
		layout: "layouts/logged-in-layout",
		user: req.user,
		customers: result,
		store: store,
	});
};

exports.getPhone = async function (req, res) {
	const user = new User();
	const phone = await user.getPhone(req.body.id, req.user.storename);
	res.json({ phone: phone });
};
exports.updateTicketStatus = async function (req, res) {
	console.log(req.body);
	const user = new User();
	const [tickets, store] = await user.updateTicketStatus(
		req.body.selection,
		req.body.id,
		req.body.phone,
		req.user.storename
	);

	res.json({ tickets, store });
};
exports.updateTicketIssue = async function (req, res) {
	const user = new User();
	const tickets = await user.updateTicketIssue(
		req.body.selection,
		req.body.id,
		req.body.phone,
		req.user.storename
	);
	res.json({ tickets });
};

exports.getStore = async function (req, res) {
	const user = new User();
	const store = await user.getStore(req.user.storename);
	res.json({ store });
};
// Customers Page
// exports.renderStoreCustomers = function (req, res) {
// 	res.render("logged-in/customers", {
// 		layout: "layouts/logged-in-layout",
// 		user: req.user,
// 	});
// };

//Create new ticket handle
exports.createNewTicket = async function (req, res, next) {
	const user = new User();
	const result = await user.createNewTicket(req.body, req.user.storename);
	const [ticketError, data, ticketID] = result;

	// No errors
	if (Object.keys(ticketError).length === 0) {
		res.redirect(`/tickets/${ticketID}`);
	} else {
		console.log("failed");
		res.render("logged-in/create-new-ticket", {
			layout: "layouts/logged-in-layout",
			user: req.user,
			ticketError: Object.values(ticketError),
			firstname: data.firstname,
			lastname: data.lastname,
			phone: undefined,
			email: data.email,
			subject: data.subject,
			description: data.description,
		});
	}
};

exports.renderCustomerProfile = async function (req, res) {
	const user = new User();
	const result = await user.getCustomerData(
		req.user.storename,
		req.params.phone
	);
	res.render("logged-in/customer-profile", {
		layout: "layouts/logged-in-layout",
		user: req.user,
		customer: result,
	});
};
exports.renderTicketProfile = async function (req, res) {
	const user = new User();
	const result = await user.getTicketData(
		req.user.storename,
		req.params.ticketID
	);
	const store = await user.getStore(req.user.storename);

	res.render("logged-in/ticket-profile", {
		layout: "layouts/logged-in-layout",
		user: req.user,
		ticket: result,
		ticketID: req.params.ticketID,
		store: store,
	});
};

exports.sendSms = async function (req, res) {
	const user = new User();
	const msg = await user.sendSms(
		req.user.storename,
		req.body.toPhone,
		req.body.message
	);
	res.json({ msg: msg });
};

exports.receiveSms = async function (req, res) {
	const user = new User();
	console.log(req.client);
	await user.receiveSms(req.body);
	res.status(204).send();
};

exports.updateTicketShippingInfo = async function (req, res) {
	const user = new User();
	await user.updateTicketShippingInfo(req.body, req.user.storename);
};

exports.updateTicketInfo = async function (req, res) {
	const user = new User();
	await user.updateTicketInfo(req.user.storename, req.body, req.body.phone);
};
exports.updateCustomerContactInfo = async function (req, res) {
	const user = new User();
	const [updateErrors, newPhone] = await user.updateCustomerContactInfo(
		req.user.storename,
		req.body
	);

	// No errors
	if (Object.keys(updateErrors).length === 0) {
		req.flash("success_update", "Successfully Updated Information");
		if (req.body.sentFrom === "customer")
			res.redirect(`/customers/${newPhone}`);
		res.redirect(`/tickets/${req.body.sentFrom.replace(/\D/g, "")}`);
	} else {
		console.log("errors");

		const previousData = await user.getCustomerData(
			req.user.storename,
			req.body.oldPhone.trim().replace(/\D/g, "")
		);

		res.render(`logged-in/${req.body.sentFrom}-profile`, {
			layout: "layouts/logged-in-layout",
			updateErrors: Object.values(updateErrors),
			user: req.user,
			customer: previousData,
		});
	}
};

//Create new customer handle
exports.createNewCustomer = async function (req, res) {
	if (req.body.customerDataExists == "true") {
		res.render("logged-in/create-new-ticket", {
			layout: "layouts/logged-in-layout",
			user: req.user,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			phone: req.body.phone,
			email: req.body.email,
		});
	} else {
		const user = new User();
		const result = await user.createNewCustomer(
			req.body,
			req.user.storename
		);
		const [ticketError, data] = result;

		// No errors
		if (Object.keys(ticketError).length == 0) {
			res.redirect(`/customers/${data.phone}`);
		} else {
			res.render("logged-in/create-new-customer", {
				layout: "layouts/logged-in-layout",
				user: req.user,
				ticketError: Object.values(ticketError),
				firstname: data.firstname,
				lastname: data.lastname,
				phone: undefined,
				email: data.email,
			});
		}
	}
};

exports.createNewPayment = async function (req, res) {
	const user = new User();

	if (req.body.customerDataExists == "true") {
		const paymentSettings = await user.getPaymentSettings(
			req.user.storename
		);

		res.render("logged-in/create-new-payment", {
			layout: "layouts/logged-in-layout",
			user: req.user,
			payments: paymentSettings,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			phone: req.body.phone,
			email: req.body.email,
			linkedTicket:
				typeof req.body.linkedTicket !== "undefined"
					? req.body.linkedTicket
					: "",
		});
		return;
	}

	const result = await user.createNewpayment(req.body, req.user.storename);

	if (Object.keys(result).length == 0) {
		console.log("no errors");
	} else {
		console.log("errors");

		const paymentSettings = await user.getPaymentSettings(
			req.user.storename
		);

		res.render("logged-in/create-new-payment", {
			layout: "layouts/logged-in-layout",
			user: req.user,
			ticketError: Object.values(result),
			phone: undefined,
			payments: paymentSettings,
		});
	}
};
