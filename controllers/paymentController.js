import Payment from "../models/Payment.js";

export const renderStorePayments = async function (req, res) {
	const payment = new Payment();
	const [result, store] = await payment.updatePaymentsList(
		req.user.storename
	);
	res.render("logged-in/payments", {
		layout: "layouts/logged-in-layout",
		user: req.user,
		payments: result,
		store: store,
	});
};

export const renderCreateNewPayment = async function (req, res) {
	const payment = new Payment();
	const paymentSettings = await payment.getPaymentSettings(
		req.user.storename
	);

	res.render(`logged-in/create-new-payment`, {
		layout: "layouts/logged-in-layout",
		user: req.user,
		payments: paymentSettings,
		firstname:
			typeof req.body.firstname !== "undefined" ? req.body.firstname : "",
		lastname:
			typeof req.body.lastname !== "undefined" ? req.body.lastname : "",
		phone: typeof req.body.phone !== "undefined" ? req.body.phone : "",
		email: typeof req.body.email !== "undefined" ? req.body.email : "",
	});
};

export const createNewPayment = async function (req, res) {
	const payment = new Payment();

	const result = await payment.createNewpayment(req.body, req.user.storename);

	if (!result.hasOwnProperty("phoneError")) {
		res.redirect(`/payments/${result.mostRecentPaymentID}`);
	} else {
		console.log("errors");

		const paymentSettings = await payment.getPaymentSettings(
			req.user.storename
		);

		res.render("logged-in/create-new-payment", {
			layout: "layouts/logged-in-layout",
			user: req.user,
			ticketError: Object.values(result),
			phone: undefined,
			payments: paymentSettings,
		});
	}
};

export const renderPaymentProfile = async function (req, res) {
	const payment = new Payment();
	const result = await payment.getPaymentData(
		req.user.storename,
		req.params.paymentNumber
	);

	const store = await payment.getStore(req.user.storename);
	res.render("logged-in/payment-profile", {
		layout: "layouts/logged-in-layout",
		user: req.user,
		payment: result,
		paymentNumber: req.params.paymentNumber,
		store: store,
	});
};
