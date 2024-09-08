import bcrypt from "bcryptjs";
import * as helper from "./Helper.js";
import { db } from "../db.js";
import mongoClient from "mongodb";

const { ObjectId } = mongoClient;
const usersCollection = db.collection("users");
const storesCollection = db.collection("stores");

class User {
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

		if ((await helper.getUser(email)) != null)
			return { emailError: "Not a valid email, already taken" };

		// Validate name
		if (firstname.length == 0 || lastname.length == 0)
			return { emailError: "Invalid firstname or lastname" };

		// Format fullname
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

		return {}; // Empty object means no errors
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

	/**
	 * Searches databse to see if the search matches any tickets, customers, or payment
	 * @param {string} storename
	 * @param {string} search gets send in fetch from input onkeyup
	 * @returns object containing any data found
	 */
	async liveSearchResults(storename, search) {
		const store = await helper.getStore(storename);

		search = search.trim();

		const storeTickets = Object.keys(store.storedata.tickets);
		const storeCustomers = Object.keys(store.storedata.customers);
		const storePayments = Object.keys(store.storedata.payments);

		const [tickets, customers, payments] = [
			storeTickets,
			storeCustomers,
			storePayments,
		].map((arr) => arr.filter((word) => word.includes(search)));

		const resultsFound = {
			tickets: tickets.slice(0, 5),
			customers: customers.slice(0, 5),
			payments: payments.slice(0, 5),
		};
		return resultsFound;
	}

	/**
	 * send an email to recover password if account is valid
	 * @param {string} email
	 * @returns object
	 */
	async forgotPassword(email) {
		// Validate email
		if (!helper.isValidEmail(email)) return { error: "Not a valid email" };

		const user = await helper.getUser(email);

		if (!user) return;

		const msg = {
			to: `${user.email}`, // List of receivers
			subject: `Reset Your Password`, // Subject line
			html: {
				path: "./views/emailTemplates/recoverPasswordEmail.html",
			},
		};
		helper.sendEmail(msg);
		return user;
	}

	/**
	 * Given an object it will clean up all neccessary data
	 * @param {object} data
	 * @returns object
	 */
	async cleanUp(data) {
		if (typeof data.fullname != "string") data.fullname = "";
		if (typeof data.email != "string") data.email = "";
		if (typeof data.password != "string") data.password = "";
		if (typeof data.passwordConfirm != "string") data.passwordConfirm = "";
		if (data.signUpCode) {
			typeof data.signUpCode != "string" ? (data.signUpCode = "") : "";
			data.signUpCode = data.signUpCode.trim().toLowerCase();
		}
		if (data.storename) {
			typeof data.storename != "string" ? (data.storename = "") : "";
			data.storename = data.storename.trim().toLowerCase();
		}
		data.fullname = data.fullname.trim().toLowerCase();
		data.email = data.email.trim().toLowerCase();
		data.password = data.password.trim().toLowerCase();
		data.passwordConfirm = data.passwordConfirm.trim().toLowerCase();
		return data;
	}

	/**
	 * sets the users clock in time to the number provided
	 * @param {object} user
	 * @param {number} clockInTime
	 */
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

	/**
	 * sets the users clock out time to the number provided
	 * @param {object} user
	 * @param {number} clockInTime
	 */
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

	/**
	 * Checks if signUpCode is associated with a store
	 * @param {string} signUpCode
	 * @returns false if store not found, true if found
	 */
	async isValidSignUpCode(signUpCode) {
		const store = await storesCollection.findOne({
			signUpCode: signUpCode,
		});
		if (!store) return false;
		return true;
	}

	/**
	 * Validates the provided data
	 * @param {string} fullname
	 * @param {string} email
	 * @param {string} password
	 * @param {string} passwordConfirm
	 * @returns error object if any error found along the way, empty object if no errors
	 */
	async validate(fullname, email, password, passwordConfirm) {
		//validate full name
		if (!/\s/g.test(fullname)) return { fullname: "Not a valid name" };

		//validate email
		if (!helper.isValidEmail(email)) return { email: "Not a valid email" };

		//validate if email exists already
		const user = await helper.getUser(email);
		if (user) return { email: "Email already registered" };

		//validate password
		if (password.length < 8)
			return { password: "Password must be at least 8 characters" };

		if (password.length > 100)
			return { password: "Password cannot exceed 100 characters" };

		//validate passwordConfirm
		if (passwordConfirm !== password)
			return { passwordConfirm: "Passwords do not match" };
		return {};
	}

	/**
	 * Changes a users password if no errors
	 * @param {string} actualOldHashedPassword
	 * @param {object} newInfo
	 * @returns object error if error found, empty object if no errors
	 */
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

	/**
	 * Compares hashed data to regular data
	 * @param {string} param1
	 * @param {string} param2
	 * @returns promise
	 */
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

	/**
	 * Verifies if a user exists with a valid Mongo ObjectId
	 * @param {string} id
	 * @returns false if no user found, true if found
	 */
	async verifyUserExists(id) {
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

	async recoverPassword(email, newPass, newPassConfirm) {
		const user = await helper.getUser(email);

		if (!user) return { error: "Invalid Email" };

		if (newPass.length < 8 || newPassConfirm.length < 8)
			return { error: "Password must be at least 8 characters" };

		if (newPass !== newPassConfirm)
			return { error: "passwords do not match" };

		// Hash user passwords
		newPass = helper.hashPrivateInfo(newPass);

		// Update database
		await usersCollection.updateOne(
			{ email: email },
			{
				$set: {
					password: newPass,
					passwordConfirm: newPass,
				},
			}
		);
		return {};
	}

	/**
	 * Sends a verification email after sign up to provided email
	 * @param {string} email
	 */
	async sendEmailVerification(email) {
		const user = await helper.getUser(email);
		const msg = {
			to: `${email}`, // list of receivers
			subject: `ticketScout - Verify your email`, // Subject line
			text: `
			Hello, thanks for registering.
			Please click the link below to verify your account.
			${helper.BASE_URL}/verify-email/${user._id}
			`,
			html: `
			Hello, thanks for registering.
			Please click the link below to verify your account.
			${helper.BASE_URL}/verify-email/${user._id}
			`,
		};
		helper.sendEmail(msg);
	}

	/**
	 *  Sends an email to a so called "store owner"
	 * @param {string} email
	 * @param {string} employeeName
	 */
	async sendOwnerNotification(email, employeeName, employeeEmail) {
		const msg = {
			to: `${email}`, // list of receivers
			subject: `ticketScout - Someone just joined your store`, // Subject line
			text: `
			Hello, someone named ${employeeName} - ${employeeEmail}, recently used your sign up code to join your store.
			If you did not authorize this action please visit the settings page in your ticketScout account
			and remove them under the employees tab.
			`,
			html: `
			Hello, someone named ${employeeName} - ${employeeEmail}, recently used your sign up code to join your store.
			If you did not authorize this action please visit the settings page in your ticketScout account
			and remove them under the employees tab.
			`,
		};
		helper.sendEmail(msg);
	}

	/**
	 * registers an employee into a store
	 * @param {object} data
	 * @returns object
	 */
	async employeeRegister(data) {
		let { fullname, email, password, passwordConfirm, signUpCode } =
			await this.cleanUp(data);

		const errors = await this.validate(
			fullname,
			email,
			password,
			passwordConfirm
		);

		// Check if any errors in validation process
		if (Object.keys(errors).length) return { errors, data };
		if (!(await this.isValidSignUpCode(signUpCode)))
			return { errors: { signUpCode: "Sign Up Code not valid" }, data };

		// Hash user passwords
		password = helper.hashPrivateInfo(password);
		passwordConfirm = password;

		const store = await storesCollection.findOne({
			signUpCode: signUpCode,
		});

		const employee = {
			fullname: fullname.toLowerCase(),
			email: email.toLowerCase(),
			storename: store.storename.toLowerCase(),
			password: password,
			passwordConfirm: passwordConfirm,
			admin: false,
			isVerified: false,
			timeClock: {
				clockInTime: null,
				clockOutTime: null,
				clockHistory: [],
			},
		};

		// Add user into users collection
		usersCollection.insertOne(employee);
		// Send email verification
		this.sendEmailVerification(employee.email);
		// Send admin email notification
		this.sendOwnerNotification(
			store.admin.email,
			employee.fullname,
			employee.email
		);

		return { errors: {}, data };
	}
}

export default User;
