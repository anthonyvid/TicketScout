const dropDownIcon = document.querySelector(".icon-wrap");
const currentDate = document.getElementById("current_date");
const plusBoxIcon = document.querySelector(".create-new");
const timeClock = document.getElementById("time_clock");
const clockBtns = document.querySelectorAll(".clockBtn");
const resultDropdown = document.querySelector(".search-results-dropdown");
const newBtns = document.querySelectorAll(".new-btn");

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

currentDate.insertAdjacentHTML("afterbegin", today);

$(document).ready(function () {
	var CurrentUrl = document.URL;
	var CurrentUrlEnd = CurrentUrl.split("/").filter(Boolean).pop();
	console.log(CurrentUrlEnd);
	$("#nav_list li a").each(function () {
		var ThisUrl = $(this).attr("href");
		var ThisUrlEnd = ThisUrl.split("/").filter(Boolean).pop();

		if (ThisUrlEnd == CurrentUrlEnd) {
			$(this).closest("li a").addClass("active");
		}
	});
});

dropDownIcon.addEventListener("click", () => {
	document.getElementById("arrow").classList.toggle("rotate");
	document.querySelector(".dropdown").classList.toggle("show-dd");
});

document.addEventListener("keydown", function (e) {
	let keyCode = e.keyCode;
	if (document.querySelector(".dropdown").classList.contains("show-dd")) {
		if (keyCode === 27) {
			document.querySelector(".dropdown").classList.toggle("show-dd");
			document.getElementById("arrow").classList.toggle("rotate");
		}
	}
	if (
		document
			.querySelector(".create-new-dropdown")
			.classList.contains("show-create-new-dd")
	) {
		if (keyCode === 27) {
			document
				.querySelector(".create-new-dropdown")
				.classList.toggle("show-create-new-dd");
			plusBoxIcon.style.color = "#b1aec2";
		}
	}
});

plusBoxIcon.addEventListener("click", () => {
	document
		.querySelector(".create-new-dropdown")
		.classList.toggle("show-create-new-dd");
	if (plusBoxIcon.style.color != "black") {
		plusBoxIcon.style.color = "black";
	} else {
		plusBoxIcon.style.color = "#b1aec2";
	}
});

const closeDropdown = () => {
	e.target.classList.remove("show-create-new-dd");
	document.removeEventListener("click", closeDropdown);
};

timeClock.addEventListener("click", function () {
	timeClock.classList.toggle("removeBorderRightRadius");

	for (const btn of clockBtns) {
		btn.classList.toggle("showTimeClockBtn");
	}
});

for (const btn of clockBtns) {
	btn.addEventListener("click", () => {
		if (btn.classList.contains("clock-in-btn")) {
			(async () => {
				const response = await fetch("/clock-in", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ clockInTime: Date.now() }),
				});
				location.reload();
				const data = await response.json();
			})();
		} else {
			(async () => {
				const response = await fetch("/clock-out", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ clockOutTime: Date.now() }),
				});
				location.reload();
				// const data = await response.json();
			})();
		}

		btn.classList.remove("showTimeClockBtn");
	});
}

const liveSearch = (e) => {
	if (e.value.length < 2) {
		resultDropdown.style.display = "none";
		return;
	}
	(async () => {
		const response = await fetch("/live-search-results", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ search: e.value }),
		});
		const data = await response.json();
		while (resultDropdown.firstChild) {
			resultDropdown.removeChild(resultDropdown.lastChild);
		}
		showSearchResults(data.results);
	})();
};

$("#search-result-form").on("keypress", function (event) {
	var keyPressed = event.keyCode || event.which;
	if (keyPressed === 13) {
		event.preventDefault();
		return false;
	}
});

const showSearchResults = (results) => {
	const { tickets, customers, payments } = results;

	if (tickets.length == 0 && customers.length == 0 && payments.length == 0) {
		console.log("No results found");
		return;
	}

	resultDropdown.style.display = "flex";

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
};

for (const btn of newBtns) {
	btn.addEventListener("click", () => {
		const form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute(
			"action",
			`/new-${btn.textContent.trim().toLowerCase()}`
		);

		const searchValue = document.getElementById(
			"search_for_anything"
		).value;
		var rx = /^\d{3}\-?\d{3}\-?\d{4}$/;

		if (rx.test(searchValue)) {
			console.log("valid");
			let phone = document.createElement("input");
			phone.setAttribute("type", "hidden");
			phone.setAttribute("value", searchValue);
			phone.setAttribute("name", "phone");
			form.appendChild(phone);
		}

		document.getElementsByTagName("body")[0].appendChild(form);
		form.submit();
	});
}
