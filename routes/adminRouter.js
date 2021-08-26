import * as adminController from "../controllers/adminController.js";
import { ensureAuthenticated, checkNotAuthenticated } from "../config/auth.js";
import express from "express";
const router = express.Router();

// Admin Register Page
router.get("/register", checkNotAuthenticated, adminController.renderRegister);
// Admin Register handle
router.post("/register", adminController.register);

router.post(
	"/invite-employee",
	ensureAuthenticated,
	adminController.inviteEmployee
);
router.post(
	"/remove-employee",
	ensureAuthenticated,
	adminController.removeEmployee
);
router.post(
	"/toggle-admin-permissions",
	ensureAuthenticated,
	adminController.toggleAdminPermission
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
	adminController.getEmployeesTimeclockHistory
);

router.post("/add-category", ensureAuthenticated, adminController.addCategory);
router.post(
	"/remove-category",
	ensureAuthenticated,
	adminController.removeCategory
);

router.post(
	"/update-store-taxRate",
	ensureAuthenticated,
	adminController.updateStoreTaxRate
);

router.post(
	"/update-store-address",
	ensureAuthenticated,
	adminController.updateStoreAddress
);

router.post(
	"/update-ticket-status-settings",
	ensureAuthenticated,
	adminController.updateTicketStatusSettings
);
router.post(
	"/delete-ticket-status-settings",
	ensureAuthenticated,
	adminController.deleteTicketStatusSettings
);

router.post("/add-issue", ensureAuthenticated, adminController.addIssue);
router.post("/remove-issue", ensureAuthenticated, adminController.removeIssue);

export default router;
