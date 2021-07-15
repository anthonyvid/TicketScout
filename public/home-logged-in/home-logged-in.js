const userProfileIcon = document.getElementById("user-profile-icon");
const modelContainer = document.getElementById("model_container");
const updateAccountInput = document.getElementById("update-account-input");
const userProfileBackBtn = document.getElementById("profile-settings-back-btn");

userProfileIcon.addEventListener("click", function () {
	modelContainer.classList.add("show");
	updateAccountInput.value = "";
});

userProfileBackBtn.addEventListener("click", function () {
	modelContainer.classList.remove("show");
});
