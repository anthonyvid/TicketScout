import Admin from "../models/Admin.js";

export const renderRegister = function (req, res) {
	res.render("logged-out/adminRegister", {
		layout: "layouts/logged-out-layout",
	});
};

export const registerAdmin = async function (req, res) {
	let admin = new Admin();
	const result = await admin.registerAdmin(req.body);

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
	const result = await admin.inviteEmployee(
		req.body.email,
		req.body.signUpCode
	);
	if (!result) res.json({ emailError: "Invalid Email" });
	else res.json({});
};

export const deleteEmployee = async function (req, res) {
	const admin = new Admin();

	const result = await admin.deleteEmployee(
		req.user.storename,
		req.body.email
	);

	if (!result) res.json({ emailError: "Invalid Email" });
	else res.json({});
};

export const toggleAdminPermission = async function (req, res) {
	const admin = new Admin();

	const result = await admin.toggleAdminPermission(
		req.user.storename,
		req.body.email
	);
	if (!result) res.json({ emailError: "Invalid Email" });
	else res.json({});
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

export const getEmployeesTimeclockHistory = async function (req, res) {
	const admin = new Admin();
	const { employeesClockHistory, payPeriod } =
		await admin.getEmployeesTimeclockHistory(
			req.user.storename,
			req.body.fromDate,
			req.body.toDate
		);
	res.status(200).json({ employeesClockHistory, payPeriod });
};

export const addCategory = async function (req, res) {
	const admin = new Admin();
	await admin.addCategory(req.user.storename, req.body.category);
	res.status(200).send();
};

export const deleteCategory = async function (req, res) {
	const admin = new Admin();
	await admin.deleteCategory(req.user.storename, req.body.category);
	res.status(200).send();
};

export const updateStoreTaxRate = async function (req, res) {
	const admin = new Admin();
	await admin.updateStoreTaxRate(req.user.storename, req.body.taxRate);
	res.status(200).send();
};

export const updateStoreAddress = async function (req, res) {
	const admin = new Admin();
	await admin.updateStoreAddress(req.user.storename, req.body);
	res.status(200).send();
};

export const updateTicketStatusSettings = async function (req, res) {
	const admin = new Admin();
	await admin.updateTicketStatusSettings(req.user.storename, req.body);
	res.status(200).send();
};
export const deleteTicketStatusSettings = async function (req, res) {
	const admin = new Admin();
	await admin.deleteTicketStatusSettings(req.user.storename, req.body);
	res.status(200).send();
};

export const addIssue = async function (req, res) {
	const admin = new Admin();
	await admin.addIssue(req.user.storename, req.body.issue);
	res.status(200).send();
};
export const deleteIssue = async function (req, res) {
	const admin = new Admin();
	await admin.deleteIssue(req.user.storename, req.body.issue);
	res.status(200).send();
};
