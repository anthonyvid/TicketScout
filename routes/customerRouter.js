import * as customerController from "../controllers/customerController.js";
import { ensureAuthenticated, checkNotAuthenticated } from "../config/auth.js";
import express from "express";
import { catchError } from "../config/errors.js";
const router = express.Router();

router.get(
	"/",
	ensureAuthenticated,
	catchError(customerController.renderStoreCustomers)
);

router.get(
	"/:phone",
	ensureAuthenticated,
	catchError(customerController.renderCustomerProfile)
);

router.post(
	"/new-customer",
	ensureAuthenticated,
	catchError(customerController.renderCreateNewCustomer)
);

router.post(
	"/create-new-customer",
	ensureAuthenticated,
	catchError(customerController.createNewCustomer)
);

router.post(
	"/update-customer-contact-info",
	ensureAuthenticated,
	catchError(customerController.updateCustomerContactInfo)
);

export default router;
