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
router.get("/tickets", userController.renderStoreTickets);
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
//create new invoice page
router.get(
	"/new-invoice",
	ensureAuthenticated,
	userController.renderCreateNewInvoice
);
//create new estimate page
router.get(
	"/new-estimate",
	ensureAuthenticated,
	userController.renderCreateNewEstimate
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
//dynamic customer page
router.get(
	"/customers/:phone",
	ensureAuthenticated,
	userController.renderCustomer
);
//dynamic ticket page
router.get(
	"/tickets/:ticketID",
	ensureAuthenticated,
	userController.renderTicket
);

module.exports = router;
