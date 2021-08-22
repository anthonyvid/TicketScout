const paymentNumbers = document.querySelectorAll(".paymentNumber");
const phones = document.querySelectorAll(".phone");
const tableRows = document.querySelectorAll("#table_row");
const paymentNumberSearchBox = document.getElementById("search_payment_number");
const customerPhoneSearchBox = document.getElementById("search_customer");
const amountSearchBox = document.getElementById("search_amount");
const dateSearchBox = document.getElementById("search_date");
const paymentNumberHeader = document.getElementById("payment_number_header");

/**
 * Filters payment number based on search
 */
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

/**
 * Filters customer phone number based on search
 */
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

/**
 * Filters payment amount based on search
 */
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

/**
 * Filters payment date based on search
 */
function searchForDate() {
	for (const row of tableRows) {
		const date =
			row.firstElementChild.nextElementSibling.nextElementSibling
				.nextElementSibling.nextElementSibling.textContent;

		if (
			date.toUpperCase().indexOf(dateSearchBox.value.toUpperCase()) > -1
		) {
			row.style.display = "flex";
		} else {
			row.style.display = "none";
		}
	}
}

paymentNumberSearchBox.addEventListener("input", searchForPaymentNumber, {
	passive: true,
});
customerPhoneSearchBox.addEventListener("input", searchForCustomer, {
	passive: true,
});
amountSearchBox.addEventListener("input", searchForAmount, {
	passive: true,
});
dateSearchBox.addEventListener("input", searchForDate, {
	passive: true,
});

// Reverses order of table based on payment number
paymentNumberHeader.firstElementChild.addEventListener(
	"click",
	() => {
		let tbody = $("table tbody");
		tbody.html($("tr", tbody).get().reverse());
	},
	{
		passive: true,
	}
);
