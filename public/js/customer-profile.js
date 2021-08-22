const editCustomerInfo = document.getElementById("edit_customer_info");
const cancelChangeBtn = document.getElementById("cancel_info_change");
const submitChangeBtn = document.getElementById("submit_info_change");
const createNewForm = document.getElementById("create_new_form");
const newTicketBtn = document.querySelector(".new-ticket-btn");
const newPaymentBtn = document.querySelector(".new-payment-btn");
const documentBtn = document.querySelector(".document-btn");

/**
 * Prints a customer label
 * TODO: Not yet setup
 */
function printCustomerLabel() {
	//need to figure out how im gonna make it print labels
	console.log("PRINT LABEL");
}

editCustomerInfo.addEventListener("click", () => {
	editCustomerInfo.classList.add("hidden");
	document.getElementById("name").classList.add("hidden");
	document.getElementById("phone").classList.add("hidden");
	document.getElementById("email").classList.add("hidden");
	document.getElementById("edit_firstname_field").classList.remove("hidden");
	document.getElementById("edit_lastname_field").classList.remove("hidden");
	document.getElementById("edit_phone_field").classList.remove("hidden");
	document.getElementById("edit_email_field").classList.remove("hidden");
	cancelChangeBtn.classList.remove("hidden");
	submitChangeBtn.classList.remove("hidden");
});

cancelChangeBtn.addEventListener("click", () => {
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
});

newTicketBtn.addEventListener("click", () => {
	document.getElementById("customer_data_exists").value = "true";
	createNewForm.action = "/create-new-customer";
	createNewForm.submit();
});

newPaymentBtn.addEventListener("click", () => {
	document.getElementById("customer_data_exists").value = "true";
	createNewForm.action = "/create-new-payment";
	createNewForm.submit();
});

documentBtn.addEventListener("click", () => {
	printCustomerLabel();
});
