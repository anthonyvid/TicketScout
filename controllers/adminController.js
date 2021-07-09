const Admin = require("../models/Admin");

exports.inviteEmployee = async function (req, res) {
	console.log(req.body);
	let admin = new Admin(req.body);
	await admin.inviteEmployee(req.body);
};
exports.register = async function (req, res) {
	let admin = new Admin(req.body);
	await admin.register();
};
