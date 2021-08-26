import * as paymentController from "../controllers/paymentController.js";
import { ensureAuthenticated, checkNotAuthenticated } from "../config/auth.js";
import express from "express";
const router = express.Router();

//payments page
router.get("/", ensureAuthenticated, paymentController.renderStorePayments);

//create new payment page
router.post(
	"/new-payment",
	ensureAuthenticated,
	paymentController.renderCreateNewPayment
);

//create new payment handle
router.post(
	"/create-new-payment",
	ensureAuthenticated,
	paymentController.createNewPayment
);

//dynamic payments page
router.get(
	"/:paymentNumber",
	ensureAuthenticated,
	paymentController.renderPaymentProfile
);

export default router;
