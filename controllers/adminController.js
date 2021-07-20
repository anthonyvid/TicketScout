const { removeAllListeners } = require("../app");
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
		res.send("passed Registration");
	} else {
		const [registrationErrors, data] = result;
		const { fullname, email, storename, password, passwordConfirm } = data;
		console.log(registrationErrors);
		console.log(data);

		if (registrationErrors.length > 0) {
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
			res.render("registration passed");
		}
	}
};

// exports.inviteEmployee = async function (req, res) {
// 	console.log(req.body);
// 	let admin = new Admin(req.body);
// 	await admin.inviteEmployee(req.body);
// };
