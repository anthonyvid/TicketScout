import User from "../models/User.js";
import passport from "passport";

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

// Employee Register Page
export const renderEmployeeRegister = function (req, res) {
	res.render("logged-out/employeeRegister", {
		layout: "layouts/logged-out-layout",
	});
};
// Employee Register Handle
export const employeeRegister = async function (req, res) {
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
export const trackShipment = async function (req, res) {
	const user = new User();
	const result = await user.trackShipment(
		req.body.ticketID,
		req.user.storename
	);
	console.log(result);
	res.json({ result });
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

export const addIssue = async function (req, res) {
	const user = new User();
	await user.addIssue(req.user.storename, req.body.issue);
	res.status(204).send();
};
export const removeIssue = async function (req, res) {
	const user = new User();
	await user.removeIssue(req.user.storename, req.body.issue);
	res.status(204).send();
};

export const updateTicketStatusSettings = async function (req, res) {
	const user = new User();
	await user.updateTicketStatusSettings(req.user.storename, req.body);
	res.status(204).send();
};
export const deleteTicketStatusSettings = async function (req, res) {
	const user = new User();
	await user.deleteTicketStatusSettings(req.user.storename, req.body);
	res.status(204).send();
};

export const updateStoreAddress = async function (req, res) {
	const user = new User();
	await user.updateStoreAddress(req.user.storename, req.body);
	res.status(204).send();
};

export const updateStoreTaxRate = async function (req, res) {
	const user = new User();
	await user.updateStoreTaxRate(req.user.storename, req.body.taxRate);
	res.status(204).send();
};

export const addCategory = async function (req, res) {
	const user = new User();
	await user.addCategory(req.user.storename, req.body.category);
	res.status(204).send();
};
export const removeCategory = async function (req, res) {
	const user = new User();
	await user.removeCategory(req.user.storename, req.body.category);
	res.status(204).send();
};

export const getEmployeesTimeclockHistory = async function (req, res) {
	const user = new User();
	const { employeesClockHistory, payPeriod } =
		await user.getEmployeesTimeclockHistory(
			req.user.storename,
			req.body.fromDate,
			req.body.toDate
		);

	res.json({ employeesClockHistory, payPeriod });
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

export const renderCreateNewTicket = function (req, res) {
	res.render(`logged-in/create-new-ticket`, {
		layout: "layouts/logged-in-layout",
		user: req.user,
		phone: typeof req.body.phone !== "undefined" ? req.body.phone : "",
	});
};
export const renderCreateNewCustomer = function (req, res) {
	res.render(`logged-in/create-new-customer`, {
		layout: "layouts/logged-in-layout",
		user: req.user,
		phone: typeof req.body.phone !== "undefined" ? req.body.phone : "",
	});
};
export const renderCreateNewPayment = async function (req, res) {
	const user = new User();
	const paymentSettings = await user.getPaymentSettings(req.user.storename);

	res.render(`logged-in/create-new-payment`, {
		layout: "layouts/logged-in-layout",
		user: req.user,
		payments: paymentSettings,
		phone: typeof req.body.phone !== "undefined" ? req.body.phone : "",
	});
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
	const [result, store] = await user.updateTicketList(req.user.storename);

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

// Tickets Page
export const renderStoreTickets = async function (req, res) {
	const user = new User();
	const [result, store] = await user.updateTicketList(req.user.storename);

	res.render("logged-in/tickets", {
		layout: "layouts/logged-in-layout",
		user: req.user,
		tickets: result,
		store: store,
	});
};

export const renderStorePayments = async function (req, res) {
	const user = new User();
	const [result, store] = await user.updatePaymentsList(req.user.storename);
	res.render("logged-in/payments", {
		layout: "layouts/logged-in-layout",
		user: req.user,
		payments: result,
		store: store,
	});
};

export const renderStoreCustomers = async function (req, res) {
	const user = new User();
	const [result, store] = await user.updateCustomerList(req.user.storename);
	res.render("logged-in/customers", {
		layout: "layouts/logged-in-layout",
		user: req.user,
		customers: result,
		store: store,
	});
};

export const getPhone = async function (req, res) {
	const user = new User();
	const phone = await user.getPhone(req.body.id, req.user.storename);
	res.json({ phone: phone });
};
export const updateTicketStatus = async function (req, res) {
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
export const updateTicketIssue = async function (req, res) {
	const user = new User();
	const tickets = await user.updateTicketIssue(
		req.body.selection,
		req.body.id,
		req.body.phone,
		req.user.storename
	);
	res.json({ tickets });
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

//Create new ticket handle
export const createNewTicket = async function (req, res, next) {
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

export const renderCustomerProfile = async function (req, res) {
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
export const renderTicketProfile = async function (req, res) {
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

export const renderPaymentProfile = async function (req, res) {
	const user = new User();
	const result = await user.getPaymentData(
		req.user.storename,
		req.params.paymentNumber
	);

	const store = await user.getStore(req.user.storename);
	console.log(result);
	res.render("logged-in/payment-profile", {
		layout: "layouts/logged-in-layout",
		user: req.user,
		payment: result,
		paymentNumber: req.params.paymentNumber,
		store: store,
	});
};

export const sendSms = async function (req, res) {
	const user = new User();
	const msg = await user.sendSms(
		req.user.storename,
		req.body.ticketID,
		req.body.toPhone,
		req.body.message
	);
	res.json({ msg: msg });
};

export const receiveSms = async function (req, res) {
	const user = new User();
	console.log(req.client);
	await user.receiveSms(req.body);
	res.status(204).send();
};

export const updateTicketShippingInfo = async function (req, res) {
	const user = new User();
	await user.updateTicketShippingInfo(req.body, req.user.storename);
};

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

export const deleteTicket = async function (req, res) {
	const user = new User();
	await user.deleteTicket(req.user.storename, req.body.item);
	res.status(204).send();
};

export const deletePayment = async function (req, res) {
	const user = new User();
	await user.deletePayment(req.user.storename, req.body.item);
	res.status(204).send();
};

export const deleteCustomer = async function (req, res) {
	const user = new User();
	await user.deleteCustomer(req.user.storename, req.body.item);
	res.status(204).send();
};

export const updateTicketInfo = async function (req, res) {
	const user = new User();
	await user.updateTicketInfo(req.user.storename, req.body, req.body.phone);
};
export const updateCustomerContactInfo = async function (req, res) {
	const user = new User();
	const [updateErrors, newPhone] = await user.updateCustomerContactInfo(
		req.user.storename,
		req.body
	);

	// No errors
	if (Object.keys(updateErrors).length === 0) {
		req.flash("success_update", "Successfully Updated Information");
		if (req.body.sentFrom === "customer") {
			res.redirect(`/customers/${newPhone}`);
		} else {
			res.redirect(`/tickets/${req.body.sentFrom.replace(/\D/g, "")}`);
		}
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
export const createNewCustomer = async function (req, res) {
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

export const createNewPayment = async function (req, res) {
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
