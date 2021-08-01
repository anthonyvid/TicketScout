const ticketIDs = document.querySelectorAll(".ticket_link");
const customers = document.querySelectorAll(".customer_link");

ticketIDs.forEach(function (id, index) {
	id.href += id.textContent;
});

customers.forEach(function (customer, index) {
	customer.href += customer.textContent;
});
//TODO: THIS WONT WORK FOR CUSTOMERS,
// I NEED TO GET THEIR PHONE NUMBER INSTEAD SOMEHOw
// SAME THINGS FOR TICKET SUBJECT, I NEED THE TICKET ID
