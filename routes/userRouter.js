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

// Routes that require middleware
router.get("/home", routeGaurd.isAccessGranted, userController.renderHome);

module.exports = router;
