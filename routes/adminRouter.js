import * as adminController from "../controllers/adminController.js";
import { ensureAuthenticated, checkNotAuthenticated } from "../config/auth.js";
import express from "express";
import { catchError } from "../config/errors.js";
const router = express.Router();

router.get(
	"/register",
	checkNotAuthenticated,
	catchError(adminController.renderRegister)
);

router.post("/register", catchError(adminController.registerAdmin));

router.post(
	"/invite-employee",
	ensureAuthenticated,
	catchError(adminController.inviteEmployee)
);
router.post(
	"/delete-employee",
	ensureAuthenticated,
	catchError(adminController.deleteEmployee)
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
	"/delete-category",
	ensureAuthenticated,
	catchError(adminController.deleteCategory)
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
	"/delete-issue",
	ensureAuthenticated,
	catchError(adminController.deleteIssue)
);

export default router;
