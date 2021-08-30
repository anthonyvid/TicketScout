"use strict";
import * as helper from "../js/helper/helper.js";

const passwordRecovoryInput = document.getElementById("pass_recovery");
const recoveryBtn = document.getElementById("recovery_button");

passwordRecovoryInput.addEventListener("input", () => {
	if (passwordRecovoryInput.value) {
		recoveryBtn.style.backgroundColor = "#6fb7f9";
	} else {
		recoveryBtn.style.backgroundColor = "#8fccff";
	}
});

recoveryBtn.addEventListener("click", () => {
	if (!passwordRecovoryInput.value)
		helper.showInvalidColour(passwordRecovoryInput);
});
