import * as helper from "./helper/helper.js";

const statusSelects = document.querySelectorAll(".status-selects");
const addTrackingInfo = document.querySelectorAll(".add_tracking_info");
const issueSelects = document.querySelectorAll(".issue-selects");
const statusOptions = document.querySelectorAll(".status-options");
const issueOptions = document.querySelectorAll(".issue-options");
const editCustomerInfo = document.getElementById("edit_customer_info");
const cancelChangeBtn = document.getElementById("cancel_info_change");
const submitChangeBtn = document.getElementById("submit_info_change");
const lastUpdated = document.getElementById("last_update_text");
const name = document.getElementById("name");
const phone = document.getElementById("customer_phone");
const email = document.getElementById("email");
const subject = document.getElementById("subject");
const description = document.getElementById("description");
const editFirstnameInput = document.getElementById("edit_firstname_field");
const editLastnameInput = document.getElementById("edit_lastname_field");
const editPhoneInput = document.getElementById("edit_phone_field");
const editEmailInput = document.getElementById("edit_email_field");
const editSubjectInput = document.getElementById("edit_subject_field");
const ticketID = document.getElementById("ticket_ID");
const documentBtn = document.querySelector(".document-btn");
const chatBoxTextarea = document.getElementById("chat_msg");
const sendMsg = document.getElementById("send_msg");
const trackingNumber = document.getElementById("tracking_number");
const carrierSelect = document.getElementById("carrier_select");

const currentTime = new Date().getTime();
const lastUpdateTime = Number(lastUpdated.textContent.replace(/\D/g, ""));
const timeDiffInSec = (currentTime - lastUpdateTime) / 1000;
const timeDiffInDays = timeDiffInSec / 60 / 60 / 24;
const timeDiffInMonths = timeDiffInDays * 30.417;

// Sets status colour after page loads
$(window).on("load", async () => {
	try {
		const response = await fetch("/get-store");
		const data = await response.json();
		const statusArray = data.store.storeSettings.tickets.status;
		// For each status, if selected, give it matched colour from settings
		for (const select of statusSelects) {
			for (let i = 0; i < statusArray.length; i++) {
				if (select.firstElementChild.text === statusArray[i][0]) {
					select.style.color = `#${statusArray[i][1]}`;
					select.previousElementSibling.style.color = `#${statusArray[i][1]}`;
				}
			}
		}
	} catch (error) {
		console.log(error);
	}
});

document.getElementById("submit_info_change").addEventListener("click", () => {
	const description = document.getElementById("edit_description_field").value;
	const subject = editSubjectInput.value;
	const id = ticketID.textContent.trim().replace("#", "");
	const customerPhone = phone.textContent.trim().replace(/\D/g, "");

	// Send post request to update ticket information
	(async () => {
		await helper.postReq("/update-ticket-info", {
			subject,
			description,
			ticketID: id,
			phone: customerPhone,
		});
	})();

	document.getElementById("edit_customer_info_form").submit();
});

/**
 * Prints customer label
 * TODO: Not setup yet
 */
function printCustomerLabel() {
	//need to figure out how im gonna make it print labels
	console.log("PRINT LABEL");
}

editCustomerInfo.addEventListener("click", () => {
	editCustomerInfo.classList.add("hidden");
	name.classList.add("hidden");
	phone.classList.add("hidden");
	email.classList.add("hidden");
	subject.classList.add("hidden");
	description.classList.add("hidden");
	editFirstnameInput.classList.remove("hidden");
	editLastnameInput.classList.remove("hidden");
	editPhoneInput.classList.remove("hidden");
	editEmailInput.classList.remove("hidden");
	editSubjectInput.classList.remove("hidden");
	description.classList.remove("hidden");
	cancelChangeBtn.classList.remove("hidden");
	submitChangeBtn.classList.remove("hidden");
});

cancelChangeBtn.addEventListener("click", () => {
	editCustomerInfo.classList.remove("hidden");
	name.classList.remove("hidden");
	phone.classList.remove("hidden");
	email.classList.remove("hidden");
	subject.classList.remove("hidden");
	description.classList.remove("hidden");
	editFirstnameInput.classList.add("hidden");
	editLastnameInput.classList.add("hidden");
	editPhoneInput.classList.add("hidden");
	editEmailInput.classList.add("hidden");
	editSubjectInput.classList.add("hidden");
	description.classList.add("hidden");
	cancelChangeBtn.classList.add("hidden");
	submitChangeBtn.classList.add("hidden");
});

for (const select of statusSelects) {
	select.addEventListener("change", (e) => {
		const id = ticketID.textContent.trim().replace("#", "");
		const selection = e.target.value;
		const phone = phone.textContent.trim().replace(/\D/g, "");

		// Send post request to update ticket status for ticket that was changed
		(async () => {
			await helper.postReq("/update-ticket-status", {
				selection,
				id,
				phone,
			});
			location.reload();
		})();
	});
}

document.querySelector(".new-payment-btn").addEventListener("click", () => {
	document.getElementById("create_new_payment_form").submit();
});

for (const select of issueSelects) {
	select.addEventListener("change", (e) => {
		const id = ticketID.textContent.trim().replace("#", "");
		const selection = e.target.value;
		const phone = phone.textContent.trim().replace(/\D/g, "");

		// Send post request to update ticket issue for ticket that was changed
		(async () => {
			await helper.postReq("/update-ticket-issue", {
				selection,
				id,
				phone,
			});
			location.reload();
		})();
	});
}

// Clears empty status, for bugs
for (const option of statusOptions) {
	if (option.text.trim().length == 0) {
		option.setAttribute("hidden", true);
	}
}

// Clears empty issue, for bugs
for (const option of issueOptions) {
	if (option.text.trim().length == 0) {
		option.setAttribute("hidden", true);
	}
}

// Calculates the last updated time for ticket
if (timeDiffInSec < 60) {
	lastUpdated.textContent = "Last updated: a minute ago";
} else if (timeDiffInSec > 59 && timeDiffInSec < 3600) {
	lastUpdated.textContent = `Last updated: ${Math.round(
		timeDiffInSec / 60
	)} minutes ago`;
} else if (timeDiffInSec > 3600 && timeDiffInSec < 7200) {
	lastUpdated.textContent = `Last updated: 1 hour ago`;
} else if (timeDiffInSec > 3600 && timeDiffInSec < 86400) {
	lastUpdated.textContent = `Last updated: ${Math.round(
		timeDiffInSec / 3600
	)} hours ago`;
} else if (timeDiffInSec > 86400 && timeDiffInSec < 172800) {
	lastUpdated.textContent = `Last updated: 1 day ago`;
} else if (timeDiffInSec > 172800 && timeDiffInDays < 30) {
	lastUpdated.textContent = `Last updated: ${Math.round(
		timeDiffInDays
	)} days ago`;
} else if (timeDiffInDays > 30 && timeDiffInDays < 60) {
	lastUpdated.textContent = `Last updated: 1 month ago`;
} else if (timeDiffInMonths > 1 && timeDiffInDays < 12) {
	lastUpdated.textContent = `Last updated: ${Math.round(
		timeDiffInMonths
	)} months ago`;
}

documentBtn.addEventListener("click", () => {
	printCustomerLabel();
});

for (const btn of addTrackingInfo) {
	btn.addEventListener("click", () => {
		btn.style.display = "none";
		document.querySelector(".tracking-field").style.display = "flex";
		document.getElementById("shipping_details").style.display = "none";
	});
}

document
	.getElementById("confirm_tracking_details")
	.addEventListener("click", () => {
		// Validate tracking details
		if (!trackingNumber.value) {
			helper.showInvalidColour(trackingNumber);
			return;
		} else if (
			helper.getSelectTagCurrentValue(carrierSelect) ===
			"Select a carrier"
		) {
			helper.showInvalidColour(carrierSelect);
			return;
		}

		const carrier = helper.getSelectTagCurrentValue(carrierSelect);
		const id = ticketID.textContent.trim().replace("#", "");
		const customerPhone = phone.textContent.trim().replace(/\D/g, "");

		// Send post request to update tracking details
		(async () => {
			await helper.postReq("/update-ticket-shipping-info", {
				trackingNumber: trackingNumber.value,
				carrier,
				ticketID: id,
				phone: customerPhone,
			});
		})();
		location.reload();
	});

sendMsg.addEventListener("click", () => {
	if (!chatBoxTextarea.value) {
		helper.showInvalidColour(chatBoxTextarea);
		return;
	}

	const message = chatBoxTextarea.value.trim();
	const toPhone = phone.textContent.trim().replace(/\D/g, "");
	const id = ticketID.textContent.trim().replace("#", "");

	// Send post request when message sent to customer
	(async () => {
		try {
			const data = await helper.postReq("/send-sms", {
				message,
				toPhone,
				ticketID: id,
			});

			// Add message text to chatbox
			const messageBox = document.createElement("div");
			messageBox.classList.add("message-box");
			const messageText = document.createElement("p");
			const text = document.createTextNode(data.msg);
			messageText.appendChild(text);
			messageText.classList.add("reply");
			messageBox.appendChild(messageText);
			document.querySelector(".chat-body").prepend(messageBox);
			chatBoxTextarea.value = "";
		} catch (error) {
			console.log(error);
		}
	})();
});
