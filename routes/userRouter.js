import * as userController from "../controllers/userController.js";
import { ensureAuthenticated, checkNotAuthenticated } from "../config/auth.js";
import express from "express";
import { catchError } from "../config/errors.js";
const router = express.Router();

//- Routes That Dont Require Middleware -//
// Login Handle
router.post("/login", catchError(userController.login));
// Logout Handle
router.get("/logout", catchError(userController.logout));
// Employee Register Handle
router.post("/employee-register", catchError(userController.employeeRegister));
// Password Recovery Handle
router.post("/forgot-password", catchError(userController.forgotPassword));

//- Routes That Require Middleware -//
// Login Page
router.get("/", checkNotAuthenticated, catchError(userController.renderLogin));
// Password Recovery Page
router.get(
	"/recovery",
	checkNotAuthenticated,
	catchError(userController.renderRecovery)
);
// Employee Register Page
router.get(
	"/employee-register",
	checkNotAuthenticated,
	catchError(userController.renderEmployeeRegister)
);
// Dashboard Page
router.get(
	"/dashboard",
	ensureAuthenticated,
	catchError(userController.renderDashboard)
);

router.get("/reset-password", catchError(userController.renderResetPassword));

//account settings page
router.get(
	"/account-settings",
	ensureAuthenticated,
	catchError(userController.renderAccountSettings)
);

router.get("/get-store", catchError(userController.getStoreData));

router.post(
	"/clock-in",
	ensureAuthenticated,
	catchError(userController.clockIn)
);
router.post(
	"/clock-out",
	ensureAuthenticated,
	catchError(userController.clockOut)
);

router.post(
	"/live-search-results",
	catchError(userController.liveSearchResults)
);
router.post(
	"/update-account-info",
	catchError(userController.updateAccountInfo)
);
router.post(
	"/change-account-password",
	catchError(userController.changeAccountPassword)
);

router.get("/verify-email/:id", catchError(userController.verifyEmailExists));

export default router;
