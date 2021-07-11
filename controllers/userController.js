const User = require("../models/User");

exports.renderLogin = function (req, res) {
	res.render("login");
};

exports.renderHome = function (req, res) {
	res.render("home");
};

exports.renderRegister = function (req, res) {
	res.render("register");
};

exports.renderEmployeeRegister = function (req, res) {
	res.render("employeeRegister");
};

exports.renderRecovery = function (req, res) {
	res.render("recovery");
};

exports.login = async function (req, res) {
	let user = new User(req.body);
	const resultToken = await user.login();
	localStorage.setItem("auth", resultToken);

	res.redirect("home");
	// location.href = "" NEED TO MAKE THIS HOMEPAGE
};

exports.employeeRegister = async function (req, res) {
	let user = new User(req.body);
	await user.employeeRegister();
};
