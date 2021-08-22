import {db} from "../db.js";
import bcrypt from "bcryptjs";
import mongodb from "mongodb";
import passportLocal from "passport-local";

const LocalStrategy = passportLocal.Strategy;
const ObjectId = mongodb.ObjectId;
const usersCollection = db.collection("users");

export default function (passport) {
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
