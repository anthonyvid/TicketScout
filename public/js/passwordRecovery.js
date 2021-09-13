const passEyeIcon = document.getElementById("pass_eye_icon");
const passConfEyeIcon = document.getElementById("pass_conf_eye_icon");
const passwordInput = document.getElementById("password");
const passwordConfirmInput = document.getElementById("passwordConfirm");

passEyeIcon.addEventListener("mousedown", () => {
	let passInput = passEyeIcon.previousElementSibling;
	if (passInput.name === "password") passwordInput.type = "text";
	if (passInput.name === "passwordConfirm")
		passwordConfirmInput.type = "text";
});
passEyeIcon.addEventListener("mouseup", () => {
	let passInput = passEyeIcon.previousElementSibling;
	if (passInput.name === "password") passwordInput.type = "password";
	if (passInput.name === "passwordConfirm")
		passwordConfirmInput.type = "password";
});
passConfEyeIcon.addEventListener("mousedown", () => {
	let passInput = passConfEyeIcon.previousElementSibling;
	if (passInput.name === "password") passwordInput.type = "text";
	if (passInput.name === "passwordConfirm")
		passwordConfirmInput.type = "text";
});
passConfEyeIcon.addEventListener("mouseup", () => {
	let passInput = passConfEyeIcon.previousElementSibling;
	if (passInput.name === "password") passwordInput.type = "password";
	if (passInput.name === "passwordConfirm")
		passwordConfirmInput.type = "password";
});
