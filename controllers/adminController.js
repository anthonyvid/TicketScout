const Admin = require("../models/Admin");

// Admin Register Page
exports.renderRegister = function (req, res) {
	res.render("logged-out/adminRegister", {
		layout: "layouts/logged-out-layout",
	});
};

// Admin Register Handle
exports.register = async function (req, res) {
	let admin = new Admin(req.body);
	const result = await admin.register();

	// No errors means passed registration
	if (!result) {
		req.flash("success_msg", "You are now registered and can log in");
		res.redirect("/");
	} else {
		const [registrationErrors, data] = result;
		let { fullname, email, storename, password, passwordConfirm } = data;

		if (registrationErrors.hasOwnProperty("fullname")) {
			fullname = undefined;
		}
		if (registrationErrors.hasOwnProperty("email")) {
			email = undefined;
		}
		if (registrationErrors.hasOwnProperty("storename")) {
			storename = undefined;
		}
		if (registrationErrors.hasOwnProperty("password")) {
			password = undefined;
		}
		if (registrationErrors.hasOwnProperty("passwordConfirm")) {
			passwordConfirm = undefined;
		}

		res.render("logged-out/adminRegister", {
			layout: "layouts/logged-out-layout",
			errors: Object.values(registrationErrors),
			fullname,
			email,
			storename,
			password,
			passwordConfirm,
		});
	}
};

// exports.inviteEmployee = async function (req, res) {
// 	console.log(req.body);
// 	let admin = new Admin(req.body);
// 	await admin.inviteEmployee(req.body);
// };
