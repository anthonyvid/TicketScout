"use strict";

/**
 * Send an async POST request to the url.
 * @param {string} url The url to post to
 * @param {Object} body The body of the post request
 * @returns json sent from server
 */
export const postReq = async (url, body) => {
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
		return await response.json();
	} catch (error) {
		console.error(error);
	}
};

/**
 * Will add updated-row class to a row for a set period of time
 * @param {element} row 
 */
export const showUpdatedRow = (row) => {
	row.classList.add("updated-row");
	setTimeout(() => {
		row.classList.remove("updated-row");
	}, 1000);
};

/**
 * Gives an element a red background colour for set period of time
 * @param {element} element 
 */
export const showInvalidColour = (element) => {
	element.style.backgroundColor = "#FFCCCC";
	setTimeout(() => {
		element.style.backgroundColor = "#fff";
	}, 500);
};

/**
 * Gives an element a green background colour for set period of time
 * @param {element} element 
 */
export const showValidColour = (element) => {
	element.style.backgroundColor = "lightgreen";
	setTimeout(() => {
		element.style.backgroundColor = "#fff";
	}, 1500);
};

/**
 * @param {element} row 
 * @param {textNode} cellData 
 */
export const addCellToRow = (row, cellData) => {
	const tableData = row.insertCell();
	const content = document.createTextNode(cellData);
	tableData.appendChild(content);
};

/**
 * Given a select element, find the current value
 * @param {element} element to get value from
 * @returns currently selected value
 */
export const getSelectTagCurrentValue = (element) => {
	return Array.from(
		element.selectedOptions,
		({ textContent }) => textContent
	)[0].trim();
};

/**
 * Checks if an email address is valid
 * @param {string} email 
 * @returns boolean
 */
export const isValidEmail = (email) => {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
};

/**
 * Open print window
 */
export const print = () => {
	window.print();
};
