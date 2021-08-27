import * as userController from "../controllers/userController.js";
import { ensureAuthenticated, checkNotAuthenticated } from "../config/auth.js";
import express from "express";
const router = express.Router();

//- Routes That Dont Require Middleware -//
// Login Handle
router.post("/login", userController.login);
// Logout Handle
router.get("/logout", userController.logout);
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

router.get("/reset-password", userController.renderResetPassword);
// Customers Page
// router.get("/customers", userController.renderCustomers);

//account settings page
router.get(
	"/account-settings",
	ensureAuthenticated,
	userController.renderAccountSettings
);

router.get("/get-store", userController.getStoreData);

router.post("/clock-in", ensureAuthenticated, userController.clockIn);
router.post("/clock-out", ensureAuthenticated, userController.clockOut);

router.post("/live-search-results", userController.liveSearchResults);
router.post("/update-account-info", userController.updateAccountInfo);
router.post("/change-account-password", userController.changeAccountPassword);

router.get("/verify-email/:id", userController.verifyEmailExists);

export default router;
