const bcrypt = require("bcryptjs");
const validator = require("validator");
const usersCollection = require("../mongoDb").collection("users");
const storesCollection = require("../mongoDb").collection("stores");

class User {
	constructor(data) {
		this.data = data;
		this.errors = [];
	}

	hashPrivateInfo(info) {
		let salt = bcrypt.genSaltSync(10);
		const hashedData = bcrypt.hashSync(info, salt);
		return hashedData;
	}

	async findExistingDocument(collection, key, value, errMessage) {
		try {
			const result = await collection.findOne({
				[key]: { $eq: value },
			});
			if (result != null) this.errors.push(errMessage);
		} catch (error) {
			console.log(error);
		}
	}

	cleanUp() {
		if (typeof this.data.fullname != "string") this.data.fullname = "";
		if (typeof this.data.email != "string") this.data.email = "";
		if (typeof this.data.password != "string") this.data.password = "";
		if (typeof this.data.passwordConfirm != "string")
			this.data.passwordConfirm = "";

		if ("storename" in this.data) {
			this.data = {
				fullname: this.data.fullname.toLowerCase(),
				email: this.data.email.trim().toLowerCase(),
				storename: this.data.storename.toLowerCase(),
				password: this.data.password,
				passwordConfirm: this.data.passwordConfirm,
			};
		} else {
			this.data = {
				fullname: this.data.fullname.toLowerCase(),
				email: this.data.email.trim().toLowerCase(),
				password: this.data.password,
				passwordConfirm: this.data.passwordConfirm,
				signUpCode: this.data.signUpCode,
			};
		}
	}

	async validate() {
		//validate if email exists
		await this.findExistingDocument(
			usersCollection,
			"email",
			this.data.email,
			"Email already registered"
		);

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

		if ("storename" in this.data) {
			//validate if storename exists
			await this.findExistingDocument(
				storesCollection,
				"storename",
				this.data.storename,
				"Store already registered"
			);
		}
	}

	async register(registryType) {
		//validate and clean up registration data
		this.cleanUp();
		await this.validate();

		//if there are any errors then stop and print errors
		if (this.errors.length) {
			console.log("errors", this.errors);
			return;
		}

		//hash user passwords
		this.data.password = this.hashPrivateInfo(this.data.password);
		this.data.passwordConfirm = this.data.password;

		//if admin call register store, if employee call then add employee to store
		if (registryType === "admin") {
			//add store into stores collection
			try {
				storesCollection.insertOne({
					storename: this.data.storename,
					admin: this.data,
					signUpCode: 12345,
					employees: [],
				});
				console.log("Successfully registered store");
			} catch (err) {
				console.log(`error registering store: ${err}`);
			}
		}
		if (registryType === "employee") {
			//add employee into store
			//add employee to documents employee array, but need to find document by signUpCode
		}

		//add user into users collection
		usersCollection.insertOne(this.data);
		//NEED TO UPDATE THIS TO ADD USER BUT NOT ADD THE SIGNUPKEY KEY:VALUE PAIR IN IT
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
					//check if its admin or employee, this detemines the permissions you should give before rendering home page
					else reject(Error("didnt find user"));
				})
				.catch(() => {
					reject("Please try again later.");
				});
		});
	}

	async joinStore() {
		await this.register("employee");
	}
}

module.exports = User;
