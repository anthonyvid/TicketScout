const card = document.querySelector(".card");
const cardInput = document.querySelector(".card-input");
const cash = document.querySelector(".cash");
const cashInput = document.querySelector(".cash-input");
const paymentBtn = document.getElementById("complete_payment_btn");
const paymentForm = document.getElementById("paymentForm");
const taxSelection = document.getElementById("tax");
const storeTaxRate = document.getElementById("tax_amount").value;

taxSelection.addEventListener("input", () => {
	if (
		Array.from(
			taxSelection.selectedOptions,
			({ textContent }) => textContent
		)[0] === "No"
	) {
		document.getElementById("tax_amount").value = "0%";
	} else {
		document.getElementById("tax_amount").value = storeTaxRate;
	}
});

function getTaxVal() {
	console.log("yaa");

	console.log(taxSelection.value);
	if (taxSelection.value === "False")
		document.getElementById("tax_amount").textContent = "0%";
}

card.addEventListener("click", () => {
	card.classList.add(".selected");
	cardInput.value = "true";
	cash.classList.remove(".selected");
	cashInput.value = "false";

	card.style.backgroundColor = "#9ecaed";
	card.style.border = "none";
	card.style.color = "white";

	cash.style.backgroundColor = "white";
	cash.style.border = "1px solid lightgrey";
	cash.style.color = "black";
});
cash.addEventListener("click", () => {
	cash.classList.add(".selected");
	cashInput.value = "true";
	card.classList.remove(".selected");
	cardInput.value = "false";

	cash.style.backgroundColor = "#9ecaed";
	cash.style.border = "none";
	cash.style.color = "white";

	card.style.backgroundColor = "white";
	card.style.border = "1px solid lightgrey";
	card.style.color = "black";
});

paymentBtn.addEventListener("click", () => {
	if (
		!card.classList.contains(".selected") &&
		!cash.classList.contains(".selected")
	)
		return;

	paymentForm.submit();
});

let paymentAmount = document.getElementById("payment-amount");
let quantity = document.getElementById("quantity");

let calculateTax = function (e) {
	let amountBeforeTax = e.target.value;
	const taxPercentage = document.getElementById("tax_amount").value;

	quantity.addEventListener("input", (e) => {
		quantity.value = e.target.value;
	});

	amountBeforeTax *= quantity.value;
	let taxAmount = amountBeforeTax * (parseFloat(taxPercentage) / 100.0);

	const finalAmount = amountBeforeTax + taxAmount;

	document.getElementById("tax_dollar_amount").value = (
		Math.round(taxAmount * 100) / 100
	).toFixed(2);

	document.getElementById("total").value = (
		Math.round(finalAmount * 100) / 100
	).toFixed(2);
};

paymentAmount.addEventListener("input", calculateTax, false);
