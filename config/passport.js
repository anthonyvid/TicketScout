const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const usersCollection = require("../db").collection("users");

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

	passport.deserializeUser((id, done) => {
		usersCollection.find({ id_: id }, (err, user) => {
			done(err, user);
		});
	});
};
