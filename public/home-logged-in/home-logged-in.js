const userProfileIcon = document.getElementById("user-profile-icon");
const modelContainer = document.getElementById("model_container");
const updateAccountInput = document.querySelectorAll(".update-account-input");
const userProfileBackBtn = document.getElementById("profile-settings-back-btn");

userProfileIcon.addEventListener("click", function () {
	modelContainer.classList.add("show");
	updateAccountInput.forEach((node) => {
		node.value = "";
	});
});

userProfileBackBtn.addEventListener("click", function () {
	modelContainer.classList.remove("show");
});

document.addEventListener("keydown", function (e) {
	let keyCode = e.keyCode;
	if (keyCode === 27) {
		modelContainer.classList.remove("show");
	}
});

