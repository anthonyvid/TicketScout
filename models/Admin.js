const User = require("./User");
const storesCollection = require("../db").collection("stores");
const usersCollection = require("../db").collection("users");

class Admin extends User {
	constructor(data) {
		super();
		this.data = data;
		this.errors = {};
	}

	async register() {
		this.cleanUp(this.data);
		await this.validate(this.data);

		// If any errors found during registration
		if (Object.keys(this.errors).length > 0) {
			return [this.errors, this.data];
		}

		//hash user passwords
		this.data.password = this.hashPrivateInfo(this.data.password);
		this.data.passwordConfirm = this.data.password;

		const user = {
			fullname: this.data.fullname.toLowerCase(),
			email: this.data.email.toLowerCase(),
			storename: this.data.storename.toLowerCase(),
			password: this.data.password,
			passwordConfirm: this.data.passwordConfirm,
			admin: true,
		};

		try {
			storesCollection.insertOne({
				storename: this.data.storename,
				signUpCode: "12345", //need to auto generate this
				admin: user,
				employees: [],
				storedata: {
					tickets: {},
					customers: [],
					estimates: [],
					invoices: [],
				},
			});
			usersCollection.insertOne(user);
			console.log("Successfully registered store");
		} catch (err) {
			console.log(`error registering store: ${err}`);
		}

		//FOR TESTING
		// this.clearDatabase();
	}

	async inviteEmployee(data) {
		console.log("In INVITE");
		const email = data.email;

		const msg = {
			to: `${email}`, // list of receivers
			subject: `Register Your Account`, // Subject line
			html: {
				path: "./views/emailTemplates/employeeRegisterEmailTemplate.html",
			},
		};

		await this.sendEmail(msg);
	}
}

module.exports = Admin;
