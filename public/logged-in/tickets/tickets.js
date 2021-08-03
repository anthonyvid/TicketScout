const ticketIDs = document.querySelectorAll(".ticket_link");
const customers = document.querySelectorAll(".customer_link");
const subjects = document.querySelectorAll(".subject_link");
const lastUpdated = document.querySelectorAll(".last-update-text");

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

const statusOptions = document.querySelectorAll(".status-options");
const issueOptions = document.querySelectorAll(".issue-options");

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

const statusSelects = document.querySelectorAll(".status-selects");

for (const select of statusSelects) {
	select.addEventListener("change", (e) => {
		const id =
			select.parentElement.parentElement.firstElementChild
				.firstElementChild.textContent;
		const selection = e.target.value;
		(async () => {
			try {
				const response = await fetch("/update-ticket-status", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ selection, id }),
				});
				const data = await response.json();
				// showUpdatedTickets(data.tickets);
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
		(async () => {
			try {
				const response = await fetch("/update-ticket-issue", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ selection, id }),
				});
				const data = await response.json();
				// showUpdatedTickets(data.tickets);
				location.reload();
			} catch (error) {
				console.log(error);
			}
		})();
	});
}

// const showUpdatedTickets = function (tickets) {
// 	for (let i = 0; i < tickets.length; i++) {
// 		ticketIDs.item(i).textContent = tickets[i][0];
// 		customers.item(i).textContent =
// 			tickets[i][1].customer.firstname.charAt(0).toUpperCase() +
// 			tickets[i][1].customer.firstname.slice(1) +
// 			" " +
// 			tickets[i][1].customer.lastname.charAt(0).toUpperCase() +
// 			tickets[i][1].customer.lastname.slice(1);
// 		subjects.item(i).textContent = tickets[i][1].subject;
// 		lastUpdated.item(i).textContent = tickets[i][1].lastUpdated;
// 		document.querySelectorAll(".selected_status").item(i).textContent =
// 			tickets[i][1].status;
// 		document.querySelectorAll(".selected_issue").item(i).textContent =
// 			tickets[i][1].issue;
// 	}
// };
