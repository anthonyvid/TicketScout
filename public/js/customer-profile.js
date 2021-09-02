"use strict";

const editCustomerInfo = document.getElementById("edit_customer_info");
const cancelChangeBtn = document.getElementById("cancel_info_change");
const submitChangeBtn = document.getElementById("submit_info_change");
const createNewForm = document.getElementById("create_new_form");
const newTicketBtn = document.querySelector(".new-ticket-btn");
const newPaymentBtn = document.querySelector(".new-payment-btn");
const ticketTable = document.getElementById("ticket_table");
const ticketTableRows = document.querySelectorAll(".ticket-row");

for (const row of ticketTableRows) {
	const status =
		row.lastElementChild.previousElementSibling.textContent.trim();
	if (status == "Resolved") {
		row.remove();
		ticketTable.appendChild(row);
	}
}

editCustomerInfo.addEventListener(
	"click",
	() => {
		editCustomerInfo.classList.add("hidden");
		document.getElementById("name").classList.add("hidden");
		document.getElementById("phone").classList.add("hidden");
		document.getElementById("email").classList.add("hidden");
		document
			.getElementById("edit_firstname_field")
			.classList.remove("hidden");
		document
			.getElementById("edit_lastname_field")
			.classList.remove("hidden");
		document.getElementById("edit_phone_field").classList.remove("hidden");
		document.getElementById("edit_email_field").classList.remove("hidden");
		cancelChangeBtn.classList.remove("hidden");
		submitChangeBtn.classList.remove("hidden");
	},
	{ passive: true }
);

cancelChangeBtn.addEventListener(
	"click",
	() => {
		editCustomerInfo.classList.remove("hidden");
		document.getElementById("name").classList.remove("hidden");
		document.getElementById("phone").classList.remove("hidden");
		document.getElementById("email").classList.remove("hidden");
		document.getElementById("edit_firstname_field").classList.add("hidden");
		document.getElementById("edit_lastname_field").classList.add("hidden");
		document.getElementById("edit_phone_field").classList.add("hidden");
		document.getElementById("edit_email_field").classList.add("hidden");
		cancelChangeBtn.classList.add("hidden");
		submitChangeBtn.classList.add("hidden");
	},
	{ passive: true }
);

newTicketBtn.addEventListener(
	"click",
	() => {
		createNewForm.action = "/tickets/new-ticket";
		createNewForm.submit();
	},
	{ passive: true }
);

newPaymentBtn.addEventListener(
	"click",
	() => {
		createNewForm.action = "/payments/new-payment";
		createNewForm.submit();
	},
	{ passive: true }
);
