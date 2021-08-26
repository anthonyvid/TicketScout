import { db } from "../db.js";
import client from "twilio";
import fetch from "node-fetch";
import * as helper from "./Helper.js";
const storesCollection = db.collection("stores");

class Ticket {
	async updateTicketList(storename) {
		//get store we are working with
		const store = await helper.getStore(storename);

		//create array sorted by recently updated
		const tickets = store.storedata.tickets;

		const sortedTickets = [];
		for (let ticket in tickets) {
			sortedTickets.push([ticket, tickets[ticket]]);
		}

		sortedTickets.sort((a, b) => {
			return b[1].lastUpdated - a[1].lastUpdated;
		});

		return [sortedTickets, store];
	}

	async createNewTicket(formData, storename) {
		//validate phone number
		if (!helper.isValidPhone(formData.phone)) {
			return [{ phoneError: "Invalid phone number" }, formData];
		}

		//Get store we are working with
		const store = await helper.getStore(storename);

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
			status: "New",
			shipping: {
				tracking: "",
				carrier: "",
			},
			payments: {},
			lastUpdated: new Date().getTime(),
			dateCreated: new Date().toDateString(),
			smsData: [],
		};

		//if customer info put in is not in system, then create new customer also
		if (!store.storedata.customers.hasOwnProperty(formData.phone)) {
			const customer = {
				firstname: formData.firstname.trim().toLowerCase(),
				lastname: formData.lastname.trim().toLowerCase(),
				phone: formData.phone.trim(),
				email: formData.email.trim().toLowerCase(),
				payments: {},
				tickets: {},
				dateJoined: new Date().toDateString(),
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
		} else {
			if (
				formData.firstname.trim().toLowerCase() !==
				store.storedata.customers[formData.phone].firstname
			) {
				return [
					{
						firstnameError:
							"Firstname doesnt match account on file",
					},
					formData,
				];
			} else if (
				formData.lastname.trim().toLowerCase() !==
				store.storedata.customers[formData.phone].lastname
			) {
				return [
					{
						lastnameError: "Lastname doesnt match account on file",
					},
					formData,
				];
			}
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
					]}`]: {
						subject: formData.subject.trim(),
						issue: formData.issue,
						description: formData.description.trim(),
						status: "New",
						shipping: {
							tracking: "",
							carrier: "",
						},
						payments: {},
						lastUpdated: new Date().getTime(),
						dateCreated: new Date().toDateString(),
					},
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

	async getTicketData(storename, ticketID) {
		const store = await helper.getStore(storename);
		return store.storedata.tickets[ticketID];
	}

	async updateTicketStatus(selection, ticketID, phone, storename) {
		const latestUpdate = new Date().getTime();
		storesCollection.updateOne(
			{
				storename: storename,
			},
			{
				$set: {
					[`storedata.tickets.${[ticketID]}.status`]: selection,
					[`storedata.tickets.${[ticketID]}.lastUpdated`]:
						latestUpdate,
					[`storedata.customers.${[phone]}.tickets.${[
						ticketID,
					]}.status`]: selection,
					[`storedata.customers.${[phone]}.tickets.${[
						ticketID,
					]}.lastUpdated`]: latestUpdate,
				},
			}
		);
		return await this.updateTicketList(storename);
	}

	async updateTicketIssue(selection, ticketID, phone, storename) {
		const latestUpdate = new Date().getTime();
		storesCollection.updateOne(
			{
				storename: storename,
			},
			{
				$set: {
					[`storedata.tickets.${[ticketID]}.issue`]: selection,
					[`storedata.tickets.${[ticketID]}.lastUpdated`]:
						latestUpdate,
					[`storedata.customers.${[phone]}.tickets.${[
						ticketID,
					]}.issue`]: selection,
					[`storedata.customers.${[phone]}.tickets.${[
						ticketID,
					]}.lastUpdated`]: latestUpdate,
				},
			}
		);
		const [tickets, store] = await this.updateTicketList(storename);
		return tickets;
	}

	async updateTicketInfo(storename, newInfo, phone) {
		const newSubject = newInfo.subject;
		const newDescription = newInfo.description;
		const ticketID = newInfo.ticketID;

		await storesCollection.updateOne(
			{ storename: storename },
			{
				$set: {
					[`storedata.tickets.${[ticketID]}.description`]:
						newDescription,
					[`storedata.customers.${[phone]}.tickets.${[
						ticketID,
					]}.description`]: newDescription,
				},
			}
		);
		await storesCollection.updateOne(
			{ storename: storename },
			{
				$set: {
					[`storedata.tickets.${[ticketID]}.subject`]: newSubject,
					[`storedata.customers.${[phone]}.tickets.${[
						ticketID,
					]}.subject`]: newSubject,
				},
			}
		);
	}

	async updateTicketShippingInfo(info, storename) {
		const { trackingNumber, carrier, ticketID, phone } = info;

		await storesCollection.updateOne(
			{ storename: storename },
			{
				$set: {
					[`storedata.customers.${[phone]}.tickets.${[
						ticketID,
					]}.shipping.tracking`]: trackingNumber,
					[`storedata.customers.${[phone]}.tickets.${[
						ticketID,
					]}.shipping.carrier`]: carrier,
					[`storedata.tickets.${[ticketID]}.shipping.carrier`]:
						carrier,
					[`storedata.tickets.${[ticketID]}.shipping.tracking`]:
						trackingNumber,
				},
			}
		);
	}

	async sendSms(storename, ticketID, toPhone, message) {
		const store = await helper.getStore(storename);

		const subAccountSid = store.storedata.api.twilio.sid;
		const subAccountAuthToken = store.storedata.api.twilio.authToken;

		const twilioClient = client(subAccountSid, subAccountAuthToken);

		let subAccount = null;

		try {
			subAccount = await twilioClient.incomingPhoneNumbers.list({
				limit: 20,
			});
		} catch (error) {
			console.log(error);
		}

		const msg = await twilioClient.messages
			.create({
				from: subAccount[0].phoneNumber,
				body: message,
				to: "1" + toPhone,
			})
			.then(async (message) => {
				await storesCollection.updateOne(
					{ storename: storename },
					{
						$push: {
							[`storedata.tickets.${[ticketID]}.smsData`]: {
								$each: [
									{
										timestamp: Date.now(),
										from: "store",
										message: message.body,
									},
								],
								$position: -1,
							},
						},
					}
				);
				return message.body;
			});
		return msg;
	}

	async receiveSms(smsData) {
		const subAccountSid = smsData.AccountSid;
		const message = smsData.Body;
		const fromNumber = smsData.From.substring(2);

		//find subaccount to add msg to
		// const store = await storesCollection.findOne({
		// 	"storedata.api.twilio.sid": subAccountSid,
		// });

		//also update the status of the ticket to CUSTOMER_REPLY
		//maybe setup socket.io connection here to display msg if user is on that page
	}

	async trackShipment(ticketID, storename) {
		const store = await helper.getStore(storename);
		const storeTickets = store.storedata.tickets;

		if (!Object.keys(storeTickets).includes(ticketID))
			return { tracking_error: "Tracking Info Invalid" };

		if (!storeTickets[ticketID].shipping.tracking.length)
			return { tracking_error: "Tracking Info Invalid" };

		const { tracking, carrier } =
			store.storedata.tickets[ticketID].shipping;

		// Fetch API Call for tracking and carrier
		const url = `https://api.goshippo.com/tracks/${carrier}/${tracking}`;
		const response = await fetch(url, {
			headers: {
				Authorization: `ShippoToken ${process.env.SHIPPO_API_TOKEN}`,
			},
		});
		const json = await response.json();

		// If tracking is invalid return with errors
		if (json.servicelevel.token == null) {
			return { tracking_error: "Tracking Info Invalid" };
		}

		return {
			from: json.address_from,
			to: json.address_to,
			eta: json.eta,
			status: json.tracking_status.status,
			location: json.tracking_history[0].location,
		};
	}
}

export default Ticket;
