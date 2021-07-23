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

let date = `${monthNames[month - 1]} ${day}th, daily overview`;

document.getElementById("dashboard_date").innerHTML = date;
