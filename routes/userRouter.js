import * as userController from "../controllers/userController.js";
import { ensureAuthenticated, checkNotAuthenticated } from "../config/auth.js";
import express from "express";
import { catchError } from "../config/errors.js";

// Handles requests made to /routes/userRouter
const router = express.Router();

router.get("/logout", catchError(userController.logout));

router.get("/", checkNotAuthenticated, catchError(userController.renderLogin));

router.get(
	"/recovery",
	checkNotAuthenticated,
	catchError(userController.renderRecovery)
);

router.get(
	"/password-recovery",
	catchError(userController.renderPasswordRecovery)
);

router.get(
	"/employee-register",
	checkNotAuthenticated,
	catchError(userController.renderEmployeeRegister)
);

router.get(
	"/dashboard",
	ensureAuthenticated,
	catchError(userController.renderDashboard)
);

router.get("/reset-password", catchError(userController.renderResetPassword));

router.get(
	"/account-settings",
	ensureAuthenticated,
	catchError(userController.renderAccountSettings)
);

router.get("/get-store", catchError(userController.getStoreData));

router.get("/verify-email/:id", catchError(userController.verifyUserExists));

router.post("/recover-password", catchError(userController.recoverPassword));

router.post("/login", catchError(userController.login));

router.post("/employee-register", catchError(userController.employeeRegister));

router.post("/forgot-password", catchError(userController.forgotPassword));

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

export default router;
