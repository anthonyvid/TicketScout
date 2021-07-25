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
	if (document.querySelector(".dropdown").classList.contains("show-dd")) {
		let keyCode = e.keyCode;
		if (keyCode === 27) {
			document.querySelector(".dropdown").classList.toggle("show-dd");
			document.getElementById("arrow").classList.toggle("rotate");
		}
	}
});

// userProfileIcon.addEventListener("click", function () {
// 	modelContainer.classList.add("show");
// 	updateAccountInput.forEach((node) => {
// 		node.value = "";
// 	});
// });

// userProfileBackBtn.addEventListener("click", function () {
// 	modelContainer.classList.remove("show");
// });

// document.addEventListener("keydown", function (e) {
// 	let keyCode = e.keyCode;
// 	if (keyCode === 27) {
// 		modelContainer.classList.remove("show");
// 	}
// });
