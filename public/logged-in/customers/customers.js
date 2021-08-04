const names = document.querySelectorAll(".name_link");
const phones = document.querySelectorAll(".phone_link");
const tableRows = document.querySelectorAll("#table-row");
const nameSearchBox = document.getElementById("search-name");
const phoneSearchBox = document.getElementById("search-phone");

for (const name of names) {
	const phone =
		name.parentElement.nextElementSibling.firstElementChild.textContent;
	name.href += phone.trim().replace(/\D/g, "");
}

for (const phone of phones) {
	phone.href += phone.textContent.trim().replace(/\D/g, "");
}

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
