const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const routeGaurd = require("./routeGaurd.js");

// Routes that done require middleware
router.get("/", userController.renderLogin);
router.get("/register", userController.renderRegister);
router.get("/employee-register", userController.renderEmployeeRegister);
router.get("/recovery", userController.renderRecovery);

router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/employee-register", userController.employeeRegister);

//NOT SETUP YET
// router.post("/update-account-info", ); FOR SAVE CHANGES BUTTON
// router.post("/time-clock", ); FOR TIME CLOCK
// router.post("/change-password", ); FOR CHANGE PASSWORD
// router.post("/logout", userController.logout);

router.get("/tickets", userController.tickets);

// Routes that require middleware
router.get("/overview", routeGaurd.isAccessGranted, userController.renderHome);

module.exports = router;
