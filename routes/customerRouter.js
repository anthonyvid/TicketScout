import * as customerController from "../controllers/customerController.js";
import { ensureAuthenticated, checkNotAuthenticated } from "../config/auth.js";
import express from "express";
const router = express.Router();

router.get("/", ensureAuthenticated, customerController.renderStoreCustomers);

// create new customer page
router.post(
	"/new-customer",
	ensureAuthenticated,
	customerController.renderCreateNewCustomer
);

//create new customer handle
router.post(
	"/create-new-customer",
	ensureAuthenticated,
	customerController.createNewCustomer
);

//dynamic customer page
router.get(
	"/:phone",
	ensureAuthenticated,
	customerController.renderCustomerProfile
);

router.post(
	"/update-customer-contact-info",
	ensureAuthenticated,
	customerController.updateCustomerContactInfo
);

export default router;
