import bcrypt from "bcryptjs";
import * as helper from "./Helper.js";
import { db } from "../db.js";
import mongoClient from "mongodb";
const { ObjectId } = mongoClient;
const usersCollection = db.collection("users");
const storesCollection = db.collection("stores");

class User {
	constructor(data) {
		this.data = data;
		this.errors = {};
	}

	/**
	 * Updates an accounts contact information
	 * @param {string} oldEmail the users old email address
	 * @param {Object} newInfo object containing the new info
	 * @returns
	 */
	async updateAccountInfo(oldEmail, newInfo) {
		let { firstname, lastname, email } = newInfo;

		// Validate email
		if (!helper.isValidEmail(email))
			return { emailError: "Not a valid email" };

		// Validate name
		if (firstname.length == 0 || lastname.length == 0)
			return { emailError: "Invalid firstname or lastname" };

		const fullname =
			firstname.trim().toLowerCase() +
			" " +
			lastname.trim().toLowerCase();

		email = email.trim().toLowerCase();

		// Update users name and email in database
		await usersCollection.updateOne(
			{ email: oldEmail },
			{
				$set: {
					["fullname"]: fullname,
					["email"]: email,
				},
			}
		);

		return {};
	}

	/**
	 * Function will find the total tickets marked with the given status
	 * @param {string} storename name of store
	 * @param {string} status name of status to search for
	 * @returns total of all tickets with given status for the store
	 */
	async getTotalTicketsForStatus(storename, status) {
		const store = await helper.getStore(storename);
		const storeTickets = Object.values(store.storedata.tickets);
		let total = 0;

		// For reach ticket in the store if it has the given status tally it
		storeTickets.forEach((item) => {
			if (item.status === status) total++;
		});

		return total;
	}

	async liveSearchResults(storename, search) {
		const store = await helper.getStore(storename);
		console.log(store);
		search = search.trim();

		const storeTickets = Object.keys(store.storedata.tickets);
		const storeCustomers = Object.keys(store.storedata.customers);
		const storePayments = Object.keys(store.storedata.payments);
		let resultsFound = {
			tickets: [],
			customers: [],
			payments: [],
		};

		for (let i = 0; i < storeTickets.length; i++) {
			if (storeTickets[i].indexOf(search) > -1) {
				resultsFound.tickets.push(storeTickets[i]);
			}
		}
		for (let i = 0; i < storeCustomers.length; i++) {
			if (storeCustomers[i].indexOf(search) > -1) {
				resultsFound.customers.push(storeCustomers[i]);
			}
		}
		for (let i = 0; i < storePayments.length; i++) {
			if (storePayments[i].indexOf(search) > -1) {
				resultsFound.payments.push(storePayments[i]);
			}
		}
		return resultsFound;
	}

	async forgotPassword(data) {
		//validate email
		if (!this.isValidEmail(data.email))
			return { error: "Not a valid email" };

		const user = await helper.getUser(email);

		// if no user found
		if (!user) return;

		const msg = {
			to: `${user.email}`, // list of receivers
			subject: `Reset Your Password`, // Subject line
			html: {
				path: "./views/emailTemplates/recoverPasswordEmail.html",
			},
		};
		helper.sendEmail(msg);
		return user;
	}

	cleanUp(data) {
		console.log(data);
		if (typeof data.fullname != "string") data.fullname = "";
		if (typeof data.email != "string") data.email = "";
		if (typeof data.password != "string") data.password = "";
		if (typeof data.passwordConfirm != "string") data.passwordConfirm = "";

		//If they are admin cleanup data like below
		if ("storename" in data) {
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
			this.data = {
				fullname: data.fullname.toLowerCase(),
				email: data.email.trim().toLowerCase(),
				password: data.password,
				passwordConfirm: data.passwordConfirm,
				signUpCode: data.signUpCode,
			};
		}
		console.log(data);
		return data
	}

	async clockIn(user, clockInTime) {
		await usersCollection.updateOne(
			{ email: user.email },
			{
				$set: {
					[`timeClock.clockInTime`]: clockInTime,
					[`timeClock.clockOutTime`]: null,
				},
			}
		);
	}

	async clockOut(user, clockOutTime) {
		const userData = await usersCollection.findOne({ email: user.email });

		const clockInTime = userData.timeClock.clockInTime;

		const timeClockedIn = clockOutTime - userData.timeClock.clockInTime;

		let hours = timeClockedIn / (1000 * 60 * 60);

		await usersCollection.updateOne(
			{ email: userData.email },
			{
				$set: {
					[`timeClock.clockOutTime`]: clockOutTime,
					[`timeClock.clockInTime`]: null,
				},
				$push: {
					[`timeClock.clockHistory`]: {
						date: new Date().toISOString().split("T")[0],
						clockInTime: clockInTime,
						clockOutTime: clockOutTime,
						hoursWorked: hours,
					},
				},
			}
		);
	}

	async validate(data) {
		//validate full name
		if (!/\s/g.test(data.fullname))
			this.errors["fullname"] = "Not a valid name";

		//validate email
		if (!helper.isValidEmail(data.email))
			this.errors["email"] = "Not a valid email";

		//validate if email exists already
		const emailResult = await usersCollection.findOne({
			email: data.email,
		});
		if (emailResult) this.errors["email"] = "Email already registered";

		//validate if store exists already
		if ("storename" in data) {
			const storeResult = await storesCollection.findOne({
				storename: data.storename,
			});
			if (storeResult)
				this.errors["storename"] = "Store already registered";
		}

		//validate password
		if (data.password.length < 8)
			this.errors["password"] = "Password must be at least 8 characters";

		if (data.password.length > 100)
			this.errors["password"] = "Password cannot exceed 100 characters";

		//validate passwordConfirm
		if (data.passwordConfirm !== data.password)
			this.errors["passwordConfirm"] = "Passwords do not match";

		// Check if signUpCode is valid
		if (!("storename" in data)) {
			const result = await storesCollection.findOne({
				signUpCode: data.signUpCode,
			});
			if (result == null)
				this.errors["signUpCode"] = "Store you are joining not found";
		}
	}

	async changeAccountPassword(actualOldHashedPassword, newInfo) {
		const { oldPlainTextPassword, newPassword, confirmNewPassword } =
			newInfo;

		const passwordMatch = await this.compareAsync(
			oldPlainTextPassword,
			actualOldHashedPassword
		);

		if (!passwordMatch)
			return { passwordError: "Old password is incorrect" };

		if (newPassword.length < 8)
			return { passwordError: "Password must be at least 8 characters" };

		if (newPassword.length > 100)
			return { passwordError: "Password cannot exceed 100 characters" };

		if (newPassword !== confirmNewPassword)
			return { passwordError: "New Passwords do not match" };

		const newHashedPassword = helper.hashPrivateInfo(newPassword);

		await usersCollection.updateOne(
			{ password: actualOldHashedPassword },
			{
				$set: {
					password: newHashedPassword,
					passwordConfirm: newHashedPassword,
				},
			}
		);
		return {};
	}

	async compareAsync(param1, param2) {
		return new Promise(function (resolve, reject) {
			bcrypt.compare(param1, param2, function (err, res) {
				if (err) {
					reject(err);
				} else {
					resolve(res);
				}
			});
		});
	}

	async verifyEmailExists(id) {
		const user = await usersCollection.findOne({
			_id: ObjectId(id),
		});

		if (!user) return false;

		await usersCollection.updateOne(
			{ _id: ObjectId(id) },
			{
				$set: { isVerified: true },
			}
		);

		return true;
	}

	async sendEmailVerification(email) {
		const user = await helper.getUser(email);
		const msg = {
			to: `${email}`, // list of receivers
			subject: `ticketScout - Verify your email`, // Subject line
			text: `
			Hello, thanks for registering.
			Please click the link below to verify your account.
			http://localhost:3000/verify-email/${user._id}
			`,
		};
		helper.sendEmail(msg);
	}

	async employeeRegister(data) {
		// this.cleanUp(this.data);
		// await this.validate(this.data);
		let { fullname, email, password, passwordConfirm, signUpCode } = data;

		//hash user passwords
		// password = helper.hashPrivateInfo(password);
		// passwordConfirm = password;

		// 	const store = await storesCollection.findOne({
		// 		signUpCode: this.data.signUpCode,
		// 	});

		// 	const employee = {
		// 		fullname: this.data.fullname.toLowerCase(),
		// 		email: this.data.email.toLowerCase(),
		// 		storename: store.storename.toLowerCase(),
		// 		password: this.data.password,
		// 		passwordConfirm: this.data.passwordConfirm,
		// 		admin: false,
		// 		isVerified: false,
		// 		timeClock: {
		// 			clockInTime: null,
		// 			clockOutTime: null,
		// 			clockHistory: [],
		// 		},
		// 	};

		// 	//add user into users collection
		// 	usersCollection.insertOne(employee);
		// 	helper.sendEmailVerification(employee.email);
		// 	console.log("employee successfully joined store");
	}
}

export default User;
