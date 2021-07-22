const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// Login Page
router.get("/", forwardAuthenticated, userController.renderLogin);
// Login Handle
router.post("/login", userController.login);

// Logout Handle
router.post("/logout", userController.logout);

// Employee Register Page
router.get("/employee-register", userController.renderEmployeeRegister);
// Employee Register Handle
router.post("/employee-register", userController.employeeRegister);

// Password Recovery Page
router.get("/recovery", userController.renderRecovery);
// Password Recovery Handle
router.post("/forgot-password", userController.forgotPassword);

////////////////////////////////////////////////////
router.get("/overview", ensureAuthenticated, userController.renderOverview);

//NOT SETUP YET
// router.post("/update-account-info", ); FOR SAVE CHANGES BUTTON
// router.post("/time-clock", ); FOR TIME CLOCK
// router.post("/change-password", ); FOR CHANGE PASSWORD
// router.get("/tickets", userController.tickets);

module.exports = router;
