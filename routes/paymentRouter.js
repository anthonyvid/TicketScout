import * as paymentController from "../controllers/paymentController.js";
import { ensureAuthenticated } from "../config/auth.js";
import express from "express";
import { catchError } from "../config/errors.js";

// Handles requests made to /routes/paymentRouter
const router = express.Router();

router.get(
	"/",
	ensureAuthenticated,
	catchError(paymentController.renderStorePayments)
);

router.get(
	"/:paymentNumber",
	ensureAuthenticated,
	catchError(paymentController.renderPaymentProfile)
);

router.post(
	"/new-payment",
	ensureAuthenticated,
	catchError(paymentController.renderCreateNewPayment)
);

router.post(
	"/create-new-payment",
	ensureAuthenticated,
	catchError(paymentController.createNewPayment)
);

export default router;
