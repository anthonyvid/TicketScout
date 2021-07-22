module.exports = {
	ensureAuthenticated: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		console.log("test");
		req.flash("invalid_auth", "Please log in to view this resource");
		res.redirect("/");
	},

	forwardAuthenticated: function (req, res, next) {
		if (!req.isAuthenticated()) {
			return next();
		}
		res.redirect("/overview");
	},

	checkNotAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return res.redirect("/overview");
		}
		next();
	},
};
