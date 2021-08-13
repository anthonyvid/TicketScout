const card = document.querySelector(".card");
const cardInput = document.querySelector(".card-input");
const cash = document.querySelector(".cash");
const cashInput = document.querySelector(".cash-input");
const paymentBtn = document.getElementById("complete-payment-btn");
const paymentForm = document.getElementById("paymentForm");
const cardOptions = document.querySelectorAll(".type");
let cardChoice = "";

let orderItems = [];

cardOptions.forEach((cardType) =>
	cardType.addEventListener("click", () => {
		for (const card of cardOptions) {
			if (card.classList.contains(".selected")) {
				card.classList.remove(".selected");
				card.value = "false";
				card.firstElementChild.value = "false";
				card.style.backgroundColor = "white";
				card.style.border = "1px solid lightgrey";
				card.style.color = "black";
			}
		}

		cardType.classList.add(".selected");
		cardType.firstElementChild.value = "true";
		cardType.style.backgroundColor = "#9ecaed";
		cardType.style.border = "none";
		cardType.style.color = "white";
		cardChoice = cardType.textContent.trim();
	})
);

function btnTransition() {
	document.getElementById("complete-payment-btn").style.width = "50%";
	setTimeout(() => {
		document.querySelector(".card-options").style.display = "flex";
	}, 200);
}

card.addEventListener("click", () => {
	btnTransition();
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

	document.getElementById("complete-payment-btn").style.width = "100%";
	document.querySelector(".card-options").style.display = "none";
});

paymentBtn.addEventListener("click", () => {
	if (orderItems.length === 0) {
		document.getElementById("tr").style.backgroundColor = "#FFCCCC";
		setTimeout(() => {
			document.getElementById("tr").style.backgroundColor = "#f7f7f7";
		}, 500);
		console.log("no items in order");
		return;
	}

	if (
		!card.classList.contains(".selected") &&
		!cash.classList.contains(".selected")
	) {
		console.log("no payment method selected");
		return;
	}
	if (card.classList.contains(".selected")) {
		let x = 0;
		for (const card of cardOptions) {
			if (card.classList.contains(".selected")) {
				x = 1;
			}
		}
		if (x === 0) {
			console.log("no card option chosen");
			return;
		}
	}

	let paymentType;

	if (card.classList.contains(".selected")) {
		paymentType = cardChoice;
	} else {
		paymentType = "cash";
	}

	console.log(paymentType);
	console.log("maaede it through");

	const form = document.createElement("form");
	form.method = "POST";
	form.action = "/create-new-payment";

	const customer = {
		firstname: document.getElementById("firstname").value,
		lastname: document.getElementById("lastname").value,
		phone: document.getElementById("phone").value,
		email: document.getElementById("email").value,
	};

	const customerField = document.createElement("input");
	customerField.type = "input";
	customerField.name = "customer";
	customerField.value = JSON.stringify(customer);
	const orderItemsField = document.createElement("input");
	orderItemsField.type = "input";
	orderItemsField.name = "order";
	orderItemsField.value = JSON.stringify(orderItems);
	const paymentMethod = document.createElement("input");
	paymentMethod.type = "input";
	paymentMethod.name = "payment";
	paymentMethod.value = paymentType;

	form.appendChild(customerField);
	form.appendChild(orderItemsField);
	form.appendChild(paymentMethod);
	document.body.appendChild(form);
	form.submit();
});

//payment options
let amount = document.getElementById("payment-amount");
let taxOption = document.getElementById("tax");
let taxPercent = document.getElementById("tax-percent");
const initialStoreTaxRate = document.getElementById("tax-percent").value;
let taxDollar = document.getElementById("tax_dollar_amount");
let quantity = document.getElementById("quantity");
let itemTotalAfterTax = document.getElementById("total-after-tax");
const table = document.getElementById("order-table");

taxOption.addEventListener("input", () => {
	if (
		Array.from(
			taxOption.selectedOptions,
			({ textContent }) => textContent
		)[0].trim() === "No"
	) {
		taxPercent.value = "0%";
		calculateItemAmount();
	} else {
		taxPercent.value = initialStoreTaxRate;
	}
});

function calculateItemAmount() {
	let amountBeforeTax = amount.value * quantity.value;
	let taxDollarAmount =
		amountBeforeTax * (parseFloat(taxPercent.value) / 100.0);

	let totalAfterTax = amountBeforeTax + taxDollarAmount;

	taxDollar.value = (Math.round(taxDollarAmount * 100) / 100).toFixed(2);

	itemTotalAfterTax.value = (Math.round(totalAfterTax * 100) / 100).toFixed(
		2
	);
}

amount.addEventListener("input", calculateItemAmount, false);
quantity.addEventListener("input", calculateItemAmount, false);

const addToOrderBtn = document.getElementById("add-to-order");
let itemSlot = 0;
let paymentOverviewItemsInOrder = 0;
let paymentOverviewTotalBeforeTax = 0;
let paymentOverviewTaxAmount = 0;
let paymentOverviewTotalAfterTax = 0;
const trashIcon = '<i class="fa fa-trash-o" aria-hidden="true"></i>';
const newIcon = document.createElement("i").classList.add("fa", "fa-trash-o");

addToOrderBtn.addEventListener("click", () => {
	if (document.getElementById("description").value == "") {
		document.getElementById("description").style.backgroundColor =
			"#FFCCCC";
		setTimeout(() => {
			document.getElementById("description").style.backgroundColor =
				"#f7f7f7";
		}, 500);
		console.log("no description added");
		return;
	} else if (amount.value == "") {
		amount.style.backgroundColor = "#FFCCCC";
		setTimeout(() => {
			amount.style.backgroundColor = "#f7f7f7";
		}, 500);
		console.log("no amount added");
		return;
	}
	const qty = Number(quantity.value);
	const amountBeforeTax = Number(amount.value) * qty;
	const taxPercentage = taxPercent.value;
	const taxDollarValue = Number(taxDollar.value);
	const totalAfterTax = Number(itemTotalAfterTax.value);

	let categoryText = Array.from(
		categorySelect.selectedOptions,
		({ textContent }) => textContent
	)[0];

	if (categoryText === "Choose Category") {
		categoryText = "No Category";
	}

	const item = {
		category: categoryText,
		description: document.getElementById("description").value,
		amount: amountBeforeTax,
		taxPercent: taxPercentage,
		taxDollar: taxDollarValue,
		quantity: qty,
		total: totalAfterTax,
	};

	console.log("TOTAL:" + totalAfterTax);

	orderItems.push(item);

	let row = table.insertRow();
	row.insertCell(0).innerHTML = orderItems[itemSlot].category;
	row.insertCell(1).innerHTML = orderItems[itemSlot].description;
	row.insertCell(2).innerHTML =
		"$" + parseFloat(orderItems[itemSlot].amount).toFixed(2);
	row.insertCell(3).innerHTML = orderItems[itemSlot].taxPercent;
	row.insertCell(4).innerHTML =
		"$" + parseFloat(orderItems[itemSlot].taxDollar).toFixed(2);
	row.insertCell(5).innerHTML = orderItems[itemSlot].quantity;
	row.insertCell(6).innerHTML =
		"$" +
		parseFloat(orderItems[itemSlot].total).toFixed(2) +
		'<i class="fa fa-trash-o" aria-hidden="true" onclick="deleterow(this)"></i>';

	itemSlot++;

	if (
		table.firstElementChild.nextElementSibling.firstElementChild.firstElementChild.textContent.trim() ==
		"No Items in Order"
	) {
		table.firstElementChild.nextElementSibling.firstElementChild.remove();
	}

	paymentOverviewItemsInOrder += qty;
	paymentOverviewTotalBeforeTax += amountBeforeTax;
	paymentOverviewTaxAmount += taxDollarValue;
	paymentOverviewTotalAfterTax += totalAfterTax;

	document.getElementById("po-items-in-order").textContent =
		paymentOverviewItemsInOrder;
	document.getElementById("po-total-before-tax").textContent =
		"$" +
		(Math.round(paymentOverviewTotalBeforeTax * 100) / 100).toFixed(2);
	document.getElementById("po-tax-amount").textContent =
		"$" + (Math.round(paymentOverviewTaxAmount * 100) / 100).toFixed(2);
	document.getElementById("po-total-after-tax").textContent =
		"$" + (Math.round(paymentOverviewTotalAfterTax * 100) / 100).toFixed(2);

	amount.value = 0;
	quantity.value = 1;
	itemTotalAfterTax.value = 0;
	taxDollar.value = 0;
	document.getElementById("description").value = "";
	amount.value = "";
	document.getElementById("total-after-tax").value = "";
});

function deleterow(el) {
	// paymentOverviewItemsInOrder -= parseFloat(
	// 	el.parentElement.previousElementSibling.textContent
	// );

	// // paymentOverviewTotalBeforeTax -= parseFloat(
	// // 	el.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent.replaceAll(
	// // 		"[^0-9]",
	// // 		""
	// // 	)
	// // );
	// // paymentOverviewTaxAmount -= parseFloat(
	// // 	el.parentElement.previousElementSibling.previousElementSibling.textContent.replaceAll(
	// // 		"[^0-9]",
	// // 		""
	// // 	)
	// // ); 
	// // paymentOverviewTotalAfterTax -= parseFloat(el.parentElement.text)

	// document.getElementById("po-items-in-order").textContent =
	// 	paymentOverviewItemsInOrder;
	// document.getElementById("po-total-before-tax").textContent =
	// 	"$" +
	// 	(Math.round(paymentOverviewTotalBeforeTax * 100) / 100).toFixed(2);
	// document.getElementById("po-tax-amount").textContent =
	// 	"$" + (Math.round(paymentOverviewTaxAmount * 100) / 100).toFixed(2);
	// document.getElementById("po-total-after-tax").textContent =
	// 	"$" + (Math.round(paymentOverviewTotalAfterTax * 100) / 100).toFixed(2);

	// $(el).closest("tr").remove();
}
