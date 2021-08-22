import * as helper from "./helper/helper.js";

const cardOptions = document.querySelectorAll(".type");
const card = document.querySelector(".card");
const cardInput = document.querySelector(".card-input");
const cash = document.querySelector(".cash");
const cashInput = document.querySelector(".cash-input");
const completePaymentBtn = document.getElementById("complete_payment_btn");
const table = document.getElementById("order_table");
const itemsInOrder = document.getElementById("items_in_order");
const orderTotalBeforeTax = document.getElementById("total_before_tax");
const orderTaxAmount = document.getElementById("tax_amount");
const orderTotalAfterTax = document.getElementById("total_after_tax");
const addToOrderBtn = document.getElementById("add_to_order");
const itemDescription = document.getElementById("description");
let amount = document.getElementById("payment_amount");
let taxOption = document.getElementById("tax");
let taxPercent = document.getElementById("tax_percent");
let taxDollar = document.getElementById("tax_dollar_amount");
let quantity = document.getElementById("quantity");
let itemTotalAfterTax = document.getElementById("item_total_after_tax");

let orderItems = [];
let cardChoice = "";
const initialStoreTaxRate = taxPercent.value;

/**
 * Create a form element and assigns given method and action
 * @param {string} method method type for form
 * @param {string} action url to submit form to
 * @returns a form element
 */
const createForm = (method, action) => {
	const form = document.createElement("form");
	form.method = method;
	form.action = action;
	return form;
};

/**
 * Creates input element and appends it to given form
 * @param {element} form the form to add the input to
 * @param {string} type type of input
 * @param {string} name name of input
 * @param {string} value value of input
 */
const createInputForForm = (form, type, name, value) => {
	const input = document.createElement("input");
	input.type = type;
	input.name = name;
	input.value = value;
	form.appendChild(input);
};

/**
 * Transition for complete payment button
 */
const paymentBtnTransition = () => {
	completePaymentBtn.style.width = "50%";
	setTimeout(() => {
		document.querySelector(".card-options").style.display = "flex";
	}, 200);
};

/**
 * Given a select element, find the current value
 * @param {element} element to get value from
 * @returns currently selected value
 */
const getSelectTagCurrentValue = (element) => {
	return Array.from(
		element.selectedOptions,
		({ textContent }) => textContent
	)[0].trim();
};

/**
 * Validates a single order item
 * @returns true if valid, false if not
 */
const isValidOrderItem = () => {
	if (!itemDescription.value) {
		helper.showInvalidColour(itemDescription);
		return false;
	} else if (!amount.value) {
		helper.showInvalidColour(amount);
		return false;
	}
	return true;
};

/**
 * Checks if a payment method has been selected
 * @returns true if selected, false if not
 */
const isPaymentMethodSelected = () => {
	if (!orderItems.length) {
		helper.showInvalidColour(document.getElementById("tr"));
		return false;
	}
	if (
		!card.classList.contains(".selected") &&
		!cash.classList.contains(".selected")
	) {
		helper.showInvalidColour(card);
		helper.showInvalidColour(cash);
		return false;
	}
	if (card.classList.contains(".selected")) {
		let chosen = false;
		for (const card of cardOptions) {
			if (card.classList.contains(".selected")) {
				chosen = true;
			}
		}
		if (!chosen) {
			cardOptions.forEach((card) => helper.showInvalidColour(card));
			return false;
		}
	}
	return true;
};

/**
 * Adds a row to items in order table with given data
 * @param {Object} item row data
 */
const addLineitem = (item) => {
	let row = table.insertRow();
	helper.addCellToRow(row, item.category);
	helper.addCellToRow(row, item.description);
	helper.addCellToRow(row, `$ ${parseFloat(item.amount).toFixed(2)}`);
	helper.addCellToRow(row, item.taxPercent);
	helper.addCellToRow(row, `$ ${parseFloat(item.taxDollar).toFixed(2)}`);
	helper.addCellToRow(row, item.quantity);
	helper.addCellToRow(row, `$ ${parseFloat(item.total).toFixed(2)}`);
};

/**
 * Calculates a single items amount
 */
const calculateItemAmount = () => {
	let amountBeforeTax = amount.value * quantity.value;
	let taxDollarAmount =
		amountBeforeTax * (parseFloat(taxPercent.value) / 100.0);

	let totalAfterTax = amountBeforeTax + taxDollarAmount;

	taxDollar.value = (Math.round(taxDollarAmount * 100) / 100).toFixed(2);

	itemTotalAfterTax.value = (Math.round(totalAfterTax * 100) / 100).toFixed(
		2
	);
};

/**
 * Resets item payment option values
 */
const resetItemPaymentOptions = () => {
	amount.value = 0;
	quantity.value = 1;
	itemTotalAfterTax.value = 0;
	taxDollar.value = 0;
	document.getElementById("description").value = "";
	amount.value = "";
	document.getElementById("total_after_tax").value = "";
};

cardOptions.forEach((cardType) =>
	cardType.addEventListener("click", () => {
		for (const card of cardOptions) {
			// If there was a previously selected payment method, remove color and class
			if (card.classList.contains(".selected")) {
				card.classList.remove(".selected");
				card.value = "false";
				card.firstElementChild.value = "false";
				card.style.backgroundColor = "white";
				card.style.border = "1px solid lightgrey";
				card.style.color = "black";
			}
		}

		// Add selected class and colours to the new selected payment method
		cardType.classList.add(".selected");
		cardType.firstElementChild.value = "true";
		cardType.style.backgroundColor = "#9ecaed";
		cardType.style.border = "none";
		cardType.style.color = "white";
		cardChoice = cardType.textContent.trim();
	})
);

card.addEventListener("click", () => {
	paymentBtnTransition(); // Show payment methods
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

	completePaymentBtn.style.width = "100%";
	document.querySelector(".card-options").style.display = "none";
});

completePaymentBtn.addEventListener("click", () => {
	let paymentType = null;

	if (!isPaymentMethodSelected()) return;

	if (card.classList.contains(".selected")) {
		paymentType = cardChoice;
	} else {
		paymentType = "cash";
	}

	const customer = {
		firstname: document.getElementById("firstname").value,
		lastname: document.getElementById("lastname").value,
		phone: document.getElementById("phone").value,
		email: document.getElementById("email").value,
	};

	const form = createForm("POST", "/create-new-payment");
	createInputForForm(form, "input", "customer", JSON.stringify(customer));
	createInputForForm(form, "input", "order", JSON.stringify(orderItems));
	createInputForForm(form, "input", "payment", paymentType);
	createInputForForm(
		form,
		"input",
		"orderTotal",
		orderTotalAfterTax.textContent.replace("$", "")
	);
	createInputForForm(
		form,
		"input",
		"linkedTicket",
		document.getElementById("linked_ticket").value
	);

	document.body.appendChild(form);
	form.submit();
});

taxOption.addEventListener("input", () => {
	if (getSelectTagCurrentValue(taxOption) === "No") {
		taxPercent.value = "0%";
		calculateItemAmount();
	} else {
		taxPercent.value = initialStoreTaxRate;
	}
});

amount.addEventListener("input", calculateItemAmount, false);
quantity.addEventListener("input", calculateItemAmount, false);

let paymentOverviewItemsInOrder = 0;
let paymentOverviewTotalBeforeTax = 0;
let paymentOverviewTaxAmount = 0;
let paymentOverviewTotalAfterTax = 0;

addToOrderBtn.addEventListener("click", () => {
	if (!isValidOrderItem()) return;

	const qty = Number(quantity.value);
	const amountBeforeTax = Number(amount.value) * qty;
	const taxPercentage = taxPercent.value;
	const taxDollarValue = Number(taxDollar.value);
	const totalAfterTax = Number(itemTotalAfterTax.value);

	let categoryText = getSelectTagCurrentValue(categorySelect);

	if (categoryText === "Choose Category") {
		categoryText = "No Category";
	}

	// Order item being added
	const item = {
		category: categoryText.trim(),
		description: itemDescription.value,
		amount: amountBeforeTax,
		taxPercent: taxPercentage,
		taxDollar: taxDollarValue,
		quantity: qty,
		total: totalAfterTax,
	};

	orderItems.push(item);
	addLineitem(item);

	// Remove default table row
	table.firstElementChild.nextElementSibling.firstElementChild.remove();

	paymentOverviewItemsInOrder += qty;
	paymentOverviewTotalBeforeTax += amountBeforeTax;
	paymentOverviewTaxAmount += taxDollarValue;
	paymentOverviewTotalAfterTax += totalAfterTax;

	itemsInOrder.textContent = paymentOverviewItemsInOrder;
	orderTotalBeforeTax.textContent =
		"$" +
		(Math.round(paymentOverviewTotalBeforeTax * 100) / 100).toFixed(2);
	orderTaxAmount.textContent =
		"$" + (Math.round(paymentOverviewTaxAmount * 100) / 100).toFixed(2);
	orderTotalAfterTax.textContent =
		"$" + (Math.round(paymentOverviewTotalAfterTax * 100) / 100).toFixed(2);

	resetItemPaymentOptions();
});
