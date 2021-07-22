const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const {
	ensureAuthenticated,
	forwardAuthenticated,
	checkNotAuthenticated,
} = require("../config/auth");

// Admin Register Page
router.get("/register", checkNotAuthenticated, adminController.renderRegister);
// Admin Register handle
router.post("/register", adminController.register);

// router.post("/invite-employee", adminController.inviteEmployee);

module.exports = router;
