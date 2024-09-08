"use strict";
import * as helper from "./helper/helper.js";

const documentBtn = document.querySelector(".document-btn");
const resolveTicketBtn = document.querySelector(".resolve-ticket");

documentBtn.addEventListener("click", helper.print);

if (resolveTicketBtn) {
	resolveTicketBtn.addEventListener(
		"click",
		async () => {
			const id = document
				.getElementById("linked_ticket")
				.textContent.substring(1);
			const phone = document
				.getElementById("customer_phone")
				.textContent.trim()
				.replace(/\D/g, "");

			await helper.postReq("/tickets/update-ticket-status", {
				selection: "Resolved",
				id,
				phone,
			});
			const base_url = window.location.origin;
			window.location = base_url + "/tickets";
		},
		{
			passive: true,
		}
	);
}
