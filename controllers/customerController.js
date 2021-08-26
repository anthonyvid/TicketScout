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

export const renderCreateNewCustomer = function (req, res) {
	res.render(`logged-in/create-new-customer`, {
		layout: "layouts/logged-in-layout",
		user: req.user,
		phone: typeof req.body.phone !== "undefined" ? req.body.phone : "",
	});
};

//Create new customer handle
export const createNewCustomer = async function (req, res) {
	const customer = new Customer();
	const result = await customer.createNewCustomer(
		req.body,
		req.user.storename
	);
	const [ticketError, data] = result;

	// No errors
	if (Object.keys(ticketError).length == 0) {
		res.redirect(`/customers/${data.phone}`);
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

export const renderCustomerProfile = async function (req, res) {
	const customer = new Customer();
	const result = await customer.getCustomerData(
		req.user.storename,
		req.params.phone
	);
	res.render("logged-in/customer-profile", {
		layout: "layouts/logged-in-layout",
		user: req.user,
		customer: result,
	});
};

export const updateCustomerContactInfo = async function (req, res) {
	const customer = new Customer();
	const [updateErrors, newPhone] = await customer.updateCustomerContactInfo(
		req.user.storename,
		req.body
	);

	// No errors
	if (Object.keys(updateErrors).length === 0) {
		req.flash("success_update", "Successfully Updated Information");
		if (req.body.sentFrom === "customer") {
			res.redirect(`/customers/${newPhone}`);
		} else {
			res.redirect(`/tickets/${req.body.sentFrom.replace(/\D/g, "")}`);
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
