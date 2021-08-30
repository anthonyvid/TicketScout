import Admin from "../models/Admin.js";

export const renderRegister = function (req, res) {
	res.render("logged-out/adminRegister", {
		layout: "layouts/logged-out-layout",
		fullname: undefined,
		email: undefined,
		storename: undefined,
		password: undefined,
		passwordConfirm: undefined,
	});
};

export const registerAdmin = async function (req, res) {
	let admin = new Admin();
	const { errors, data } = await admin.registerAdmin(req.body);
	let { fullname, email, storename, password, passwordConfirm } = data;

	res.json({
		errors: Object.values(errors),
	});
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
