import * as ticketController from "../controllers/ticketController.js";
import { ensureAuthenticated, checkNotAuthenticated } from "../config/auth.js";
import express from "express";
const router = express.Router();

// Tickets Page
router.get("/", ensureAuthenticated, ticketController.renderStoreTickets);
// Create new ticket page
router.post(
	"/new-ticket",
	ensureAuthenticated,
	ticketController.renderCreateNewTicket
);
//create new ticket handle
router.post(
	"/create-new-ticket",
	ensureAuthenticated,
	ticketController.createNewTicket
);

//dynamic ticket page
router.get(
	"/:ticketID",
	ensureAuthenticated,
	ticketController.renderTicketProfile
);

router.post("/update-ticket-status", ticketController.updateTicketStatus);
router.post("/update-ticket-issue", ticketController.updateTicketIssue);

router.post(
	"/update-ticket-info",
	ensureAuthenticated,
	ticketController.updateTicketInfo
);

router.post(
	"/update-ticket-shipping-info",
	ensureAuthenticated,
	ticketController.updateTicketShippingInfo
);

// Track a shipment Handle
router.post(
	"/track-shipment",
	ensureAuthenticated,
	ticketController.trackShipment
);

router.post("/send-sms", ensureAuthenticated, ticketController.sendSms);
router.post("/receive-sms", ticketController.receiveSms);
export default router;
