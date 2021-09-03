"use strict";

import * as helper from "../js/helper/helper.js";

const plusBoxIcon = document.querySelector(".create-new");
const timeClock = document.getElementById("time_clock");
const clockBtns = document.querySelectorAll(".clock-btn");
const resultDropdown = document.querySelector(".search-results-dropdown");
const createNewDropdown = document.querySelector(".create-new-dropdown");
const accountSettingsDropdown = document.querySelector(".dropdown");
const arrowIcon = document.getElementById("arrow");
const newBtns = document.querySelectorAll(".new-btn");
const searchInput = document.getElementById("search_for_anything");
let menuLinks = document.querySelectorAll(".menu-link");
let date = new Date();
let month = date.getMonth();
let day = date.getDate();

let monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const today = monthNames[month] + " " + day;
document.getElementById("current_date").insertAdjacentHTML("afterbegin", today);

/**
 * Adds the 'active' class to the active sidebar item.
 * @param: None
 * @returns: None
 */
(() => {
	var currentUrl = document.URL;
	var currentUrlEnd = currentUrl.split("/").filter(Boolean).pop();
	$("#nav_list li a").each(function () {
		var thisUrl = $(this).attr("href");
		var thisUrlEnd = thisUrl.split("/").filter(Boolean).pop();

		if (thisUrlEnd == currentUrlEnd) {
			$(this).closest("li a").addClass("active");
		}
	});
})();

/**
 * Displays a result is the search is found/valid
 * @param {Object} results Object containing 3 possible arrays of data
 * @returns none
 */
const showSearchResults = (results) => {
	const { tickets, customers, payments } = results;

	if (!tickets && !customers && !payments) return;

	resultDropdown.style.display = "flex"; // Show dropdown

	for (let i = 0; i < tickets.length; i++) {
		let resultBox = document.createElement("a");
		resultBox.classList.add("result");
		resultBox.href = "/tickets/" + tickets[i];
		let text = document.createTextNode(`Ticket: ${tickets[i]}`);
		resultBox.appendChild(text);
		resultDropdown.appendChild(resultBox);
	}
	for (let i = 0; i < customers.length; i++) {
		let resultBox = document.createElement("a");
		resultBox.classList.add("result");
		resultBox.href = "/customers/" + customers[i];
		let text = document.createTextNode(`Customer: ${customers[i]}`);
		resultBox.appendChild(text);
		resultDropdown.appendChild(resultBox);
	}
	for (let i = 0; i < payments.length; i++) {
		let resultBox = document.createElement("a");
		resultBox.classList.add("result");
		resultBox.href = "/payments/" + payments[i];
		let text = document.createTextNode(`Payment: ${payments[i]}`);
		resultBox.appendChild(text);
		resultDropdown.appendChild(resultBox);
	}

	window.addEventListener("mouseup", (e) => {
		var container = $(resultDropdown);

		if (!container.is(e.target) && container.has(e.target).length === 0) {
			resultDropdown.style.display = "none";
		}
	});
};

/**
 * Displays search results if any are found
 * @param {EventListenerObject}
 * @returns none
 */
const liveSearch = async (e) => {
	if (e.target.value.length < 2) {
		resultDropdown.style.display = "none";
		return;
	}
	const data = await helper.postReq("/live-search-results", {
		search: e.target.value,
	});
	while (resultDropdown.firstChild) {
		resultDropdown.removeChild(resultDropdown.lastChild);
	}
	showSearchResults(data.results);
};

searchInput.addEventListener("input", liveSearch, { passive: true });

// Icon that opens and closes account settings dropdown
document.querySelector(".icon-wrap").addEventListener(
	"click",
	() => {
		arrowIcon.classList.toggle("rotate");
		accountSettingsDropdown.classList.toggle("show-dd");

		window.addEventListener("mouseup", (e) => {
			var container = $(arrowIcon);

			if (
				!container.is(e.target) &&
				container.has(e.target).length === 0
			) {
				arrowIcon.classList.remove("rotate");
				accountSettingsDropdown.classList.remove("show-dd");
			}
		});
	},
	{ passive: true }
);

document.addEventListener(
	"keydown",
	(e) => {
		let keyCode = e.keyCode;

		// if 'ESC' pressed, close account settings dropdown
		if (accountSettingsDropdown.classList.contains("show-dd")) {
			if (keyCode === 27) {
				accountSettingsDropdown.classList.toggle("show-dd");
				arrowIcon.classList.toggle("rotate");
			}
		}
		// if 'ESC' pressed, close create new dropdown
		if (createNewDropdown.classList.contains("show-create-new-dd")) {
			if (keyCode === 27) {
				createNewDropdown.classList.toggle("show-create-new-dd");
				plusBoxIcon.style.color = "#b1aec2";
			}
		}
	},
	{ passive: true }
);

plusBoxIcon.addEventListener(
	"click",
	() => {
		createNewDropdown.classList.toggle("show-create-new-dd");
		if (plusBoxIcon.style.color != "black") {
			plusBoxIcon.style.color = "black";
		} else {
			plusBoxIcon.style.color = "#b1aec2";
		}

		window.addEventListener("mouseup", (e) => {
			var container = $(createNewDropdown);

			if (
				!container.is(e.target) &&
				container.has(e.target).length === 0
			) {
				plusBoxIcon.style.color = "#b1aec2";
				createNewDropdown.classList.remove("show-create-new-dd");
			}
		});
	},
	{ passive: true }
);

timeClock.addEventListener(
	"click",
	() => {
		timeClock.classList.toggle("remove-border-right-radius");

		for (const btn of clockBtns) {
			btn.classList.toggle("show-time-clock-btn");
		}
	},
	{ passive: true }
);

// Sends a post request to clock user in/out
for (const btn of clockBtns) {
	btn.addEventListener(
		"click",
		async () => {
			if (btn.classList.contains("clock-in-btn")) {
				await helper.postReq("/clock-in", {
					clockInTime: Date.now(),
				});
				location.reload();
			} else {
				await helper.postReq("/clock-out", {
					clockOutTime: Date.now(),
				});
				location.reload();
			}

			btn.classList.remove("show-time-clock-btn");
		},
		{ passive: true }
	);
}

// Create form and post for each button clicked beside search bar
for (const btn of newBtns) {
	btn.addEventListener(
		"click",
		() => {
			const form = document.createElement("form");
			form.setAttribute("method", "post");
			form.setAttribute(
				"action",
				`/${btn.textContent.trim().toLowerCase()}s/new-${btn.textContent
					.trim()
					.toLowerCase()}`
			);

			var rx = /^\d{3}\-?\d{3}\-?\d{4}$/;

			// If a phone is put in the search bar, send it with POST req
			if (rx.test(searchInput.value)) {
				let phone = document.createElement("input");
				phone.setAttribute("type", "hidden");
				phone.setAttribute("value", searchInput.value);
				phone.setAttribute("name", "phone");
				form.appendChild(phone);
			}

			document.getElementsByTagName("body")[0].appendChild(form);
			form.submit();
		},
		{ passive: true }
	);
}
