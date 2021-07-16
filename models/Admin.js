const User = require("./User");
const storesCollection = require("../db").collection("stores");
const usersCollection = require("../db").collection("users");
const nodemailer = require("nodemailer");

class Admin extends User {
	constructor(data) {
		super();
		this.data = data;
		this.errors = [];
	}

	async register() {
		this.cleanUp(this.data);
		await this.validate(this.data);

		//if there are any errors then stop and print errors
		if (this.errors.length) {
			console.log("errors", this.errors);
			return;
		}

		//hash user passwords
		this.data.password = this.hashPrivateInfo(this.data.password);
		this.data.passwordConfirm = this.data.password;

		try {
			storesCollection.insertOne({
				storename: this.data.storename,
				signUpCode: "12345", //need to auto generate this
				admin: this.data,
				employees: [],
			});
			usersCollection.insertOne(this.data);
			console.log("Successfully registered store");
		} catch (err) {
			console.log(`error registering store: ${err}`);
		}

		// this.clearDatabase();
	}

	async inviteEmployee(data) {
		console.log("In INVITE");
		const email = data.email;

		const msg = {
			to: `${email}`, // list of receivers
			subject: `Register Your Account`, // Subject line
			html: { path: "./views/employeeRegisterEmailTemplate.html" },
		};

		await this.sendEmail(msg);
	}
}

module.exports = Admin;
