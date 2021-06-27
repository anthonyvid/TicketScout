const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");

router.get("/", userController.home);
// router.post("/login", userController.login);
// router.post("/register", userController.register);

module.exports = router;
