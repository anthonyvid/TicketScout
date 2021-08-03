const bcrypt = require("bcryptjs");
const validator = require("validator");
const usersCollection = require("../db").collection("users");
const storesCollection = require("../db").collection("stores");
const nodemailer = require("nodemailer");

class User {
	constructor(data) {
		this.data = data;
		this.errors = {};
	}

	hashPrivateInfo(info) {
		let salt = bcrypt.genSaltSync(10);
		const hashedData = bcrypt.hashSync(info, salt);
		return hashedData;
	}

	async sendEmail(msg) {
		let transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.GMAILUSER,
				pass: process.env.GMAILPASS,
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

	async createNewCustomer(formData, storename) {
		//validate phone number
		if (!validator.isMobilePhone(formData.phone)) {
			this.errors["phoneError"] = "Invalid phone number";
			return [this.errors, formData];
		}

		//Get store we are working with
		const store = await storesCollection.findOne({
			storename: storename,
		});

		//check if phone number is already registered
		if (store.storedata.customers.hasOwnProperty(formData.phone)) {
			this.errors["phoneError"] = "Customer already in system";
			return [this.errors, formData];
		}

		//add customer info to store.storedata.customers
		const customer = {
			firstname: formData.firstname.trim().toLowerCase(),
			lastname: formData.lastname.trim().toLowerCase(),
			phone: formData.phone.trim(),
			email: formData.email.trim().toLowerCase(),
			payments: {
				invoices: {},
				estimates: {},
			},
			tickets: {},
		};

		storesCollection.updateOne(
			{
				storename: storename,
			},
			{
				$set: {
					[`storedata.customers.${[formData.phone]}`]: customer,
				},
			}
		);

		return [{}, customer];
	}

	async getPhone(ticketID, storename) {
		const store = await storesCollection.findOne({ storename: storename });

		const phone = store.storedata.tickets[ticketID].customer.phone;
		return phone;
	}
	async updateTicketStatus(selection, ticketID, storename) {
		storesCollection.updateOne(
			{
				storename: storename,
			},
			{
				$set: {
					[`storedata.tickets.${[ticketID]}.status`]: selection,
					[`storedata.tickets.${[ticketID]}.lastUpdated`]:
						new Date().getTime(),
				},
			}
		);
		const [tickets, store] = await this.updateTicketList(storename);
		return tickets;
	}
	async updateTicketIssue(selection, ticketID, storename) {
		storesCollection.updateOne(
			{
				storename: storename,
			},
			{
				$set: {
					[`storedata.tickets.${[ticketID]}.issue`]: selection,
					[`storedata.tickets.${[ticketID]}.lastUpdated`]:
						new Date().getTime(),
				},
			}
		);
		const [tickets, store] = await this.updateTicketList(storename);
		return tickets;
	}

	getCurrentDate() {
		let dateObj = new Date();

		let date = ("0" + dateObj.getDate()).slice(-2);

		// current month
		let month = ("0" + (dateObj.getMonth() + 1)).slice(-2);

		// current year
		let year = dateObj.getFullYear();

		// current hours
		let hours = dateObj.getHours();

		// current minutes
		let minutes = dateObj.getMinutes();

		// current seconds
		let seconds = dateObj.getSeconds();

		return (
			year +
			"-" +
			month +
			"-" +
			date +
			" " +
			hours +
			":" +
			minutes +
			":" +
			seconds
		);
	}

	async createNewTicket(formData, storename) {
		//validate phone number
		if (!validator.isMobilePhone(formData.phone)) {
			this.errors["phoneError"] = "Invalid phone number";
			return [this.errors, formData];
		}

		//Get store we are working with
		const store = await storesCollection.findOne({
			storename: storename,
		});

		let mostRecentTicketNum;

		//If no tickets are in the store (new store) start count at 2000
		if (Object.keys(store.storedata.tickets).length === 0) {
			mostRecentTicketNum = 2000;
		} else {
			//find most recent ticket# created
			mostRecentTicketNum =
				Math.max(
					...Object.keys(store.storedata.tickets).map((i) =>
						parseInt(i)
					)
				) + 1;
		}

		//ticket object to add
		const ticket = {
			customer: {
				firstname: formData.firstname.trim().toLowerCase(),
				lastname: formData.lastname.trim().toLowerCase(),
				phone: formData.phone.trim(),
				email: formData.email.trim().toLowerCase(),
			},
			subject: formData.subject.trim(),
			issue: formData.issue,
			description: formData.description.trim(),
			status: "new",
			shipping: {
				tracking: "",
				carrier: "",
			},
			payments: {},
			lastUpdated: new Date().getTime(),
			dateCreated: this.getCurrentDate(),
		};

		//if customer info put in is not in system, then create new customer also
		if (!store.storedata.customers.hasOwnProperty(formData.phone)) {
			const customer = {
				firstname: formData.firstname.trim().toLowerCase(),
				lastname: formData.lastname.trim().toLowerCase(),
				phone: formData.phone.trim(),
				email: formData.email.trim().toLowerCase(),
				payments: {
					invoices: {},
					estimates: {},
				},
				tickets: {},
			};

			storesCollection.updateOne(
				{
					storename: storename,
				},
				{
					$set: {
						[`storedata.customers.${[formData.phone]}`]: customer,
					},
				}
			);
		}

		//Add ticket:data pair to storedata.customers
		storesCollection.updateOne(
			{
				storename: storename,
			},
			{
				$set: {
					[`storedata.customers.${[formData.phone]}.tickets.${[
						mostRecentTicketNum,
					]}`]: ticket,
				},
			}
		);

		//Add ticket:data pair to storedata.tickets
		storesCollection.updateOne(
			{
				storename: storename,
			},
			{
				$set: {
					[`storedata.tickets.${[mostRecentTicketNum]}`]: ticket,
				},
			}
		);

		return [{}, ticket, mostRecentTicketNum];
	}

	async updateTicketList(storename) {
		//get store we are working with
		const store = await storesCollection.findOne({ storename: storename });

		//create array sorted by recently updated
		const tickets = store.storedata.tickets;

		const sortedTickets = [];
		for (let ticket in tickets) {
			sortedTickets.push([ticket, tickets[ticket]]);
		}

		sortedTickets.sort((a, b) => {
			return b[1].lastUpdated - a[1].lastUpdated;
		});

		console.log(sortedTickets);

		return [sortedTickets, store];
	}

	async trackShipment(ticketID, user) {
		const storename = user.storename;

		/* 1. need to get trackingObj from the store->tickets->ticket.trackingObj
		//
		*/

		// const { tracking_number, carrier } = trackingObj;

		// Fetch API Call for tracking and carrier
		// const url = `https://api.goshippo.com/tracks/${carrier}/${tracking_number}`;
		// const response = await fetch(url, {
		// 	headers: {
		// 		Authorization: `ShippoToken ${process.env.SHIPPO_API_TOKEN}`,
		// 	},
		// });
		// const json = await response.json();

		// // If tracking is invalid return with errors
		// if (json.servicelevel.token == null) {
		// 	this.errors["tracking_error"] = "Tracking number invalid";
		// 	return this.errors;
		// }

		// //TODO: when JSON OBJECT IS DONE THEN WE CAN GET MOST RECENT ADDRESS AND USE FOR GEOLOCATOPN API

		// //TODO: Return any required information needed, for now just everything
		// return json;
	}

	async forgotPassword(data) {
		//validate email
		if (!validator.isEmail(data.email))
			this.errors["error"] = "Not a valid email";

		if (Object.keys(this.errors).length > 0) {
			return this.errors;
		}

		const user = await usersCollection.findOne({
			email: data.email,
		});

		// if no user found
		if (!user) {
			return;
		} else {
			const msg = {
				to: `${user.email}`, // list of receivers
				subject: `Reset Your Password`, // Subject line
				html: {
					path: "./views/emailTemplates/recoverPasswordEmail.html",
				},
			};

			this.sendEmail(msg);

			return user;
		}
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
		//validate full name
		if (!/\s/g.test(data.fullname))
			this.errors["fullname"] = "Not a valid name";

		//validate email
		if (!validator.isEmail(data.email))
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

		if (data.password.length > 50)
			this.errors["password"] = "Password cannot exceed 50 characters";

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

	async employeeRegister() {
		this.cleanUp(this.data);
		await this.validate(this.data);

		//if there are any errors then stop and print errors
		if (Object.keys(this.errors).length > 0) {
			return [this.errors, this.data];
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

		//add user into stores collection under the store they signed up for
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
