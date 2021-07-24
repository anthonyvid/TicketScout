const userProfileIcon = document.getElementById("user-profile-icon");
const modelContainer = document.getElementById("model_container");
const updateAccountInput = document.querySelectorAll(".update-account-input");
const userProfileBackBtn = document.getElementById("profile-settings-back-btn");
const navList = document.querySelector("#navList");
const menuLinks = navList.querySelectorAll(".menu-link");
const timeClock = document.getElementById("time-clock");

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

console.log(timeClock);

timeClock.addEventListener("click", function () {
	console.log("test");
	timeClock.classList.add("time-clock-animation");
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
