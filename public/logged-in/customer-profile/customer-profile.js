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
