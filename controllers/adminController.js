const Admin = require("../models/Admin");

// Admin Register Page
exports.renderRegister = function (req, res) {
	res.render("logged-out/adminRegister", {
		layout: "layouts/logged-out-layout",
	});
};

// Admin Register Handle
exports.register = async function (req, res) {
	const { fullname, email, storename, password, passwordConfirm } = req.body;

	let admin = new Admin(req.body);
	const registrationErrors = await admin.register();

	if (registrationErrors.length) {
		// Errors During Registration
		res.render("logged-out/adminRegister", {
			layout: "layouts/logged-out-layout",
			registrationErrors,
			fullname,
			email,
			storename,
			password,
			passwordConfirm,
		});
	} else {
		res.send("passed Registration");
	}
};

// exports.inviteEmployee = async function (req, res) {
// 	console.log(req.body);
// 	let admin = new Admin(req.body);
// 	await admin.inviteEmployee(req.body);
// };
