"use strict";

//temporary test accounts
const account1 = {
	fullname: "anthony Vidovic",
	email: "test@gmail.com",
	password: "1234",
};

const accounts = [account1];

//Sign in page elements//
const signInBtnDesktop = document.getElementById("sign-in-btn-desktop");
const signInBtnMobile = document.getElementById("sign-in-btn-mobile");
const signInEmail = document.getElementById("sign-in-email");
const signInPsw = document.getElementById("sign-in-psw");
const signUpLinkDesktop = document.getElementById("sign-up-link");
const signUpLinkMobile = document.getElementById("sign-up-link-mobile");

//Sign up page elements//
const signUpBtn = document.getElementById("sign-up-btn");
const signUpFullname = document.getElementById("sign-up-fullname");
const signUpEmail = document.getElementById("sign-up-email");
const signUpPsw = document.getElementById("sign-up-psw");
const signUpPswConfirm = document.getElementById("sign-up-psw-confirm");
const signUpStorename = document.getElementById("storename");
const signUpRadioAdmin = document.getElementById("sign-up-admin");
const signUpRadioEmployee = document.getElementById("sign-up-employee");
const rbs = document.querySelectorAll('input[name="usertype"]');

//forgot password page elements//
const forgotPswEmail = document.getElementById("forgot-psw-email");
const forgotPswSubmitBtn = document.getElementById("forgot-psw-submit-btn");

//common elements between pages
const forgotPswLink1 = document.querySelector(".forgot-psw-link1");
const forgotPswLink2 = document.querySelector(".forgot-psw-link2");
const signInLink1 = document.querySelector(".sign-in-link1");
const signInLink2 = document.querySelector(".sign-in-link2");

//white boxes on homepage
const signInBox = document.querySelector(".login-box");
const signUpBox = document.querySelector(".sign-up-box");
const forgotPswBox = document.querySelector(".forgot-psw-box");

const graphicBoxText = document.getElementById("graphic-box-text");

for (const radio of rbs) {
	if (!radio.checked) {
		signUpStorename.style.display = "flex";
		console.log("test");
	}
}
