const userProfileIcon = document.getElementById("user-profile-icon");
const modelContainer = document.getElementById("model_container");
const updateAccountInput = document.querySelectorAll(".update-account-input");
const userProfileBackBtn = document.getElementById("profile-settings-back-btn");
const navList = document.querySelector("#navList");
const menuLinks = navList.querySelectorAll(".menu-link");
const timeClock = document.getElementById("time-clock");
const timeClockSettings = document.querySelector(".clock-settings-wrap");
const dropDownIcon = document.querySelector(".icon-wrap");
const currentDate = document.getElementById("current-date");
const plusBoxIcon = document.querySelector(".create-new");

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
	$("#navList li a").each(function () {
		var ThisUrl = $(this).attr("href");
		var ThisUrlEnd = ThisUrl.split("/").filter(Boolean).pop();

		if (ThisUrlEnd == CurrentUrlEnd) {
			$(this).closest("li a").addClass("active");
		}
	});
});

timeClock.addEventListener("click", function () {
	timeClock.classList.toggle("time-clock-animation");
	document.querySelector(".clock-settings-wrap").classList.toggle("expanded");
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
