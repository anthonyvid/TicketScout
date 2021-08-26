import Admin from "../models/Admin.js";

// Admin Register Page
export const renderRegister = function (req, res) {
	res.render("logged-out/adminRegister", {
		layout: "layouts/logged-out-layout",
	});
};

export const deleteTicket = async function (req, res) {
	const admin = new Admin();
	await admin.deleteTicket(req.user.storename, req.body.item);
	res.status(204).send();
};

// Admin Register Handle
export const register = async function (req, res) {
	let admin = new Admin(req.body);
	const result = await admin.register();
	admin.sendEmailVerification(req.body.email);
	// No errors means passed registration
	if (!result) {
		req.flash("success_msg", "Please verify your email address");
		res.redirect("/");
	} else {
		const [errors, data] = result;
		let { fullname, email, storename, password, passwordConfirm } = data;

		res.render("logged-out/adminRegister", {
			layout: "layouts/logged-out-layout",
			errors: Object.values(errors),
			fullname: !errors.fullname ? fullname : undefined,
			email: !errors.email ? email : undefined,
			storename: !errors.storename ? storename : undefined,
			password: !errors.password ? password : undefined,
			passwordConfirm: !errors.passwordConfirm
				? passwordConfirm
				: undefined,
		});
	}
};

export const inviteEmployee = async function (req, res) {
	const admin = new Admin();
	const result = await admin.inviteEmployee(req.body.email);

	if (!result) res.json({ emailError: "Invalid Email" });
	else res.json({});
};

export const removeEmployee = async function (req, res) {
	const admin = new Admin();
	const result = await admin.removeEmployee(
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

export const getEmployeesTimeclockHistory = async function (req, res) {
	const admin = new Admin();
	const { employeesClockHistory, payPeriod } =
		await admin.getEmployeesTimeclockHistory(
			req.user.storename,
			req.body.fromDate,
			req.body.toDate
		);

	res.json({ employeesClockHistory, payPeriod });
};

export const addCategory = async function (req, res) {
	const admin = new Admin();
	await admin.addCategory(req.user.storename, req.body.category);
	res.status(204).send();
};

export const removeCategory = async function (req, res) {
	const admin = new Admin();
	await admin.removeCategory(req.user.storename, req.body.category);
	res.status(204).send();
};

export const updateStoreTaxRate = async function (req, res) {
	const admin = new Admin();
	await admin.updateStoreTaxRate(req.user.storename, req.body.taxRate);
	res.status(204).send();
};

export const updateStoreAddress = async function (req, res) {
	const admin = new Admin();
	await admin.updateStoreAddress(req.user.storename, req.body);
	res.status(204).send();
};

export const updateTicketStatusSettings = async function (req, res) {
	const admin = new Admin();
	await admin.updateTicketStatusSettings(req.user.storename, req.body);
	res.status(204).send();
};
export const deleteTicketStatusSettings = async function (req, res) {
	const admin = new Admin();
	await admin.deleteTicketStatusSettings(req.user.storename, req.body);
	res.status(204).send();
};

export const addIssue = async function (req, res) {
	const admin = new Admin();
	await admin.addIssue(req.user.storename, req.body.issue);
	res.status(204).send();
};
export const removeIssue = async function (req, res) {
	const admin = new Admin();
	await admin.removeIssue(req.user.storename, req.body.issue);
	res.status(204).send();
};

export const deletePayment = async function (req, res) {
	const admin = new Admin();
	await admin.deletePayment(req.user.storename, req.body.item);
	res.status(204).send();
};

export const deleteCustomer = async function (req, res) {
	const admin = new Admin();
	await admin.deleteCustomer(req.user.storename, req.body.item);
	res.status(204).send();
};
