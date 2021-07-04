const Admin = require("../models/Admin");

exports.register = async function (req, res) {
	let admin = new Admin(req.body);
	await admin.register("admin");
};

exports.inviteEmployee = async function (req, res) {
	let admin = new Admin(req.body);
	await admin.inviteEmployee(req.body);
};
