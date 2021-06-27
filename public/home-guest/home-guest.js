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

// signUpBtn.addEventListener("click", (e) => e.preventDefault());

// signUpBtn.addEventListener("click", function (e) {
// 	console.log('object');
// 	e.preventDefault();
// });
//////////////////
/* Functions */
//////////////////
const swapFrame = function (from, to) {
	from.style.display = "none";
	to.style.display = "flex";
};

// function validateName(name) {
// 	var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
// 	var nameToTest = name;
// 	if (!regName.test(nameToTest)) {
// 		console.log("Please enter your full name (first & last name).");
// 		return false;
// 	} else {
// 		console.log("Valid name given.");
// 		return true;
// 	}
// }

// function validateEmail(email) {
// 	const re =
// 		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// 	return re.test(String(email).toLowerCase());
// }

////////////////////////////////////////////////////////
//click forgotPsw link
forgotPswLink1.addEventListener("click", function () {
	swapFrame(signInBox, forgotPswBox);
	graphicBoxText.innerHTML = "Recover your account";
});
//click signUp Link desktop
signUpLinkDesktop.addEventListener("click", function () {
	swapFrame(signInBox, signUpBox);
	graphicBoxText.innerHTML = "Create an account to get started";
});
//click signIn Link on forgotPsw Page
signInLink2.addEventListener("click", function () {
	swapFrame(forgotPswBox, signInBox);
	graphicBoxText.innerHTML = "Sign in to start your day!";
});
//click forgotPsw link on signUp Page
forgotPswLink2.addEventListener("click", function () {
	swapFrame(signUpBox, forgotPswBox);
	graphicBoxText.innerHTML = "Recover your account";
});
//click signIn Link on signUp Page
signInLink1.addEventListener("click", function () {
	swapFrame(signUpBox, signInBox);
	graphicBoxText.innerHTML = "Sign in to start your day!";
});
////////////////////////////////////////////////////////

//////////////////
/* SIGN UP PAGE */
//////////////////

//Click signUp button on signup page
// signUpBtn.addEventListener("click", function (e) {
// 	e.preventDefault();

// 	//any input isnt filled in
// 	if (
// 		!(
// 			signUpFullname.value &&
// 			signUpEmail.value &&
// 			signUpPsw.value &&
// 			signUpPswConfirm.value
// 		)
// 	) {
// 		console.log("invalid entry");
// 		return;
// 	}

// 	//check if fullname is valid
// 	if (!validateName(signUpFullname.value)) return;
// 	//check if email is valid
// 	if (!validateEmail(signUpEmail.value)) return;
// 	//check if passwords match
// 	if (signUpPsw.value !== signUpPswConfirm.value) return;

// 	console.log("All signup info is valid, pass to backend");

// 	//if gets to this point then the info is valid, pass to backend now?w
// });
//////////////////
/* SIGN IN PAGE */
//////////////////
//Click Sign in Button
// signInBtnDesktop.addEventListener("click", function (e) {
// 	e.preventDefault();

// 	//check if inputs have values
// 	if (
// 		!(signInEmail && signInEmail.value && signInPsw && signInPsw.value) ||
// 		!validateEmail(signInEmail.value)
// 	) {
// 		console.log("Invalid Entry");
// 		signInEmail.style.color = "red";
// 		signInEmail.style.borderColor = "red";
// 		document.querySelector(".fa-user").style.color = "red";
// 		signInEmail.style.transition = "0.3s ease-in";
// 		setTimeout(function () {
// 			signInEmail.style.color = "#3d354b";
// 			signInEmail.style.borderColor = "#b1aec2";
// 			document.querySelector(".fa-user").style.color = "#b1aec2";
// 			signInEmail.style.transition = "0.3s ease-in";

// 			// signInEmail.style.transition.focus = "0.3s ease-in";
// 			// signInEmail.style.color.focus = "#3d354b";
// 			// signInEmail.style.focus.borderColor = "#3d354b";
// 		}, 3000);

// 		return;
// 	}
// 	//get currentAccount
// 	currentAccount = accounts.find(
// 		(acc) => acc.email === signInEmail.value.toLowerCase()
// 	);

// 	//if no current account then email is not registered
// 	if (!currentAccount) {
// 		console.log("email not found");
// 		return;
// 	}

// 	console.log(currentAccount);

// 	//check if password matches record
// 	if (currentAccount.password === signInPsw.value) {
// 		console.log("correct password");
// 	} else {
// 		console.log("incorrect password");
// 	}
// });

//////////////////
/* FORGOT PASSWORD PAGE */
//////////////////
//Click submit button on forgot password page
// forgotPswSubmitBtn.addEventListener("click", function (e) {
// 	e.preventDefault();

// 	if (
// 		!validateEmail(forgotPswEmail.value) ||
// 		!(forgotPswEmail && forgotPswEmail.value)
// 	) {
// 		console.log("Invalid Entry");
// 		return;
// 	}

// 	//get currentAccount
// 	currentAccount = accounts.find(
// 		(acc) => acc.email === signInEmail.value.toLowerCase()
// 	);

// 	//if no current account then email is not registered
// 	if (!currentAccount) {
// 		console.log("email not found");
// 		return;
// 	}

// 	console.log(currentAccount);
// });
