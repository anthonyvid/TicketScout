"use strict";
import * as helper from "./helper/helper.js";

const viewPasssword = document.getElementById("eye_icon");
const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");
const loginBtn = document.getElementById("login_button");

viewPasssword.addEventListener("mousedown", () => {
	passwordInput.type = "text";
});
viewPasssword.addEventListener("mouseup", () => {
	passwordInput.type = "password";
});

loginBtn.addEventListener("click", () => {
	if (!emailInput.value) helper.showInvalidColour(emailInput);
	if (!passwordInput.value) helper.showInvalidColour(emailInput);
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
