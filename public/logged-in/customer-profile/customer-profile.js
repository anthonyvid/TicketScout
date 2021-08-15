const editCustomerInfo = document.getElementById("edit-customer-info");
const cancelChangeBtn = document.getElementById("cancel-info-change");
const submitChangeBtn = document.getElementById("submit-info-change");

editCustomerInfo.addEventListener("click", () => {
	editCustomerInfo.classList.add("hidden");
	document.getElementById("name").classList.add("hidden");
	document.getElementById("phone").classList.add("hidden");
	document.getElementById("email").classList.add("hidden");
	document.getElementById("edit-firstname-field").classList.remove("hidden");
	document.getElementById("edit-lastname-field").classList.remove("hidden");
	document.getElementById("edit-phone-field").classList.remove("hidden");
	document.getElementById("edit-email-field").classList.remove("hidden");
	cancelChangeBtn.classList.remove("hidden");
	submitChangeBtn.classList.remove("hidden");
});

cancelChangeBtn.addEventListener("click", () => {
	editCustomerInfo.classList.remove("hidden");
	document.getElementById("name").classList.remove("hidden");
	document.getElementById("phone").classList.remove("hidden");
	document.getElementById("email").classList.remove("hidden");
	document.getElementById("edit-firstname-field").classList.add("hidden");
	document.getElementById("edit-lastname-field").classList.add("hidden");
	document.getElementById("edit-phone-field").classList.add("hidden");
	document.getElementById("edit-email-field").classList.add("hidden");
	cancelChangeBtn.classList.add("hidden");
	submitChangeBtn.classList.add("hidden");
});

const ticketIDs = document.querySelectorAll(".ticketID");
const ticketSubjects = document.querySelectorAll(".ticket_subject");

for (ticket of ticketIDs) {
	const id = ticket.firstElementChild.textContent.trim();
	ticket.firstElementChild.href += id;
}

for (subject of ticketSubjects) {
	const id =
		subject.previousElementSibling.firstElementChild.textContent.trim();
	subject.firstElementChild.href += id;
}

const createNewForm = document.getElementById("createNewForm");
const newTicketBtn = document.querySelector(".newTicketBtn");

newTicketBtn.addEventListener("click", () => {
	document.getElementById("customerDataExists").value = "true";
	createNewForm.action = "/create-new-customer";
	createNewForm.submit();
});
newTicketBtn.addEventListener("click", () => {
	document.getElementById("customerDataExists").value = "true";
	createNewForm.action = "/create-new-customer";
	createNewForm.submit();
});
const newPaymentBtn = document.querySelector(".newPaymentBtn");

newPaymentBtn.addEventListener("click", () => {
	document.getElementById("customerDataExists").value = "true";
	createNewForm.action = "/create-new-payment";
	createNewForm.submit();
});

const documentBtn = document.querySelector(".documentBtn");

documentBtn.addEventListener("click", () => {
	printCustomerLabel();
});

document.addEventListener("keydown", function (e) {
	let keyCode = e.keyCode;
	if (
		document
			.querySelector(".newActionDropdown")
			.classList.contains("show-create-new-dd")
	) {
		if (keyCode === 27) {
			document
				.querySelector(".newActionDropdown")
				.classList.toggle("show-create-new-dd");
		}
	}
	if (
		document
			.querySelector(".documentDropdown")
			.classList.contains("show-create-new-dd")
	) {
		if (keyCode === 27) {
			document
				.querySelector(".documentDropdown")
				.classList.toggle("show-create-new-dd");
		}
	}
});

function printCustomerLabel() {
	//need to figure out how im gonna make it print labels
	console.log("PRINT LABEL");
}
