"use strict";

const ticketAndCustomerBtn = document.getElementById(
	"create_customer_and_ticket"
);
const newCustomerForm = document.getElementById("create_new_customer_form");

ticketAndCustomerBtn.addEventListener(
	"click",
	() => {
		newCustomerForm.action = "/tickets/new-ticket";
		newCustomerForm.submit();
	},
	{ passive: true }
);
