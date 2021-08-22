"use strict";

const documentBtn = document.querySelector(".document-btn");

documentBtn.addEventListener(
	"click",
	() => {
		printCustomerLabel();
	},
	{ passive: true }
);
function printCustomerLabel() {
	//need to figure out how im gonna make it print labels
	console.log("PRINT LABEL");
}
