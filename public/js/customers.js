"use strict";

const tableRows = document.querySelectorAll("#table_row");
const nameSearchBox = document.getElementById("search_name");
const phoneSearchBox = document.getElementById("search_phone");

/**
 * Filters out customer name based on search
 */
function searchForName() {
	for (const row of tableRows) {
		const name = row.firstElementChild.firstElementChild.text;
		if (
			name.toUpperCase().indexOf(nameSearchBox.value.toUpperCase()) > -1
		) {
			row.style.display = "flex";
		} else {
			row.style.display = "none";
		}
	}
}

/**
 * Filters out customers phone based on search
 */
function searchForPhone() {
	for (const row of tableRows) {
		const phone =
			row.firstElementChild.nextElementSibling.firstElementChild
				.textContent;

		if (
			phone.trim().replace(/\D/g, "").indexOf(phoneSearchBox.value) > -1
		) {
			row.style.display = "flex";
		} else {
			row.style.display = "none";
		}
	}
}

nameSearchBox.addEventListener("input", searchForName);
phoneSearchBox.addEventListener("input", searchForPhone);
