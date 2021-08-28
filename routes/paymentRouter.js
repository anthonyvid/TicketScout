import * as paymentController from "../controllers/paymentController.js";
import { ensureAuthenticated, checkNotAuthenticated } from "../config/auth.js";
import express from "express";
import { catchError } from "../config/errors.js";
const router = express.Router();

//payments page
router.get(
	"/",
	ensureAuthenticated,
	catchError(paymentController.renderStorePayments)
);

//create new payment page
router.post(
	"/new-payment",
	ensureAuthenticated,
	catchError(paymentController.renderCreateNewPayment)
);

//create new payment handle
router.post(
	"/create-new-payment",
	ensureAuthenticated,
	catchError(paymentController.createNewPayment)
);

//dynamic payments page
router.get(
	"/:paymentNumber",
	ensureAuthenticated,
	catchError(paymentController.renderPaymentProfile)
);

export default router;
