import client from "twilio";
import User from "./User.js";
import { db } from "../db.js";
import * as helper from "./Helper.js";
const usersCollection = db.collection("users");
const storesCollection = db.collection("stores");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = client(accountSid, authToken);

class Admin extends User {
	constructor(data) {
		super();
		this.data = data;
	}

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

	async createTwilioSubaccount(friendlyName) {
		//create twilio subaccount
		return await twilioClient.api.accounts
			.create({ friendlyName: friendlyName })
			.then((account) => {
				return account;
			});
	}

	async register() {
		// this.cleanUp(this.data);
		// await this.validate(this.data);

		//hash user passwords
		this.data.password = helper.hashPrivateInfo(this.data.password);
		this.data.passwordConfirm = this.data.password;

		const admin = {
			fullname: this.data.fullname.toLowerCase(),
			email: this.data.email.toLowerCase(),
			storename: this.data.storename.toLowerCase(),
			password: this.data.password,
			passwordConfirm: this.data.passwordConfirm,
			admin: true,
			isVerified: false,
			timeClock: {
				clockInTime: null,
				clockOutTime: null,
				clockHistory: [],
			},
		};
		let twilioAccount = null;

		// try {
		// 	twilioAccount = await this.createTwilioSubaccount(
		// 		this.data.storename
		// 	);
		// } catch (error) {
		// 	console.log(error);
		// }

		try {
			storesCollection.insertOne({
				storename: this.data.storename,
				signUpCode: "12345", //need to auto generate this
				admin: admin,
				storedata: {
					tickets: {},
					customers: {},
					payments: {},
					api: {
						twilio: {
							// authToken: twilioAccount.authToken,
							// sid: twilioAccount.sid,
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
				},
			});
			usersCollection.insertOne(admin);
			console.log("Successfully registered store");
		} catch (err) {
			console.log(`error registering store: ${err}`);
		}
	}

	async inviteEmployee(email) {
		if (!helper.isValidEmail(email)) return false;

		const msg = {
			to: `${email}`, // list of receivers
			subject: `Register Your Account`, // Subject line
			html: {
				path: "./views/emailTemplates/employeeRegisterEmailTemplate.html",
			},
		};

		await helper.sendEmail(msg);
		return true;
	}

	async removeEmployee(storename, email) {
		if (!helper.isValidEmail(email)) return false;

		const user = await helper.getUser(email);
		if (!user || storename !== user.storename || user.admin) return false;

		await usersCollection.deleteOne({ email: email });
		return true;
	}

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

	async getEmployeesTimeclockHistory(storename, fromDate, toDate) {
		const employees = await usersCollection
			.find({ storename: storename })
			.toArray();

		const employeesClockHistory = [];

		for (let i = 0; i < employees.length; i++) {
			let totalHours = 0;
			employees[i].timeClock.clockHistory.forEach((item) => {
				if (item.date >= fromDate && item.date <= toDate) {
					totalHours += item.hoursWorked;
				}
			});
			if (totalHours > 0) {
				employeesClockHistory.push([employees[i].fullname, totalHours]);
			}
		}

		const store = await helper.getStore(store);
		return {
			employeesClockHistory,
			payPeriod: store.storeSettings.payPeriod,
		};
	}

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

	async removeCategory(storename, category) {
		await storesCollection.updateOne(
			{ storename: storename },
			{
				$pull: {
					"storeSettings.payments.categories": category,
				},
			}
		);
	}
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
	async removeIssue(storename, issue) {
		await storesCollection.updateOne(
			{ storename: storename },
			{
				$pull: {
					"storeSettings.tickets.issue": issue,
				},
			}
		);
	}
	async deletePayment(storename, paymentNumber) {
		const store = await helper.getStore(store);
		const storePayments = Object.keys(store.storedata.payments);

		if (!storePayments.includes(paymentNumber)) return;

		const phoneOnPayment =
			store.storedata.payments[paymentNumber].customer.phone;

		await storesCollection.updateOne(
			{ storename: storename },
			{
				$unset: {
					[`storedata.payments.${paymentNumber}`]: "",
					[`storedata.customers.${phoneOnPayment}.payments.${paymentNumber}`]:
						"",
				},
			}
		);
	}
}

export default Admin;
