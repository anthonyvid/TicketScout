const User = require("../models/User");

exports.renderLogin = function (req, res) {
	res.render("login");
};

exports.renderRegister = function (req, res) {
	res.render("register");
};

exports.renderRecovery = function (req, res) {
	res.render("recovery");
};

exports.login = function (req, res) {
	let user = new User(req.body);
	user.login().then((result) => {
		res.render("home");
		res.send(result);
	});
};

exports.register = function (req, res) {
	let user = new User(req.body);
	user.register();
};
