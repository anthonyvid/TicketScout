"use strict";

import * as helper from "./helper/helper.js";

const lastUpdated = document.querySelectorAll(".last-update-text");
const tableRows = document.querySelectorAll("#table_row");
const statusOptions = document.querySelectorAll(".status-options");
const issueOptions = document.querySelectorAll(".issue-options");
const statusSelects = document.querySelectorAll(".status-selects");
const issueSelects = document.querySelectorAll(".issue-selects");
const idSearchBox = document.getElementById("search_ID");
const customerSearchBox = document.getElementById("search_customer");
const subjectSearchBox = document.getElementById("search_subject");
const statusSearchBox = document.getElementById("search_status");
const lastUpdatedHeader = document.getElementById("last_updated_header");
const hideResolvedTickets = document.getElementById("hide_resolved_tickets");

var pusher = new Pusher("e28b6821911a7e16e187", {
	cluster: "us2",
});
var channel = pusher.subscribe("ticket-channel");

channel.bind("ticket-table-update", () => {
	location.reload();
});
/**
 * Will hide all tickets with status as "Resolved"
 */
const clearResolvedTickets = () => {
	for (const row of tableRows) {
		const status =
			row.firstElementChild.nextElementSibling.nextElementSibling
				.nextElementSibling.firstElementChild.firstElementChild
				.nextElementSibling.value;
		if (status == "Resolved") {
			row.style.display = "none";
		}
	}
};
clearResolvedTickets(); // Run asap

/**
 * Will show all tickets marked with status as "Resolved"
 */
const showResolvedTickets = () => {
	for (const row of tableRows) {
		const status =
			row.firstElementChild.nextElementSibling.nextElementSibling
				.nextElementSibling.firstElementChild.firstElementChild
				.nextElementSibling.value;
		if (status == "Resolved") {
			row.style.display = "flex";
		}
	}
};

/**
 * Filter table by ticket IDs
 */
const searchForID = () => {
	for (const row of tableRows) {
		const id = row.firstElementChild.firstElementChild.text;
		if (id.indexOf(idSearchBox.value) > -1) {
			row.style.display = "flex";
			clearResolvedTickets();
		} else {
			row.style.display = "none";
		}
	}
};

/**
 * Filter table by customer name
 */
const searchForCustomer = () => {
	for (const row of tableRows) {
		const name =
			row.firstElementChild.nextElementSibling.firstElementChild.text;
		if (
			name.toUpperCase().indexOf(customerSearchBox.value.toUpperCase()) >
			-1
		) {
			row.style.display = "flex";
			clearResolvedTickets();
			1;
		} else {
			row.style.display = "none";
		}
	}
};

/**
 * Filter table by ticket subject
 */
const searchForSubject = () => {
	for (const row of tableRows) {
		const subject =
			row.firstElementChild.nextElementSibling.nextElementSibling
				.firstElementChild.text;
		if (
			subject
				.toUpperCase()
				.indexOf(subjectSearchBox.value.toUpperCase()) > -1
		) {
			row.style.display = "flex";
			clearResolvedTickets();
		} else {
			row.style.display = "none";
		}
	}
};

/**
 * Filter table by ticket status
 */
const searchForStatus = () => {
	for (const row of tableRows) {
		const status =
			row.firstElementChild.nextElementSibling.nextElementSibling
				.nextElementSibling.firstElementChild.firstElementChild
				.nextElementSibling.value;

		if (
			status.toUpperCase().indexOf(statusSearchBox.value.toUpperCase()) >
			-1
		) {
			row.style.display = "flex";
			hideResolvedTickets.checked = false;
		} else {
			row.style.display = "none";
		}
	}
};

// Table filters
idSearchBox.addEventListener("input", searchForID, { passive: true });
customerSearchBox.addEventListener("input", searchForCustomer, {
	passive: true,
});
subjectSearchBox.addEventListener("input", searchForSubject, { passive: true });
statusSearchBox.addEventListener("input", searchForStatus, { passive: true });

// Hide tickets with 'Resolved' Status if checkbox checked
hideResolvedTickets.addEventListener("click", () => {
	if (hideResolvedTickets.checked) {
		clearResolvedTickets();
	} else {
		showResolvedTickets();
	}
});

// Reverse table by last updated if selected
lastUpdatedHeader.firstElementChild.addEventListener("click", () => {
	let tbody = $("table tbody");
	tbody.html($("tr", tbody).get().reverse());
});

// Convert all last updated values from ms to readable format
for (const element of lastUpdated) {
	const currentTime = new Date().getTime();
	const lastUpdateTime = Number(element.textContent);
	const timeDiffInSec = (currentTime - lastUpdateTime) / 1000;
	const timeDiffInDays = timeDiffInSec / 60 / 60 / 24;
	const timeDiffInMonths = timeDiffInDays * 30.417;

	if (timeDiffInSec < 60) {
		element.textContent = "A minute ago";
	} else if (timeDiffInSec > 59 && timeDiffInSec < 3600) {
		element.textContent = `${Math.round(timeDiffInSec / 60)} minutes ago`;
	} else if (timeDiffInSec > 3600 && timeDiffInSec < 7200) {
		element.textContent = `1 hour ago`;
	} else if (timeDiffInSec > 3600 && timeDiffInSec < 86400) {
		element.textContent = `${Math.round(timeDiffInSec / 3600)} hours ago`;
	} else if (timeDiffInSec > 86400 && timeDiffInSec < 172800) {
		element.textContent = `1 day ago`;
	} else if (timeDiffInSec > 172800 && timeDiffInDays < 30) {
		element.textContent = `${Math.round(timeDiffInDays)} days ago`;
	} else if (timeDiffInDays > 30 && timeDiffInDays < 60) {
		element.textContent = `1 month ago`;
	} else if (timeDiffInMonths > 1 && timeDiffInDays < 12) {
		element.textContent = `${Math.round(timeDiffInMonths)} months ago`;
	}
}

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

// Clears empty status, helps with bugs
for (const option of statusOptions) {
	if (!option.text.trim().length) {
		option.setAttribute("hidden", true);
	}
}

// Clears empty issue, helps with bugs
for (const option of issueOptions) {
	if (!option.text.trim().length) {
		option.setAttribute("hidden", true);
	}
}

// If a status is changed, send post request to sort and update table, then refresh page
for (const select of statusSelects) {
	select.addEventListener("change", async (e) => {
		const id =
			select.parentElement.parentElement.parentElement.firstElementChild
				.firstElementChild.textContent;
		const selection = e.target.value;
		const phone = document.getElementById("phone").value.replace(/\D/g, "");

		// Post request to update ticket status for updated ticket, and also update/sort table order
		await helper.postReq("/tickets/update-ticket-status", {
			selection,
			id,
			phone,
		});
	});
}

// If an issue is changed, send post request to sort and update table, then refresh page
for (const select of issueSelects) {
	select.addEventListener("change", async (e) => {
		const id =
			select.parentElement.parentElement.firstElementChild
				.firstElementChild.textContent;
		const selection = e.target.value;
		const phone = document.getElementById("phone").value.replace(/\D/g, "");

		// Post request to update ticket issue for updated ticket, and also update/sort table order
		await helper.postReq("/tickets/update-ticket-issue", {
			selection,
			id,
			phone,
		});
		location.reload();
	});
}
