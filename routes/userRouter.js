const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
	ensureAuthenticated,
	checkNotAuthenticated,
} = require("../config/auth");

//- Routes That Dont Require Middleware -//
// Login Handle
router.post("/login", userController.login);
// Logout Handle
router.get("/logout", userController.logout);
// Employee Register Handle
router.post("/employee-register", userController.employeeRegister);
// Password Recovery Handle
router.post("/forgot-password", userController.forgotPassword);

//- Routes That Require Middleware -//
// Login Page
router.get("/", checkNotAuthenticated, userController.renderLogin);
// Password Recovery Page
router.get("/recovery", checkNotAuthenticated, userController.renderRecovery);
// Employee Register Page
router.get(
	"/employee-register",
	checkNotAuthenticated,
	userController.renderEmployeeRegister
);
// Dashboard Page
router.get("/dashboard", ensureAuthenticated, userController.renderDashboard);
// Tickets Page
router.get("/tickets", ensureAuthenticated, userController.renderStoreTickets);
router.get(
	"/customers",
	ensureAuthenticated,
	userController.renderStoreCustomers
);
// Customers Page
// router.get("/customers", userController.renderCustomers);
// Track a shipment Handle
router.post(
	"/track-shipment",
	ensureAuthenticated,
	userController.trackShipment
);

// Create new ticket page
router.get(
	"/new-ticket",
	ensureAuthenticated,
	userController.renderCreateNewTicket
);
// create new customer page
router.get(
	"/new-customer",
	ensureAuthenticated,
	userController.renderCreateNewCustomer
);
//create new payment page
router.get(
	"/new-payment",
	ensureAuthenticated,
	userController.renderCreateNewPayment
);

//account settings page
router.get(
	"/account-settings",
	ensureAuthenticated,
	userController.renderAccountSettings
);
//create new ticket handle
router.post(
	"/create-new-ticket",
	ensureAuthenticated,
	userController.createNewTicket
);
//create new customer handle
router.post(
	"/create-new-customer",
	ensureAuthenticated,
	userController.createNewCustomer
);
//create new payment handle
router.post(
	"/create-new-payment",
	ensureAuthenticated,
	userController.createNewPayment
);
//dynamic customer page
router.get(
	"/customers/:phone",
	ensureAuthenticated,
	userController.renderCustomerProfile
);
//dynamic ticket page
router.get(
	"/tickets/:ticketID",
	ensureAuthenticated,
	userController.renderTicketProfile
);
router.post("/get-phone", userController.getPhone);
router.post("/update-ticket-status", userController.updateTicketStatus);
router.post("/update-ticket-issue", userController.updateTicketIssue);
router.get("/get-store", userController.getStore);

router.post(
	"/update-customer-contact-info",
	ensureAuthenticated,
	userController.updateCustomerContactInfo
);
router.post(
	"/update-ticket-info",
	ensureAuthenticated,
	userController.updateTicketInfo
);
router.post(
	"/update-ticket-shipping-info",
	ensureAuthenticated,
	userController.updateTicketShippingInfo
);
router.post("/send-sms", ensureAuthenticated, userController.sendSms);
// router.post("/", (req, res) => {
// 	console.log(req.body);
// });

router.post("/ticketscout.herokuapp.com/recieveSms", (req, res) => {
	const params = Object.assign(req.query, req.body);
	console.log(params);
	res.status(204).send();
});
router.get("/ticketscout.herokuapp.com/recieveSms", (req, res) => {
	const params = Object.assign(req.query, req.body);
	console.log(params);
	res.status(204).send();
});

module.exports = router;
