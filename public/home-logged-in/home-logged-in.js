const userProfileIcon = document.getElementById("user-profile-icon");
const modelContainer = document.getElementById("model_container");

userProfileIcon.addEventListener("click", function () {
	modelContainer.classList.add("show");
});
