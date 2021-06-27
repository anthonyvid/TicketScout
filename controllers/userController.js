const User = require("../models/User");

exports.home = function (req, res) {
	res.send("test")
};

// exports.login = function (req, res) {
// 	let user = new User(req.body);
// 	user.login()
// 		.then(function (result) {
// 			req.session.user = { email: user.body.email };
// 			res.send(result);
// 		})
// 		.catch(function (err) {
// 			res.send(err);
// 		});
// 	// res.render("home-logged-in");
// };

// exports.register = function (req, res) {
// 	let user = new User(req.body);
// 	user.register();
// 	if (user.errors.length) {
// 		res.send(user.errors);
// 	} else {
// 		res.send("No errors");
// 	}
// };
