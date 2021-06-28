const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");

router.get("/", userController.renderLogin);
router.get("/register", userController.renderRegister);
router.get("/recovery", userController.renderRecovery);
router.post("/login", userController.login);
router.post("/register", userController.register);

module.exports = router;
