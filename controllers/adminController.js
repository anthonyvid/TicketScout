import Admin from "../models/Admin.js";

// Admin Register Page
export const renderRegister = function (req, res) {
	res.render("logged-out/adminRegister", {
		layout: "layouts/logged-out-layout",
	});
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
