import * as ticketController from "../controllers/ticketController.js";
import { ensureAuthenticated, checkNotAuthenticated } from "../config/auth.js";
import express from "express";
import { catchError } from "../config/errors.js";

// Handles requests made to /routes/ticketRouter
const router = express.Router();

router.get(
	"/",
	ensureAuthenticated,
	catchError(ticketController.renderStoreTickets)
);

router.get(
	"/:ticketID",
	ensureAuthenticated,
	catchError(ticketController.renderTicketProfile)
);

router.post(
	"/new-ticket",
	ensureAuthenticated,
	catchError(ticketController.renderCreateNewTicket)
);

router.post(
	"/create-new-ticket",
	ensureAuthenticated,
	catchError(ticketController.createNewTicket)
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

router.post(
	"/track-shipment",
	ensureAuthenticated,
	ticketController.trackShipment
);

router.post(
	"/send-sms",
	ensureAuthenticated,
	catchError(ticketController.sendSms)
);
router.post("/receive-sms", catchError(ticketController.receiveSms));

export default router;
