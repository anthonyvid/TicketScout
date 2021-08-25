import client from "twilio";
import User from "./User.js";
import { db } from "../db.js";

const usersCollection = db.collection("users");
const storesCollection = db.collection("stores");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = client(accountSid, authToken);

class Admin extends User {
	constructor(data) {
		super();
		this.data = data;
		this.errors = {};
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
				admin: user,
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
			usersCollection.insertOne(user);
			console.log("Successfully registered store");
		} catch (err) {
			console.log(`error registering store: ${err}`);
		}

		//FOR TESTING
		// this.clearDatabase();
	}

	async inviteEmployee(email) {
		if (!this.isValidEmail(email)) return false;

		const msg = {
			to: `${email}`, // list of receivers
			subject: `Register Your Account`, // Subject line
			html: {
				path: "./views/emailTemplates/employeeRegisterEmailTemplate.html",
			},
		};

		await this.sendEmail(msg);
		return true;
	}

	async removeEmployee(storename, email) {
		if (!this.isValidEmail(email)) return false;

		const user = await usersCollection.findOne({ email: email });

		if (!user || storename !== user.storename || user.admin) return false;

		await usersCollection.deleteOne({ email: email });
		return true;
	}

	async toggleAdminPermission(storename, email) {
		if (!this.isValidEmail(email)) return false;

		const user = await usersCollection.findOne({ email: email });

		if (!user || storename !== user.storename) return false;

		await usersCollection.updateOne(
			{ email: email },
			{ $set: { admin: !user.admin } }
		);
		return true;
	}
}

export default Admin;
