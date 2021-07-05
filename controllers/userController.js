const User = require("../models/User");

exports.renderLogin = function (req, res) {
	res.render("login");
};

exports.renderRegister = function (req, res) {
	res.render("register");
};

exports.renderEmployeeRegister = function (req, res) {
	console.log("made it!");
	res.render("employeeRegister");
};

exports.renderRecovery = function (req, res) {
	res.render("recovery");
};

exports.login = function (req, res) {
	let user = new User(req.body);
	user.login().then((result) => {
		res.render("home");
	});
};

exports.joinStore = async function (req, res) {
	console.log(req.body);
	let user = new User(req.body);
	await user.joinStore();
};
