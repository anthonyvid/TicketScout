const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const usersCollection = require("../db").collection("users");
const ObjectId = require("mongodb").ObjectId;

module.exports = function (passport) {
	passport.use(
		new LocalStrategy(
			{ usernameField: "email" },
			(email, password, done) => {
				//Find User in Database
				usersCollection.findOne({ email: email }).then((user) => {
					if (!user) {
						return done(null, false, {
							message: "Incorrect login information",
						});
					}

					//Check if passwords match
					bcrypt.compare(password, user.password, (err, isMatch) => {
						if (err) throw err;
						// If passwords match
						if (isMatch) {
							return done(null, user);
						} else {
							return done(null, false, {
								message: "Incorrect login information",
							});
						}
					});
				});
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser(function (user, done) {
		const userId = new ObjectId(user);
		usersCollection.findOne({ _id: userId }, function (err, user) {
			if (err) done(err, null);
			done(null, user);
		});
	});
};
