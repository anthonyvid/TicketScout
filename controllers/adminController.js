import Admin from "../models/Admin.js";

// Admin Register Page
export const renderRegister = function (req, res) {
	res.render("logged-out/adminRegister", {
		layout: "layouts/logged-out-layout",
	});
};

// Admin Register Handle
export const register = async function (req, res) {
	let admin = new Admin();
	const result = await admin.register(req.body);

	// No errors means passed registration
	if (!Object.keys(result.errors).length) {
		req.flash("logout_msg", "Please verify your email address");
		res.redirect("/");
	} else {
		const { errors, data } = result;
		let { fullname, email, signUpCode, password, passwordConfirm } = data;

		res.render("logged-out/adminRegister", {
			layout: "layouts/logged-out-layout",
			errors: Object.values(errors),
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

export const inviteEmployee = async function (req, res) {
	const admin = new Admin();
	try {
		const result = await admin.inviteEmployee(
			req.body.email,
			req.body.signUpCode
		);

		if (!result) res.json({ emailError: "Invalid Email" });
		else res.json({});
	} catch (error) {
		console.error(error);
		res.status(400).send();
	}
};

export const removeEmployee = async function (req, res) {
	const admin = new Admin();
	try {
		const result = await admin.removeEmployee(
			req.user.storename,
			req.body.email
		);

		if (!result) res.json({ emailError: "Invalid Email" });
		else res.json({});
	} catch (error) {
		console.error(error);
		res.status(400).send();
	}
};

export const toggleAdminPermission = async function (req, res) {
	const admin = new Admin();
	try {
		const result = await admin.toggleAdminPermission(
			req.user.storename,
			req.body.email
		);
		if (!result) res.json({ emailError: "Invalid Email" });
		else res.json({});
	} catch (error) {
		console.error(error);
		res.status(400).send();
	}
};

export const getEmployeesTimeclockHistory = async function (req, res) {
	const admin = new Admin();

	try {
		const { employeesClockHistory, payPeriod } =
			await admin.getEmployeesTimeclockHistory(
				req.user.storename,
				req.body.fromDate,
				req.body.toDate
			);
		res.status(200).json({ employeesClockHistory, payPeriod });
	} catch (error) {
		console.error(error);
		res.status(400).send();
	}
};

export const addCategory = async function (req, res) {
	const admin = new Admin();
	try {
		await admin.addCategory(req.user.storename, req.body.category);
		res.status(200).send();
	} catch (error) {
		console.error(error);
		res.status(400).send();
	}
};

export const removeCategory = async function (req, res) {
	const admin = new Admin();
	try {
		await admin.removeCategory(req.user.storename, req.body.category);
		res.status(200).send();
	} catch (error) {
		console.error(error);
		res.status(400).send();
	}
};

export const updateStoreTaxRate = async function (req, res) {
	const admin = new Admin();
	try {
		await admin.updateStoreTaxRate(req.user.storename, req.body.taxRate);
		res.status(200).send();
	} catch (error) {
		console.error(error);
		res.status(400).send();
	}
};

export const updateStoreAddress = async function (req, res) {
	const admin = new Admin();
	try {
		await admin.updateStoreAddress(req.user.storename, req.body);
		res.status(200).send();
	} catch (error) {
		console.error(error);
		res.status(400).send();
	}
};

export const updateTicketStatusSettings = async function (req, res) {
	const admin = new Admin();
	try {
		await admin.updateTicketStatusSettings(req.user.storename, req.body);
		res.status(200).send();
	} catch (error) {
		console.error(error);
		res.status(400).send();
	}
};
export const deleteTicketStatusSettings = async function (req, res) {
	const admin = new Admin();
	try {
		await admin.deleteTicketStatusSettings(req.user.storename, req.body);
		res.status(200).send();
	} catch (error) {
		console.error(error);
		res.status(400).send();
	}
};

export const addIssue = async function (req, res) {
	const admin = new Admin();
	try {
		await admin.addIssue(req.user.storename, req.body.issue);
		res.status(200).send();
	} catch (error) {
		console.error(error);
		res.status(400).send();
	}
};
export const removeIssue = async function (req, res) {
	const admin = new Admin();
	try {
		await admin.removeIssue(req.user.storename, req.body.issue);
		res.status(200).send();
	} catch (error) {
		console.error(error);
		res.status(400).send();
	}
};

export const deletePayment = async function (req, res) {
	const admin = new Admin();
	try {
		await admin.deletePayment(req.user.storename, req.body.item);
		res.status(200).json({});
	} catch (error) {
		res.status(400).json({
			error: "Error deleting payment - contact support",
		});
	}
};

export const deleteTicket = async function (req, res) {
	const admin = new Admin();
	try {
		await admin.deleteTicket(req.user.storename, req.body.item);
		res.status(200).json({});
	} catch (error) {
		res.status(400).json({
			error: "Error deleting ticket - contact support",
		});
	}
};
