import * as adminController from "../controllers/adminController.js";
import { ensureAuthenticated, checkNotAuthenticated } from "../config/auth.js";
import express from "express";
import { catchError } from "../config/errors.js";
const router = express.Router();

// Admin Register Page
router.get(
	"/register",
	checkNotAuthenticated,
	catchError(adminController.renderRegister)
);
// Admin Register handle
router.post("/register", catchError(adminController.register));

router.post(
	"/invite-employee",
	ensureAuthenticated,
	catchError(adminController.inviteEmployee)
);
router.post(
	"/remove-employee",
	ensureAuthenticated,
	catchError(adminController.removeEmployee)
);
router.post(
	"/toggle-admin-permissions",
	ensureAuthenticated,
	catchError(adminController.toggleAdminPermission)
);

router.post(
	"/delete-ticket",
	ensureAuthenticated,
	adminController.deleteTicket
);

router.post(
	"/delete-payment",
	ensureAuthenticated,
	adminController.deletePayment
);

router.post(
	"/get-employees-timeclock-history",
	catchError(adminController.getEmployeesTimeclockHistory)
);

router.post(
	"/add-category",
	ensureAuthenticated,
	catchError(adminController.addCategory)
);
router.post(
	"/remove-category",
	ensureAuthenticated,
	catchError(adminController.removeCategory)
);

router.post(
	"/update-store-taxRate",
	ensureAuthenticated,
	catchError(adminController.updateStoreTaxRate)
);

router.post(
	"/update-store-address",
	ensureAuthenticated,
	catchError(adminController.updateStoreAddress)
);

router.post(
	"/update-ticket-status-settings",
	ensureAuthenticated,
	catchError(adminController.updateTicketStatusSettings)
);
router.post(
	"/delete-ticket-status-settings",
	ensureAuthenticated,
	catchError(adminController.deleteTicketStatusSettings)
);

router.post(
	"/add-issue",
	ensureAuthenticated,
	catchError(adminController.addIssue)
);
router.post(
	"/remove-issue",
	ensureAuthenticated,
	catchError(adminController.removeIssue)
);

export default router;
