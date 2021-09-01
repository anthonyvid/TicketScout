import { db } from "../db.js";
import client from "twilio";
import fetch from "node-fetch";
import * as helper from "./Helper.js";
import Customer from "./Customer.js";
import Pusher from "pusher";
const storesCollection = db.collection("stores");
const pusher = new Pusher({
	appId: "1259577",
	key: "e28b6821911a7e16e187",
	secret: "798adaa7d81ff3ecc1bc",
	cluster: "us2",
	useTLS: true,
});

class Ticket {
	/**
	 * Updates and sorts store tickets in descending order
	 * @param {string} storename
	 * @returns array
	 */
	async updateTicketList(storename) {
		const store = await helper.getStore(storename);
		const tickets = store.storedata.tickets;
		const sortedTickets = [];

		for (let ticket in tickets) {
			sortedTickets.push([ticket, tickets[ticket]]); // ['2000', ticketObject]
		}
		sortedTickets.sort((a, b) => {
			return b[1].lastUpdated - a[1].lastUpdated;
		});

		return [sortedTickets, store];
	}

	/**
	 * Creates new ticket object and adds to necessary parts of database
	 * @param {object} formData
	 * @param {string} storename
	 * @returns array
	 */
	async createNewTicket(formData, storename) {
		if (!helper.isValidPhone(formData.phone)) {
			return [{ phoneError: "Invalid phone number" }, formData];
		}

		const store = await helper.getStore(storename);
		const storeCustomers = store.storedata.customers;
		const storeTickets = store.storedata.tickets;

		const mostRecentTicketNum =
			(await helper.getLargestNum(Object.keys(storeTickets), 2000)) + 1;

		// Ticket object to add
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

		// If phone is not registered yet, create new customer also
		if (!storeCustomers.hasOwnProperty(formData.phone)) {
			await new Customer().createNewCustomer(formData, storename);
		} else {
			if (
				formData.firstname.trim().toLowerCase() !==
				storeCustomers[formData.phone].firstname
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
				storeCustomers[formData.phone].lastname
			) {
				return [
					{
						lastnameError: "Lastname doesnt match account on file",
					},
					formData,
				];
			}
		}

		// Add ticket database
		await storesCollection.updateOne(
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
					[`storedata.tickets.${[mostRecentTicketNum]}`]: ticket,
				},
			}
		);

		return [{}, ticket, mostRecentTicketNum];
	}

	/**
	 * gets ticket object for given ticketId
	 * @param {string} storename
	 * @param {string} ticketID
	 * @returns object
	 */
	async getTicketData(storename, ticketID) {
		const store = await helper.getStore(storename);
		return store.storedata.tickets[ticketID];
	}

	/**
	 * Updates the status of a ticket with the given selected
	 * @param {string} selection
	 * @param {string} ticketID
	 * @param {string} phone
	 * @param {string} storename
	 * @returns array
	 */
	async updateTicketStatus(selection, ticketID, phone, storename) {
		const latestUpdate = new Date().getTime();
		await storesCollection.updateOne(
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

		// Trigger event to reload a users ticket table when theres a change
		pusher.trigger("ticket-channel", "ticket-table-update", {
			message: ".",
		});
		const [tickets, store] = await this.updateTicketList(storename);
		// Trigger update event for dashboard ticket tables
		pusher.trigger("ticket-channel", "dashboard-table-update", {
			recentTickets: tickets,
		});
		return [tickets, store];
	}

	/**
	 * Updates the issue of a ticket with the given selected
	 * @param {string} selection
	 * @param {string} ticketID
	 * @param {string} phone
	 * @param {string} storename
	 * @returns array
	 */
	async updateTicketIssue(selection, ticketID, phone, storename) {
		const latestUpdate = new Date().getTime();
		await storesCollection.updateOne(
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
		// Trigger event to reload a users ticket table when theres a change
		pusher.trigger("ticket-channel", "ticket-table-update", {
			message: ".",
		});
		const [tickets, store] = await this.updateTicketList(storename);
		// Trigger update event for dashboard ticket tables
		pusher.trigger("ticket-channel", "dashboard-table-update", {
			recentTickets: tickets,
		});
		return tickets;
	}

	/**
	 * Updates description and subject of a ticket
	 * @param {string} storename
	 * @param {object} newInfo
	 * @param {string} phone
	 */
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
					[`storedata.tickets.${[ticketID]}.subject`]: newSubject,
					[`storedata.customers.${[phone]}.tickets.${[
						ticketID,
					]}.subject`]: newSubject,
				},
			}
		);
	}

	/**
	 * Updates shipping info of a ticket
	 * @param {object} shippingInfo
	 * @param {string} storename
	 */
	async updateTicketShippingInfo(shippingInfo, storename) {
		const { trackingNumber, carrier, ticketID, phone } = shippingInfo;

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

	/**
	 * Sends a text message to toPhone using Twilio api
	 * @param {string} storename
	 * @param {string} ticketID
	 * @param {string} toPhone
	 * @param {string} message
	 * @returns the message that was sent out to number
	 */
	async sendSms(user, ticketID, toPhone, message) {
		const { storename, fullname } = user;
		const store = await helper.getStore(storename);

		const subAccountSid = store.storedata.api.twilio.sid;
		const subAccountAuthToken = store.storedata.api.twilio.authToken;

		const twilioClient = client(subAccountSid, subAccountAuthToken);

		let subAccount = null;
		const timestamp = new Date().toLocaleString();

		subAccount = await twilioClient.incomingPhoneNumbers.list({
			limit: 20,
		});

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
										timestamp,
										from: "store",
										user: fullname,
										message: message.body,
									},
								],
							},
						},
					}
				);
				return message.body;
			})
			.catch((err) => {
				return err;
			});

		return [msg, timestamp];
	}

	/**
	 * Method called for when an incoming request is made to twilio webhook
	 * @param {object} smsData
	 */
	async receiveSms(smsData) {
		const subAccountSid = smsData.AccountSid;
		const message = smsData.Body;
		const fromNumber = smsData.From.substring(2);
		const timestamp = new Date().toLocaleString();
		const pusher = new Pusher({
			appId: "1259577",
			key: "e28b6821911a7e16e187",
			secret: "798adaa7d81ff3ecc1bc",
			cluster: "us2",
			useTLS: true,
		});

		//find subaccount to add msg to
		const store = await storesCollection.findOne({
			"storedata.api.twilio.sid": subAccountSid,
		});
		const storename = store.storename;

		let customerTickets = store.storedata.customers[fromNumber].tickets;

		let ticketsForMsg = [];
		Object.keys(customerTickets).forEach((ticketID) => {
			if (customerTickets[ticketID].status != "Resolved")
				ticketsForMsg.push(ticketID);
		});

		for (const ticket of ticketsForMsg) {
			await storesCollection.updateOne(
				{
					"storedata.api.twilio.sid": subAccountSid,
				},
				{
					$push: {
						[`storedata.tickets.${ticket}.smsData`]: {
							timestamp: timestamp,
							from: "client",
							user: fromNumber,
							message: message,
						},
					},
				}
			);
			await this.updateTicketStatus(
				"Reply",
				ticket,
				fromNumber,
				storename
			);
			pusher.trigger("sms-channel", ticket, {
				message: message,
				timestamp: timestamp,
			});
		}

		//also update the status of the ticket to CUSTOMER_REPLY
		//maybe setup socket.io connection here to display msg if user is on that page
	}

	/**
	 * Tracks a shipment with tracking # and carrier using Goshippo api
	 * @param {string} ticketID
	 * @param {string} storename
	 * @returns object
	 */
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
		if (!json.tracking_status) {
			return { tracking_error: "Tracking Info Invalid" };
		}

		return {
			from: json.address_from,
			to: json.address_to,
			eta: json.eta,
			status: json.tracking_status.status,
			location: json.tracking_status.location,
		};
	}
}

export default Ticket;
