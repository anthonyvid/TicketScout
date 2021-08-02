const ticketIDs = document.querySelectorAll(".ticket_link");
const customers = document.querySelectorAll(".customer_link");
const subjects = document.querySelectorAll(".subject_link");

for (const ID of ticketIDs) {
	ID.href += ID.textContent;
}

// for (const subject of subjects) {
// 	console.log(subject);
// 	const ticket = subject.closest("td.ticket-id").find(".ticket_link");
// 	console.log(ticket);
// 	subject.href += ticket.textContent;
// }

// for (const customer of customers) {
// 	customer.addEventListener("click", () => {
// 		console.log(customer.closest(".ticket_link").textContent);
// 	});
// }

const statusSelects = document.querySelectorAll(".status-selects");

for (const select of statusSelects) {
	const selectedOption = select.selectedOptions[0].text;
	console.log(selectedOption);
}

//TODO: I NEED TO MAKE THE CLOSEST WORK
//TODO: I NEED TO GET CURRENT OPTION CHOSEN FOR ANY SELECT
// SEND TO BACKEND AND UPDATE STATUS FOR THAT TICKET
