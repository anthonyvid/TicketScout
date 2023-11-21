"use strict";
import * as helper from "./helper/helper.js";

const nextBtn = document.getElementById("next_Btn");
const registerBtn = document.getElementById("register_Btn");
const inputs1 = document.querySelectorAll(".input-1");
const inputs2 = document.querySelectorAll(".input-2");
const fullnameInput = document.getElementById("fullname");
const emailInput = document.getElementById("email");
const storenameInput = document.getElementById("storename");
const passwordInput = document.getElementById("password");
const passwordConfirmInput = document.getElementById("passwordConfirm");
const backArrow = document.getElementById("back_arrow");
const storeInfoInputWrap = document.querySelector(".store-info-container");
const passwordInfoWrap = document.querySelector(".password-container");
const primaryLottie = document.getElementById("primary_lottie");
const passwordLottie = document.getElementById("password_lottie");
const errorMsgBox = document.querySelector(".error-msg-wrap");
const errorMsgText = document.getElementById("err_msg_text");
const passEyeIcon = document.getElementById("pass_eye_icon");
const passConfEyeIcon = document.getElementById("pass_conf_eye_icon");

/**
 * Transition animation effect to password section
 */
const transitionToPasswordPage = async () => {
	storeInfoInputWrap.classList.remove("fadeInAnimation");
	storeInfoInputWrap.classList.add("fadeLeftAnimation");
	setTimeout(() => {
		storeInfoInputWrap.classList.remove("fadeLeftAnimation");
		storeInfoInputWrap.classList.add("hidden");
		passwordInfoWrap.classList.add("fadeInAnimation");
		passwordInfoWrap.classList.remove("hidden");
		registerBtn.style.backgroundColor = "#8fccff";
	}, 500);

	primaryLottie.classList.add("hidden");
	passwordLottie.classList.remove("hidden");
};

/**
 * Transition animation effect to store info section
 */
const transitionToStoreInfoPage = () => {
	passwordInfoWrap.classList.remove("fadeInAnimation");
	passwordInfoWrap.classList.add("fadeLeftAnimation");

	setTimeout(() => {
		passwordInfoWrap.classList.remove("fadeLeftAnimation");
		passwordInfoWrap.classList.add("hidden");
		storeInfoInputWrap.classList.add("fadeInAnimation");
		storeInfoInputWrap.classList.remove("hidden");
	}, 500);

	passwordLottie.classList.add("hidden");
	primaryLottie.classList.remove("hidden");
};

/**
 * Displays a text element for the given length with the given msg
 * @param {string} msg
 * @param {int} length
 * @returns Promise
 */
const showSuccessMessage = async (msg, length) => {
	document.querySelector(".success-msg").textContent = msg;
	return new Promise((resolve, reject) => {
		setInterval(() => {
			document.querySelector(".success-msg").textContent = "";
			resolve();
		}, length);
	});
};

/**
 * Loading animation after Admin signup
 * @returns Promise
 */
const showLoadingAnimation = async () => {
	passwordInfoWrap.classList.add("hidden");
	storeInfoInputWrap.classList.add("hidden");
	document.querySelector(".loading-animation").classList.remove("hidden");
	return new Promise(async (resolve, reject) => {
		await showSuccessMessage("Woohoo! Time to get organized.", 3000);
		await showSuccessMessage("Configuring store settings...", 3000);
		await showSuccessMessage("Loading in default settings...", 3000);
		await showSuccessMessage("Success! Email verification sent. Check Spam!", 4000);

		resolve();
	});
};

/**
 * shows errorMsgBox and gives it the given msg content
 * @param {string} msg
 */
const showErrorMsg = (msg) => {
	errorMsgBox.classList.remove("hidden");
	errorMsgText.textContent = msg;
};

for (const input of inputs1) {
	input.addEventListener("input", () => {
		if (fullnameInput.value && emailInput.value && storenameInput.value) {
			nextBtn.style.backgroundColor = "#6fb7f9";
		} else {
			nextBtn.style.backgroundColor = "#8fccff";
		}
	});
}
for (const input of inputs2) {
	input.addEventListener("input", () => {
		if (
			passwordInput.value.length > 7 &&
			passwordConfirmInput.value.length > 7
		) {
			registerBtn.style.backgroundColor = "#6fb7f9";
		} else {
			registerBtn.style.backgroundColor = "#8fccff";
		}
	});
}

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

backArrow.addEventListener("click", () => {
	transitionToStoreInfoPage();
});

nextBtn.addEventListener("click", async () => {
	if (!fullnameInput.value) {
		helper.showInvalidColour(fullnameInput);
		return;
	}
	if (!emailInput.value) {
		helper.showInvalidColour(emailInput);
		return;
	}
	if (!storenameInput.value) {
		helper.showInvalidColour(storenameInput);
		return;
	}
	await transitionToPasswordPage();
});

registerBtn.addEventListener("click", async () => {
	if (!passwordInput.value) {
		helper.showInvalidColour(passwordInput);
		return;
	}
	if (!passwordConfirmInput.value) {
		helper.showInvalidColour(passwordConfirmInput);
		return;
	}

	const data = await helper.postReq("/admin/register", {
		fullname: fullnameInput.value,
		email: emailInput.value,
		storename: storenameInput.value,
		password: passwordInput.value,
		passwordConfirm: passwordConfirmInput.value,
	});

	if (!data.errors.length) {
		await showLoadingAnimation();
		window.location.replace("https://ticket-scout.vercel.app/");
	} else {
		showErrorMsg(data.errors[0]);
	}
});
