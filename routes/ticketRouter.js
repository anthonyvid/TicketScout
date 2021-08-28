import * as ticketController from "../controllers/ticketController.js";
import { ensureAuthenticated, checkNotAuthenticated } from "../config/auth.js";
import express from "express";
import { catchError } from "../config/errors.js";
const router = express.Router();

// Tickets Page
router.get(
	"/",
	ensureAuthenticated,
	catchError(ticketController.renderStoreTickets)
);
// Create new ticket page
router.post(
	"/new-ticket",
	ensureAuthenticated,
	catchError(ticketController.renderCreateNewTicket)
);
//create new ticket handle
router.post(
	"/create-new-ticket",
	ensureAuthenticated,
	catchError(ticketController.createNewTicket)
);

//dynamic ticket page
router.get(
	"/:ticketID",
	ensureAuthenticated,
	catchError(ticketController.renderTicketProfile)
);

router.post(
	"/update-ticket-status",
	catchError(ticketController.updateTicketStatus)
);
router.post(
	"/update-ticket-issue",
	catchError(ticketController.updateTicketIssue)
);

router.post(
	"/update-ticket-info",
	ensureAuthenticated,
	catchError(ticketController.updateTicketInfo)
);

router.post(
	"/update-ticket-shipping-info",
	ensureAuthenticated,
	catchError(ticketController.updateTicketShippingInfo)
);

// Track a shipment Handle
router.post(
	"/track-shipment",
	ensureAuthenticated,
	catchError(ticketController.trackShipment)
);

router.post(
	"/send-sms",
	ensureAuthenticated,
	catchError(ticketController.sendSms)
);
router.post("/receive-sms", catchError(ticketController.receiveSms));
export default router;
