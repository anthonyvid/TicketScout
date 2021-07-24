let dateObj = new Date();
let month = dateObj.getMonth() + 1; //months from 1-12
let day = dateObj.getDate();

const monthNames = [
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

const greeting = document.getElementById("greeting");

let today = new Date();
if (today.getHours() >= 0 && today.getHours() < 12) {
	greeting.insertAdjacentElement("afterbegin", `Good morning, `);
} else if (today.getHours() >= 12 && today.getHours() <= 17) {
	greeting.insertAdjacentElement("afterbegin", `Good afternoon, `);
} else if (today.getHours() >= 17 && today.getHours() < 24) {
	greeting.insertAdjacentElement("afterbegin", `Good evening, `);
}
