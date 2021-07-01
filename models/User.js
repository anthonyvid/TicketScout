const bcrypt = require("bcryptjs");
const validator = require("validator");
const usersCollection = require("../mongoDb").collection("users");
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
// 	_id: mongoose.Schema.Types.ObjectId,
// 	fullname: String,
// 	email: String,
// 	password: String,
// 	passwordConfirm: String,
// });

// module.exports = mongoose.model("User", userSchema, "users");

class User {
	constructor(data) {
		this.data = data;
		this.errors = [];
	}

	cleanUp() {
		if (typeof this.data.fullname != "string") this.data.fullname = "";
		if (typeof this.data.email != "string") this.data.email = "";
		if (typeof this.data.password != "string") this.data.password = "";
		if (typeof this.data.passwordConfirm != "string")
			this.data.passwordConfirm = "";

		this.data = {
			fullname: this.data.fullname.toLowerCase(),
			email: this.data.email.trim().toLowerCase(),
			password: this.data.password,
			passwordConfirm: this.data.passwordConfirm,
			usertype: this.data.usertype,
			storename: this.data.storename,
		};
	}

	validate() {
		//validate email

		if (!validator.isEmail(this.data.email))
			this.errors.push("Not a valid email");

		//validate full name
		if (!/\s/g.test(this.data.fullname))
			this.errors.push("Not a valid name");

		//validate password
		if (this.data.password.length < 8)
			this.errors.push("Password must be at least 8 characters");
		if (this.data.password.length > 50)
			this.errors.push("Password cannot exceed 50 characters");

		//validate passwordConfirm
		if (this.data.passwordConfirm !== this.data.password)
			this.errors.push("Passwords do not match");
	}

	register() {
		console.log(this.data);

		//validate registration data
		this.cleanUp();
		this.validate();

		//FIXME____NOT WORKING BELOW @ LINES
		if (usersCollection.findOne({ email: this.data.email }))
			this.errors.push("Email already registered");

		//add valid registered user to database
		if (!this.errors.length) {
			//hash user passwords
			let salt = bcrypt.genSaltSync(10);
			this.data.password = bcrypt.hashSync(this.data.password, salt);
			this.data.passwordConfirm = this.data.password;

			//check if they are admin or employee
			//if user admin: check if stoername avaialbel, then add to db

			usersCollection.insertOne(
				{
					fullname: this.data.fullname,
					email: this.data.email,
					password: this.data.password,
					passwordConfirm: this.data.passwordConfirm,
					usertype: this.data.usertype,
					storename: this.data.storename,
				},
				(err, resuly) => {
					if (err) {
						console.log("Error adding to database", err);
					} else {
						console.log("Successfully added to MongoDB");
					}
				}
			);
		} else {
			console.log("errors", this.errors);
		}
	}

	login() {
		return new Promise((resolve, reject) => {
			this.cleanUp();
			usersCollection
				.findOne({ email: this.data.email })
				.then((userAttempt) => {
					if (
						userAttempt &&
						bcrypt.compareSync(
							this.data.password,
							userAttempt.password
						)
					)
						resolve("congrats");
					else reject(Error("didnt find user"));
				})
				.catch(() => {
					reject("Please try again later.");
				});
		});
	}
}

module.exports = User;
