const paymentNumbers = document.querySelectorAll(".paymentNumber");

for (const number of paymentNumbers) {
	number.href += number.textContent.trim();
}
const phones = document.querySelectorAll(".phone");

for (const phone of phones) {
	phone.href += phone.textContent.trim().replace(/\D/g, "");
}

const tableRows = document.querySelectorAll("#table-row");

const paymentNumberSearchBox = document.getElementById("search-payment-number");

function searchForPaymentNumber() {
	for (const row of tableRows) {
		const number = row.firstElementChild.firstElementChild.text;
		if (number.indexOf(paymentNumberSearchBox.value) > -1) {
			row.style.display = "flex";
		} else {
			row.style.display = "none";
		}
	}
}

const customerPhoneSearchBox = document.getElementById("search-customer");

function searchForCustomer() {
	for (const row of tableRows) {
		const number =
			row.firstElementChild.nextElementSibling.firstElementChild.textContent
				.trim()
				.replace(/\D/g, "");
		if (
			number.indexOf(
				customerPhoneSearchBox.value.trim().replace(/\D/g, "")
			) > -1
		) {
			row.style.display = "flex";
		} else {
			row.style.display = "none";
		}
	}
}

const amountSearchBox = document.getElementById("search-amount");

function searchForAmount() {
	for (const row of tableRows) {
		const amount =
			row.firstElementChild.nextElementSibling.nextElementSibling
				.textContent;
		if (amount.indexOf(amountSearchBox.value) > -1) {
			row.style.display = "flex";
		} else {
			row.style.display = "none";
		}
	}
}

const dateSearchBox = document.getElementById("search-date");

function searchForDate() {
	for (const row of tableRows) {
		const date =
			row.firstElementChild.nextElementSibling.nextElementSibling
				.nextElementSibling.nextElementSibling.textContent;
		console.log(date);

		if (
			date.toUpperCase().indexOf(dateSearchBox.value.toUpperCase()) > -1
		) {
			row.style.display = "flex";
		} else {
			row.style.display = "none";
		}
	}
}

const paymentNumberHeader = document.getElementById("paymentNumberHeader");

paymentNumberHeader.firstElementChild.addEventListener("click", () => {
	let tbody = $("table tbody");
	tbody.html($("tr", tbody).get().reverse());
});

