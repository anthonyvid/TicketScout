import client from "twilio";
import User from "./User.js";
import { db } from "../db.js";
import * as helper from "./Helper.js";
import uniqueString from "unique-string";
const usersCollection = db.collection("users");
const storesCollection = db.collection("stores");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = client(accountSid, authToken);

class Admin extends User {
	/**
	 * Deletes a ticket from a store
	 * @param {string}} storename
	 * @param {string} ticketID
	 * @returns none
	 */
	async deleteTicket(storename, ticketID) {
		const store = await helper.getStore(storename);
		const storeTickets = Object.keys(store.storedata.tickets);

		if (!storeTickets.includes(ticketID)) return;

		const phoneOnTicket = store.storedata.tickets[ticketID].customer.phone;
		const paymentsOnTicket = Object.keys(
			store.storedata.tickets[ticketID].payments
		);

		paymentsOnTicket.forEach(async (item) => {
			await storesCollection.updateOne(
				{ storename: storename },
				{
					$set: {
						[`storedata.payments.${item}.linkedTicket`]: "",
						[`storedata.customers.${phoneOnTicket}.payments.${item}.linkedTicket`]:
							"",
					},
				}
			);
		});

		await storesCollection.updateOne(
			{ storename: storename },
			{
				$unset: {
					[`storedata.tickets.${ticketID}`]: "",
					[`storedata.customers.${phoneOnTicket}.tickets.${ticketID}`]:
						"",
				},
			}
		);
	}

	/**
	 * Creates a subaccount in master twilio account, for sms services
	 * @param {string} friendlyName
	 * @returns object
	 */
	async createTwilioSubaccount(friendlyName) {
		return await twilioClient.api.accounts.create({
			friendlyName: friendlyName,
		});
	}

	/**
	 * Deletes a twilio account
	 * @param {string} sid
	 */
	async deleteTwilioSubaccount(sid) {
		try {
			await twilioClient.api.accounts(sid).update({ status: "closed" });
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Checks if a store with storename exists
	 * @param {string} storename
	 * @returns boolean
	 */
	async isValidStorename(storename) {
		const store = await helper.getStore(storename);
		if (!store) return true;
		return false;
	}

	/**
	 * Generates a unique signUpCode for a newly registered store
	 * @returns string
	 */
	async generateStoreSignUpCode() {
		let signUpCode;
		while (true) {
			signUpCode = uniqueString(); // Generates string
			const store = await storesCollection.findOne({
				signUpCode: signUpCode,
			});
			if (!store) break;
		}
		return signUpCode;
	}

	/**
	 * Registers a store into databs
	 * @param {object} data
	 * @returns object
	 */
	async registerAdmin(data) {
		let { fullname, email, storename, password, passwordConfirm } =
			await this.cleanUp(data);

		const errors = await this.validate(
			fullname,
			email,
			password,
			passwordConfirm
		);

		// Check if any errors in validation process
		if (Object.keys(errors).length) return { errors, data };
		if (!(await this.isValidStorename(storename)))
			return {
				errors: { storename: "Store name already registered" },
				data,
			};

		let twilioAccount = null;

		try {
			twilioAccount = await this.createTwilioSubaccount(storename);
		} catch (error) {
			console.error(error);
			return {
				errors: {
					twilioError:
						"Error creating twilio subaccount - Contact Support",
				},
				data,
			};
		}

		// Hash user passwords
		password = helper.hashPrivateInfo(password);
		passwordConfirm = password;

		const admin = {
			fullname,
			email,
			storename,
			password,
			passwordConfirm,
			admin: true,
			isVerified: false,
			timeClock: {
				clockInTime: null,
				clockOutTime: null,
				clockHistory: [],
			},
		};

		const storeSignUpCode = await this.generateStoreSignUpCode();

		const store = {
			storename,
			signUpCode: storeSignUpCode,
			admin: admin,
			storedata: {
				tickets: {},
				customers: {},
				payments: {},
				api: {
					twilio: {
						authToken: twilioAccount.authToken,
						sid: twilioAccount.sid,
						numSmsSent: 0,
						numSmsReceived: 0,
					},
				},
			},
			storeSettings: {
				tickets: {
					status: [
						["New", "36b37e"],
						["Resolved", "505f79"],
						["Priority", "ff3838"],
						["Reply", "ffab00"],
					],
					issue: [],
				},
				payments: {
					categories: [],
					taxRate: "13",
					address: {
						primary: "",
						city: "",
						province: "",
						postal: "",
					},
				},
				sms: {
					numSent: 0,
					numReceived: 0,
				},
			},
		};

		await storesCollection.insertOne(store);
		await usersCollection.insertOne(admin);

		this.sendEmailVerification(admin.email);

		this.deleteTwilioSubaccount(twilioAccount.sid); //TODO: REMOVE THIS IS JUST FOR TESTING
		return { errors: {}, data };
	}

	/**
	 * Sends email with signup link
	 * @param {string} email
	 * @param {string} signUpCode
	 * @returns boolean
	 */
	async inviteEmployee(email, signUpCode) {
		console.log("SIGNUPCODE: " + signUpCode);

		if (!helper.isValidEmail(email)) return false;

		const msg = {
			to: `${email}`, // List of receivers
			subject: `Register Your Account`, // Subject line
			html: {
				path: "./views/emailTemplates/employeeRegisterEmailTemplate.html",
			},
		};

		await helper.sendEmail(msg);
		return true;
	}

	/**
	 * Deletes an employee from a store
	 * @param {string} storename
	 * @param {string} email
	 * @returns boolean
	 */
	async deleteEmployee(storename, email) {
		if (!helper.isValidEmail(email)) return false;

		const user = await helper.getUser(email);
		if (!user || storename !== user.storename || user.admin) return false;

		await usersCollection.deleteOne({ email: email });
		return true;
	}

	/**
	 * Toggles admin permissions to an account
	 * @param {string} storename
	 * @param {string} email
	 * @returns boolean
	 */
	async toggleAdminPermission(storename, email) {
		if (!helper.isValidEmail(email)) return false;

		const user = await helper.getUser(email);

		if (!user || storename !== user.storename) return false;

		await usersCollection.updateOne(
			{ email: email },
			{ $set: { admin: !user.admin } }
		);
		return true;
	}

	/**
	 * Gets the time clock history of all employees for store in timeframe
	 * @param {string} storename
	 * @param {string} fromDate
	 * @param {string} toDate
	 * @returns object
	 */
	async getEmployeesTimeclockHistory(storename, fromDate, toDate) {
		const employees = await usersCollection
			.find({ storename: storename })
			.toArray();

		const employeesClockHistory = [];

		for (let i = 0; i < employees.length; i++) {
			let totalHours = 0;
			// For each employee total up hours worked
			employees[i].timeClock.clockHistory.forEach((item) => {
				if (item.date >= fromDate && item.date <= toDate) {
					totalHours += item.hoursWorked;
				}
			});
			if (totalHours > 0) {
				employeesClockHistory.push([employees[i].fullname, totalHours]);
			}
		}

		const store = await helper.getStore(storename);
		return {
			employeesClockHistory,
			payPeriod: store.storeSettings.payPeriod,
		};
	}

	/**
	 * Adds a category to a stores payment settings
	 * @param {string} storename
	 * @param {string} category
	 */
	async addCategory(storename, category) {
		await storesCollection.updateOne(
			{ storename: storename },
			{
				$addToSet: {
					"storeSettings.payments.categories": category,
				},
			}
		);
	}

	/**
	 * Deletes a category to a stores payment settings
	 * @param {string} storename
	 * @param {string} category
	 */
	async deleteCategory(storename, category) {
		await storesCollection.updateOne(
			{ storename: storename },
			{
				$pull: {
					"storeSettings.payments.categories": category,
				},
			}
		);
	}

	/**
	 * Updates a stores address in payment settings
	 * @param {string} storename
	 * @param {object} newData
	 */
	async updateStoreAddress(storename, newData) {
		const { primary, city, province, postalCode } = newData;
		await storesCollection.updateOne(
			{ storename: storename },
			{
				$set: {
					"storeSettings.payments.address.primary": primary,
					"storeSettings.payments.address.city": city,
					"storeSettings.payments.address.province": province,
					"storeSettings.payments.address.postal": postalCode,
				},
			}
		);
	}

	/**
	 * Updates a stores tax rate in payment settings
	 * @param {string} storename
	 * @param {string} taxRate
	 */
	async updateStoreTaxRate(storename, taxRate) {
		await storesCollection.updateOne(
			{ storename: storename },
			{
				$set: {
					"storeSettings.payments.taxRate": taxRate.replace(
						/^\D+/g,
						""
					),
				},
			}
		);
	}

	/**
	 * Adds a ticket status to a stores ticket settings
	 * @param {string} storename
	 * @param {object} newData
	 */
	async updateTicketStatusSettings(storename, newData) {
		let { statusName, statusColor } = newData;

		statusName =
			statusName.charAt(0).toUpperCase() +
			statusName.substring(1).toLowerCase();

		await storesCollection.updateOne(
			{ storename: storename },
			{
				$push: {
					"storeSettings.tickets.status": [statusName, statusColor],
				},
			}
		);
	}

	/**
	 * Deletes a ticket status to a stores ticket settings
	 * @param {string} storename
	 * @param {object} newData
	 */
	async deleteTicketStatusSettings(storename, newData) {
		let { statusName, statusColor } = newData;

		statusName =
			statusName.charAt(0).toUpperCase() +
			statusName.substring(1).toLowerCase();

		await storesCollection.updateOne(
			{ storename: storename },
			{
				$pull: {
					"storeSettings.tickets.status": {
						$in: [statusName],
					},
				},
			}
		);
	}

	/**
	 * Adds an issue to a stores ticket settings
	 * @param {string} storename
	 * @param {string} issue
	 */
	async addIssue(storename, issue) {
		await storesCollection.updateOne(
			{ storename: storename },
			{
				$addToSet: {
					"storeSettings.tickets.issue": issue,
				},
			}
		);
	}

	/**
	 * Deletes an issue to a stores ticket settings
	 * @param {string} storename
	 * @param {string} issue
	 */
	async deleteIssue(storename, issue) {
		await storesCollection.updateOne(
			{ storename: storename },
			{
				$pull: {
					"storeSettings.tickets.issue": issue,
				},
			}
		);
	}

	/**
	 * Deleted a payment from a store
	 * @param {string} storename
	 * @param {string} paymentNumber
	 * @returns none
	 */
	async deletePayment(storename, paymentNumber) {
		const store = await helper.getStore(storename);
		const storePayments = Object.keys(store.storedata.payments);

		if (!storePayments.includes(paymentNumber)) return;

		const phoneOnPayment =
			store.storedata.payments[paymentNumber].customer.phone;

		if (phoneOnPayment.length) {
			await storesCollection.updateOne(
				{ storename: storename },
				{
					$unset: {
						[`storedata.customers.${phoneOnPayment}.payments.${paymentNumber}`]:
							"",
					},
				}
			);
		}

		await storesCollection.updateOne(
			{ storename: storename },
			{
				$unset: {
					[`storedata.payments.${paymentNumber}`]: "",
				},
			}
		);
	}
}

export default Admin;
