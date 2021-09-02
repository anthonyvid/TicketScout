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

export const showUpdatedRow = (row, originalColor) => {
	row.classList.add("updated-row");
	setTimeout(() => {
		row.classList.remove("updated-row");
	}, 1000);
};

export const showInvalidColour = (element) => {
	element.style.backgroundColor = "#FFCCCC";
	setTimeout(() => {
		element.style.backgroundColor = "#fff";
	}, 500);
};

export const showValidColour = (element) => {
	element.style.backgroundColor = "lightgreen";
	setTimeout(() => {
		element.style.backgroundColor = "#fff";
	}, 1500);
};

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

export const isValidEmail = (email) => {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
};

export const print = () => {
	window.print();
};
