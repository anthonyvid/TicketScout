const ticketIDs = document.querySelectorAll(".ticket_link");
const customers = document.querySelectorAll(".customer_link");
const subjects = document.querySelectorAll(".subject_link");

for (const ID of ticketIDs) {
	ID.href += ID.textContent;
}

for (const subject of subjects) {
	const id =
		subject.parentElement.parentElement.firstElementChild.firstElementChild
			.text;
	subject.href += id;
}

for (const customer of customers) {
	const id =
		customer.parentElement.parentElement.firstElementChild.firstElementChild
			.text;
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

const statusSelects = document.querySelectorAll(".status-selects");

for (const select of statusSelects) {
	select.addEventListener("change", (e) => {
		const id =
			select.parentElement.parentElement.firstElementChild
				.firstElementChild.text;
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
				.firstElementChild.text;
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
				location.reload();
			} catch (error) {
				console.log(error);
			}
		})();
	});
}
