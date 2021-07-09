const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const routeGaurd = require("./routeGaurd.js");

//for admins
router.post("/register", adminController.register);
router.post("/invite-employee", adminController.inviteEmployee);

module.exports = router;
