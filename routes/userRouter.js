const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
	ensureAuthenticated,
	forwardAuthenticated,
	checkNotAuthenticated,
} = require("../config/auth");

//- Routes That Dont Require Middleware -//
// Login Handle
router.post("/login", userController.login);
// Logout Handle
router.post("/logout", userController.logout);
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
router.get("/tickets", userController.renderTickets);

//NOT SETUP YET
// router.post("/update-account-info", );
// router.post("/time-clock", );
// router.post("/change-password", );

module.exports = router;
