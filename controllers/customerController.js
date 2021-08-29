import Customer from "../models/Customer.js";

export const renderStoreCustomers = async function (req, res) {
	const customer = new Customer();
	const [result, store] = await customer.updateCustomerList(
		req.user.storename
	);
	res.render("logged-in/customers", {
		layout: "layouts/logged-in-layout",
		user: req.user,
		customers: result,
		store: store,
	});
};

export const renderCustomerProfile = async function (req, res) {
	const customer = new Customer();
	const result = await customer.getCustomerData(
		req.user.storename,
		req.params.phone
	);
	res.status(200).render("logged-in/customer-profile", {
		layout: "layouts/logged-in-layout",
		user: req.user,
		customer: result,
	});
};

export const renderCreateNewCustomer = function (req, res) {
	res.status(200).render(`logged-in/create-new-customer`, {
		layout: "layouts/logged-in-layout",
		user: req.user,
		phone: typeof req.body.phone !== "undefined" ? req.body.phone : "",
	});
};

export const createNewCustomer = async function (req, res) {
	const customer = new Customer();
	const result = await customer.createNewCustomer(
		req.body,
		req.user.storename
	);
	const [ticketError, data] = result;

	if (!Object.keys(ticketError).length) {
		res.status(200).redirect(`/customers/${data.phone}`);
	} else {
		res.render("logged-in/create-new-customer", {
			layout: "layouts/logged-in-layout",
			user: req.user,
			ticketError: Object.values(ticketError),
			firstname: data.firstname,
			lastname: data.lastname,
			phone: undefined,
			email: data.email,
		});
	}
};

export const updateCustomerContactInfo = async function (req, res) {
	const customer = new Customer();
	const [updateErrors, newPhone] = await customer.updateCustomerContactInfo(
		req.user.storename,
		req.body
	);

	if (!Object.keys(updateErrors).length) {
		req.flash("success_update", "Successfully Updated Information");
		if (req.body.sentFrom === "customer") {
			res.status(200).redirect(`/customers/${newPhone}`);
		} else {
			res.status(200).redirect(
				`/tickets/${req.body.sentFrom.replace(/\D/g, "")}`
			);
		}
	} else {
		const previousData = await customer.getCustomerData(
			req.user.storename,
			req.body.oldPhone.trim().replace(/\D/g, "")
		);

		res.render(`logged-in/customer-profile`, {
			layout: "layouts/logged-in-layout",
			updateErrors: Object.values(updateErrors),
			user: req.user,
			customer: previousData,
		});
	}
};
