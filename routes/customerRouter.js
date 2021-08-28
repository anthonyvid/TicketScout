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

// create new customer page
router.post(
	"/new-customer",
	ensureAuthenticated,
	catchError(customerController.renderCreateNewCustomer)
);

//create new customer handle
router.post(
	"/create-new-customer",
	ensureAuthenticated,
	catchError(customerController.createNewCustomer)
);

//dynamic customer page
router.get(
	"/:phone",
	ensureAuthenticated,
	catchError(customerController.renderCustomerProfile)
);

router.post(
	"/update-customer-contact-info",
	ensureAuthenticated,
	catchError(customerController.updateCustomerContactInfo)
);

export default router;
