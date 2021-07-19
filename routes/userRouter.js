const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Login Page
router.get("/", userController.renderLogin);
// Login Handle
router.post("/login", userController.login);

// Employee Register Page
router.get("/employee-register", userController.renderEmployeeRegister);
// Employee Register Handle
router.post("/employee-register", userController.employeeRegister);

// Password Recovery Page
router.get("/recovery", userController.renderRecovery);
// Password Recovery Handle
router.post("/forgot-password", userController.forgotPassword);

////////////////////////////////////////////////////

//NOT SETUP YET
// router.post("/update-account-info", ); FOR SAVE CHANGES BUTTON
// router.post("/time-clock", ); FOR TIME CLOCK
// router.post("/change-password", ); FOR CHANGE PASSWORD
// router.post("/logout", userController.logout);

// router.get("/tickets", userController.tickets);

// // Routes that require middleware
// router.post(
// 	"/login",
// 	userController.login,
// 	routeGaurd.isAccessGranted,
// 	userController.renderOverview
// );

// router.get("/overview", userController.renderOverview);

module.exports = router;
