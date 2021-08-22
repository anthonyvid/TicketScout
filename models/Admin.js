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
			timeClock: {
				clockInTime: null,
				clockOutTime: null,
				clockHistory: [],
			},
		};
		let twilioAccount = null;

		try {
			twilioAccount = await this.createTwilioSubaccount(
				this.data.storename
			);
		} catch (error) {
			console.log(error);
		}

		console.log(twilioAccount);

		try {
			storesCollection.insertOne({
				storename: this.data.storename,
				signUpCode: "12345", //need to auto generate this
				admin: user,
				employees: [],
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
					},
					payPeriod: "Bi-weekly",
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

export default Admin;
