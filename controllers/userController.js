const User = require("../models/User");

exports.renderLogin = function (req, res) {
	res.render("logged-out/login");
};

exports.renderHome = function (req, res) {
	res.render("logged-in/overview", { layout: "layouts/logged-in-layout" });
};

exports.renderRegister = function (req, res) {
	res.render("logged-out/register");
};

exports.renderEmployeeRegister = function (req, res) {
	res.render("logged-out/employeeRegister");
};

exports.renderRecovery = function (req, res) {
	res.render("logged-out/recovery");
};

exports.forgotPassword = async function (req, res) {
	let user = new User();
	await user.forgotPassword(req.body);
};

exports.login = async function (req, res) {
	let user = new User(req.body);
	const resultToken = await user.login();
	localStorage.setItem("auth", resultToken);

	res.redirect("overview");
	// location.href = "" NEED TO MAKE THIS HOMEPAGE
};

exports.logout = async function (req, res) {
	let user = new User();
	await user.logout();
};

exports.employeeRegister = async function (req, res) {
	let user = new User(req.body);
	await user.employeeRegister();
};

exports.tickets = function (req, res) {
	res.render("logged-in/tickets", { layout: "layouts/logged-in-layout" });
};
