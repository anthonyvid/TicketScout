"use strict";

const ticketAndCustomerBtn = document.getElementById(
	"create_customer_and_ticket"
);

ticketAndCustomerBtn.addEventListener(
	"click",
	() => {
		// Set input value to "true" string, not boolean
		document.getElementById("customer_data_exists").value = "true";
	},
	{ passive: true }
);
