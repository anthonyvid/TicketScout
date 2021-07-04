const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const adminController = require("./controllers/adminController");

router.get("/", userController.renderLogin);
router.get("/register", userController.renderRegister);
router.get("/employee-register", userController.renderEmployeeRegister);
router.get("/recovery", userController.renderRecovery);
router.post("/login", userController.login);
router.post("/register", adminController.register);
router.post("/invite-employee", adminController.inviteEmployee); //for when admin invites employee to store
router.post("/join-store", userController.joinStore);

module.exports = router;
