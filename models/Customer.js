import { db } from "../db.js";
import * as helper from "./Helper.js";
const storesCollection = db.collection("stores");

class Customer {
	async updateCustomerList(storename) {
		const store = await helper.getStore(storename);
		//create array sorted by recently updated
		const customers = store.storedata.customers;

		const sortedCustomers = [];
		for (let customer in customers) {
			sortedCustomers.push([customer, customers[customer]]);
		}

		sortedCustomers.sort(function (a, b) {
			return a[1].firstname > b[1].firstname ? 1 : -1;
		});

		return [sortedCustomers, store];
	}

	async createNewCustomer(formData, storename) {
		//validate phone number
		if (!helper.isValidPhone(formData.phone))
			return [{ phoneError: "Invalid phone number" }, formData];

		if (formData.phone.length !== 9)
			return [{ phoneError: "Phone number must be 10 digits" }, formData];

		const store = await helper.getStore(storename);

		//check if phone number is already registered
		if (store.storedata.customers.hasOwnProperty(formData.phone)) {
			return [{ phoneError: "Customer already in system" }, formData];
		}

		//add customer info to store.storedata.customers
		const customer = {
			firstname: formData.firstname.trim().toLowerCase(),
			lastname: formData.lastname.trim().toLowerCase(),
			phone: formData.phone.trim(),
			email: formData.email.trim().toLowerCase(),
			payments: {},
			tickets: {},
			dateJoined: new Date().toDateString(),
		};

		try {
			await storesCollection.updateOne(
				{
					storename: storename,
				},
				{
					$set: {
						[`storedata.customers.${[formData.phone]}`]: customer,
					},
				}
			);
		} catch (error) {
			console.error(error);
			return [
				{ phoneError: "Error creating customer - contact support" },
				formData,
			];
		}

		return [{}, customer];
	}

	async getCustomerData(storename, phone) {
		const store = await helper.getStore(storename);
		return store.storedata.customers[phone];
	}

	async updateCustomerContactInfo(storename, newInfo) {
		let { newFirstname, newLastname, oldPhone, newPhone, newEmail } =
			newInfo;

		//New Data to store, not yet validated
		newFirstname = newFirstname.trim().toLowerCase();
		newLastname = newLastname.trim().toLowerCase();
		newPhone = newPhone.trim();
		oldPhone = oldPhone.trim().replace(/\D/g, "");
		newEmail = newEmail.trim().toLowerCase();

		const store = await helper.getStore(storename);

		//validate newPhone and newEmail
		if (newPhone.length > 0) {
			if (!helper.isValidPhone(newPhone))
				return [{ phoneError: "Not a valid phone number" }, ""];
		}

		if (newEmail.length > 0)
			if (!helper.isValidEmail(newEmail))
				return [{ emailError: "Not a valid email" }, ""];

		//see if phone is already in system
		if (
			oldPhone !== newPhone &&
			store.storedata.customers.hasOwnProperty(newPhone)
		)
			return [{ phoneError: "Phone already in system" }, ""];
		else if (oldPhone !== newPhone) {
			//update customers phone number
			await storesCollection.updateOne(
				{
					storename: storename,
				},
				{
					$rename: {
						[`storedata.customers.${[
							oldPhone,
						]}`]: `storedata.customers.${newPhone}`,
					},
				}
			);
		}

		//update info in customers.phone object
		await storesCollection.updateOne(
			{
				storename: storename,
			},
			{
				$set: {
					[`storedata.customers.${[newPhone]}.phone`]: newPhone,
					[`storedata.customers.${[newPhone]}.firstname`]:
						newFirstname,
					[`storedata.customers.${[newPhone]}.lastname`]: newLastname,
					[`storedata.customers.${[newPhone]}.email`]: newEmail,
				},
			}
		);

		const ticketsToUpdate = Object.keys(
			store.storedata.customers[oldPhone]?.tickets
		);

		for (const ticket of ticketsToUpdate) {
			await storesCollection.updateOne(
				{ storename: storename },
				{
					$set: {
						[`storedata.tickets.${[ticket]}.customer.firstname`]:
							newFirstname,
						[`storedata.tickets.${[ticket]}.customer.lastname`]:
							newLastname,
						[`storedata.tickets.${[ticket]}.customer.phone`]:
							newPhone,
						[`storedata.tickets.${[ticket]}.customer.email`]:
							newEmail,
					},
				}
			);
		}

		const paymentsToUpdate = Object.keys(
			store.storedata.customers[oldPhone]?.payments
		);

		for (const payment of paymentsToUpdate) {
			await storesCollection.updateOne(
				{ storename: storename },
				{
					$set: {
						[`storedata.payments.${[payment]}.customer.firstname`]:
							newFirstname,
						[`storedata.payments.${[payment]}.customer.lastname`]:
							newLastname,
						[`storedata.payments.${[payment]}.customer.phone`]:
							newPhone,
						[`storedata.payments.${[payment]}.customer.email`]:
							newEmail,
					},
				}
			);
		}

		return [{}, newPhone];
	}
}

export default Customer;
