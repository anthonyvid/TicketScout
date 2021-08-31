"use strict";
import * as helper from "./helper/helper.js";

const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");
const loginBtn = document.getElementById("login_button");
const primaryLottie = document.getElementById("primary_lottie");
const passwordLottie = document.getElementById("password_lottie");

loginBtn.addEventListener("click", () => {
	if (!emailInput.value) {
		helper.showInvalidColour(emailInput);
		return;
	}
	if (!passwordInput.value) {
		helper.showInvalidColour(emailInput);
		return;
	}

	primaryLottie.classList.add("hidden");

	passwordLottie.classList.remove("hidden");

	setInterval(() => {
		document.getElementById("login_form").submit();
		return;
	}, 2000);
});

emailInput.addEventListener("input", () => {
	if (emailInput.value && passwordInput.value) {
		loginBtn.style.backgroundColor = "#6fb7f9";
	} else {
		loginBtn.style.backgroundColor = "#8fccff";
	}
});
passwordInput.addEventListener("input", () => {
	if (emailInput.value && passwordInput.value)
		loginBtn.style.backgroundColor = "#6fb7f9";
	else {
		loginBtn.style.backgroundColor = "#8fccff";
	}
});
