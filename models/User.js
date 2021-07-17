const bcrypt = require("bcryptjs");
const validator = require("validator");
const usersCollection = require("../db").collection("users");
const storesCollection = require("../db").collection("stores");
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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

	async sendEmail(msg) {
		let transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.GMAILUSER, // generated ethereal user
				pass: process.env.GMAILPASS, // generated ethereal password
			},
		});

		const info = await transporter.sendMail(msg, (err, data) => {
			if (err) {
				console.log("error occured: ", err);
			} else {
				console.log("Email sent");
			}
		});
	}

	async forgotPassword(data) {
		//validate email
		if (!validator.isEmail(data.email))
			this.errors.push("Not a valid email");

		const user = await usersCollection.findOne({
			email: data.email,
		});

		if (user == null) this.errors.push("User Not Found");

		if (this.errors.length) {
			console.log("errors", this.errors);
			return;
		}

		const msg = {
			to: `${data.email}`, // list of receivers
			subject: `Reset Your Password`, // Subject line
			html: { path: "./views/emailTemplates/recoverPasswordEmail.html" },
		};

		this.sendEmail(msg);
	}

	clearDatabase() {
		usersCollection.deleteMany({});
		storesCollection.deleteMany({});
	}

	cleanUp(data) {
		if (typeof data.fullname != "string") this.data.fullname = "";
		if (typeof data.email != "string") this.data.email = "";
		if (typeof data.password != "string") this.data.password = "";
		if (typeof data.passwordConfirm != "string")
			this.data.passwordConfirm = "";

		//If they are admin cleanup data like below
		if ("storename" in data) {
			console.log("in cleanUp: Admin");
			this.data = {
				fullname: data.fullname.toLowerCase(),
				email: data.email.trim().toLowerCase(),
				storename: data.storename.toLowerCase(),
				password: data.password,
				passwordConfirm: data.passwordConfirm,
			};
		}
		//If they are employee cleanup data like below
		else {
			console.log("in cleanUp: Employee");
			this.data = {
				fullname: data.fullname.toLowerCase(),
				email: data.email.trim().toLowerCase(),
				password: data.password,
				passwordConfirm: data.passwordConfirm,
				signUpCode: data.signUpCode,
			};
		}
	}

	async validate(data) {
		//validate email
		if (!validator.isEmail(data.email))
			this.errors.push("Not a valid email");

		//validate if email exists
		await this.findExistingDocument(
			usersCollection,
			"email",
			data.email,
			"Email already registered"
		);

		//validate full name
		if (!/\s/g.test(data.fullname)) this.errors.push("Not a valid name");

		//validate password
		if (data.password.length < 8)
			this.errors.push("Password must be at least 8 characters");
		if (data.password.length > 50)
			this.errors.push("Password cannot exceed 50 characters");

		//validate passwordConfirm
		if (data.passwordConfirm !== data.password) {
			this.errors.push("Passwords do not match");
		}

		//validate if store exists already
		if ("storename" in data) {
			await this.findExistingDocument(
				storesCollection,
				"storename",
				data.storename,
				"Store already registered"
			);
		}

		//NEED TO VALIDATE AND SEE IF STORE EVEN EXISTS WHEN EMPLOYEE ENTERS IN SIGNUPKEY
		if (!("storename" in data)) {
			const result = await storesCollection.findOne({
				signUpCode: data.signUpCode,
			});
			if (result == null) this.errors.push("Store not found");
		}
	}

	async login() {
		try {
			const result = await usersCollection.findOne({
				email: this.data.email.toLowerCase(),
			});

			if (
				result &&
				bcrypt.compareSync(this.data.password, result.password)
			) {
				console.log("valid login info");
				//if user success on login make conenction true
				try {
					await usersCollection.updateOne(result, {
						$set: { connected: true },
					});

					if (result.admin) {
						await storesCollection.updateOne(
							{
								storename: result.storename,
							},
							{ $set: { "admin.connected": true } }
						);
					} else {
						const store = await storesCollection.findOne({
							storename: result.storename,
						});

						const employee = store.employees.findIndex(
							(employee) => employee.email === result.email
						);

						if (employee === -1) {
							console.log(
								"employee not found in store, but found in users collection, warning ***"
							);
						} else {
							await storesCollection.updateOne(
								{
									storename: result.storename,
								},
								{
									$set: {
										[`employees.${employee}.connected`]: true,
									},
								}
							);
						}
					}
				} catch (err) {
					console.log(err);
				}

				const token = JWT.sign(
					{
						email: this.data.email,
					},
					process.env.JWT_SECRET,
					{
						expiresIn: 360000,
					}
				);
				return token;
			} else {
				console.log("invalid login info");
				return;
			}
		} catch (err) {
			console.log(err);
		}
	}

	async logout() {
		console.log("in logout");
	}

	async employeeRegister() {
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

		const store = await storesCollection.findOne({
			signUpCode: this.data.signUpCode,
		});

		const employee = {
			fullname: this.data.fullname.toLowerCase(),
			email: this.data.email.toLowerCase(),
			storename: store.storename.toLowerCase(),
			password: this.data.password,
			passwordConfirm: this.data.passwordConfirm,
			connected: false,
			admin: false,
		};

		storesCollection.updateOne(
			{ signUpCode: this.data.signUpCode },
			{
				$push: {
					employees: employee,
				},
			}
		);

		//add user into users collection
		usersCollection.insertOne(employee);

		console.log("employee successfully joined store");
	}
}

module.exports = User;
