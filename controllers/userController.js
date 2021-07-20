const User = require("../models/User");

////////////////////////////////////////////////////

// Login Page
exports.renderLogin = function (req, res) {
	res.render("logged-out/login", { layout: "layouts/logged-out-layout" });
};
// Login Handle
exports.login = async function (req, res, next) {
	console.log(req.token);

	let user = new User(req.body);
	const resultToken = await user.login();
	res.redirect("overview");
};
////////////////////////////////////////////////////

// Employee Register Page
exports.renderEmployeeRegister = function (req, res) {
	res.render("logged-out/employeeRegister", {
		layout: "layouts/logged-out-layout",
	});
};
// Employee Register Handle
exports.employeeRegister = async function (req, res) {
	let user = new User(req.body);
	await user.employeeRegister();
};
////////////////////////////////////////////////////

// Password Recovery Page
exports.renderRecovery = function (req, res) {
	res.render("logged-out/recovery", { layout: "layouts/logged-out-layout" });
};
// Password Recovery Handle
exports.forgotPassword = async function (req, res) {
	let user = new User();
	await user.forgotPassword(req.body);
};
////////////////////////////////////////////////////

// exports.renderOverview = function (req, res) {
// 	console.log(req.user);
// 	res.render("logged-in/overview", { layout: "layouts/logged-in-layout" });
// };

// exports.logout = async function (req, res) {
// 	console.log(req.body);
// 	let user = new User(req.body);
// 	await user.logout();
// };

// exports.tickets = function (req, res) {
// 	res.render("logged-in/tickets", { layout: "layouts/logged-in-layout" });
// };
