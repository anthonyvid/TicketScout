import { db } from "../db.js";
import * as helper from "./Helper.js";
const storesCollection = db.collection("stores");

class Payment {
	async updatePaymentsList(storename) {
		const store = await helper.getStore(storename);

		//create array sorted by recently updated
		const payments = store.storedata.payments;

		const sortedPayments = [];
		for (let payment in payments) {
			sortedPayments.push([payment, payments[payment]]);
		}
		sortedPayments.sort(function (a, b) {
			return a[1].firstname > b[1].firstname ? 1 : -1;
		});

		return [sortedPayments, store];
	}

	/**
	 * Function will search database for the stores payment settings
	 * @param {string} storename name of store
	 * @returns the payment settings of the store
	 */
	async getPaymentSettings(storename) {
		const store = await helper.getStore(storename);
		return store.storeSettings.payments;
	}

	async createNewpayment(formData, storename) {
		const customer = JSON.parse(formData.customer);
		const order = JSON.parse(formData.order);
		const { paymentMethod, orderTotal, linkedTicket } = formData;
		const store = await helper.getStore(storename);
		const storeCustomers = store.storedata.customers;
		const storePayments = store.storedata.payments;

		// If phone present, validate it
		if (customer.phone.length) {
			if (!helper.isValidPhone(customer.phone))
				return { phoneError: "Invalid Phone Number" };
			//see if that number is in store
			if (!Object.keys(storeCustomers).includes(customer.phone.trim()))
				return { phoneError: "Phone number not registered" };
		}

		// Get most recent payment number, increment by 1 to keep order
		const mostRecentPaymentID =
			helper.getLargestNum(Object.keys(storePayments), 99) + 1;

		const payment = {
			customer: {
				firstname: customer.firstname,
				lastname: customer.lastname,
				phone: customer.phone,
				email: customer.email,
			},
			orderTotal: orderTotal,
			orderItems: order,
			paymentMethod: paymentMethod,
			linkedTicket: linkedTicket,
			status: "approved",
			date: new Date().toDateString(),
		};

		if (customer.phone.length) {
			await storesCollection.updateOne(
				{ storename: storename },
				{
					$set: {
						[`storedata.customers.${[customer.phone]}.payments.${[
							mostRecentPaymentID,
						]}`]: {
							orderTotal: orderTotal,
							orderItems: order,
							paymentMethod: paymentMethod,
							linkedTicket: linkedTicket,
							status: "approved",
							date: new Date().toDateString(),
						},
					},
				}
			);
		}

		if (linkedTicket.length > 3) {
			await storesCollection.updateOne(
				{ storename: storename },
				{
					$set: {
						[`storedata.tickets.${[linkedTicket]}.payments.${[
							mostRecentPaymentID,
						]}`]: {
							orderTotal: orderTotal,
							orderItems: order,
							paymentMethod: paymentMethod,
							linkedTicket: linkedTicket,
							status: "approved",
							date: new Date().toDateString(),
						},
					},
				}
			);
		}

		await storesCollection.updateOne(
			{ storename: storename },
			{
				$set: {
					[`storedata.payments.${[mostRecentPaymentID]}`]: payment,
				},
			}
		);

		return { mostRecentPaymentID };
	}
	async getPaymentData(storename, paymentNumber) {
		const store = await helper.getStore(storename);
		return store.storedata.payments[paymentNumber];
	}
}

export default Payment;
