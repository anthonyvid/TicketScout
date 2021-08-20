const ticketIDs = document.querySelectorAll(".ticket_link");
const customers = document.querySelectorAll(".customer_link");
const subjects = document.querySelectorAll(".subject_link");
const lastUpdated = document.querySelectorAll(".last-update-text");
const idSearchBox = document.getElementById("search-ID");
const customerSearchBox = document.getElementById("search-customer");
const subjectSearchBox = document.getElementById("search-subject");
const statusSearchBox = document.getElementById("search-status");
const tableRows = document.querySelectorAll("#table-row");
const lastUpdatedHeader = document.getElementById("lastUpdatedHeader");

lastUpdatedHeader.firstElementChild.addEventListener("click", () => {
	let tbody = $("table tbody");
	tbody.html($("tr", tbody).get().reverse());
});

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

const hideResolvedTickets = document.getElementById("hide-resolved-tickets");
clearResolvedTickets();
hideResolvedTickets.addEventListener("click", () => {
	if (hideResolvedTickets.checked) {
		clearResolvedTickets();
	} else {
		showResolvedTickets();
	}
});

function searchForID() {
	for (const row of tableRows) {
		const id = row.firstElementChild.firstElementChild.text;
		if (id.indexOf(idSearchBox.value) > -1) {
			row.style.display = "flex";
			clearResolvedTickets();
		} else {
			row.style.display = "none";
		}
	}
}

function searchForCustomer() {
	for (const row of tableRows) {
		const name =
			row.firstElementChild.nextElementSibling.firstElementChild.text;
		if (
			name.toUpperCase().indexOf(customerSearchBox.value.toUpperCase()) >
			-1
		) {
			row.style.display = "flex";
			clearResolvedTickets();
		} else {
			row.style.display = "none";
		}
	}
}

function searchForSubject() {
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
}

function searchForStatus() {
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
}

for (const ID of ticketIDs) {
	ID.href += ID.textContent;
}

for (const subject of subjects) {
	const id =
		subject.parentElement.parentElement.firstElementChild.firstElementChild
			.textContent;

	subject.href += id;
}

for (const customer of customers) {
	const id =
		customer.parentElement.parentElement.firstElementChild.firstElementChild
			.textContent;
	(async () => {
		const response = await fetch("/get-phone", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id }),
		});
		const data = await response.json();
		customer.href += data.phone;
	})();
}

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

const statusOptions = document.querySelectorAll(".status-options");
const issueOptions = document.querySelectorAll(".issue-options");
const statusSelects = document.querySelectorAll(".status-selects");

(async () => {
	try {
		const response = await fetch("/get-store");
		const data = await response.json();
		const statusArray = data.store.storeSettings.tickets.status;
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
})();

for (const option of statusOptions) {
	if (option.text.trim().length == 0) {
		option.setAttribute("hidden", true);
	}
}
for (const option of issueOptions) {
	if (option.text.trim().length == 0) {
		option.setAttribute("hidden", true);
	}
}

for (const select of statusSelects) {
	select.addEventListener("change", (e) => {
		const id =
			select.parentElement.parentElement.parentElement.firstElementChild
				.firstElementChild.textContent;
		const selection = e.target.value;
		const phone = document.getElementById("phone").value.replace(/\D/g, "");
		console.log(phone);
		(async () => {
			try {
				const response = await fetch("/update-ticket-status", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ selection, id, phone }),
				});
				const data = await response.json();
				location.reload();
			} catch (error) {
				console.log(error);
			}
		})();
	});
}

const issueSelects = document.querySelectorAll(".issue-selects");

for (const select of issueSelects) {
	select.addEventListener("change", (e) => {
		const id =
			select.parentElement.parentElement.firstElementChild
				.firstElementChild.textContent;
		const selection = e.target.value;
		const phone = document.getElementById("phone").value.replace(/\D/g, "");
		(async () => {
			try {
				const response = await fetch("/update-ticket-issue", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ selection, id, phone }),
				});
				const data = await response.json();
				location.reload();
			} catch (error) {
				console.log(error);
			}
		})();
	});
}
