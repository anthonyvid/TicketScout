import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { db } from "../db.js";
const usersCollection = db.collection("users");
const storesCollection = db.collection("stores");

export const isValidPhone = (phone) => {
	let re =
		/(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g;
	return re.test(phone);
};

export const isValidEmail = (email) => {
	let re = /\S+@\S+\.\S+/;
	return re.test(email);
};

/**
 * Given a string, function will hash it using bcrypt
 * @param {string} str
 * @returns hashed data
 */
export const hashPrivateInfo = (str) => {
	let salt = bcrypt.genSaltSync(10);
	const hashedData = bcrypt.hashSync(str, salt);
	return hashedData;
};

export const getUser = async (email) => {
	return await usersCollection.findOne({ email: email });
};

export const sendEmail = async (msg) => {
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.GMAILUSER,
			pass: process.env.GMAILPASS,
		},
	});

	const info = await transporter.sendMail(msg, (err, data) => {
		if (err) {
			console.log("error occured: ", err);
		} else {
			console.log("Email sent");
		}
	});
};

/**
 * Given a storename will search and get store from database
 * @param {string} storename store to get
 * @returns object of store from database
 */
export const getStore = async (storename) => {
	return await storesCollection.findOne({ storename: storename });
};

/**
 * Will get the largest number in the array,
 * if array is empty will return the given start number
 * @param {array} array an array of numbers
 * @param {number} start number returned if array is empty
 * @returns largest number in array, or start number if array is empty
 */
export const getLargestNum = async (array, start) => {
	if (!array.length) return start;
	return Math.max(...array.map((i) => parseInt(i)));
};

export const clearDatabase = async () => {
	await usersCollection.deleteMany({});
	await storesCollection.deleteMany({});
};
