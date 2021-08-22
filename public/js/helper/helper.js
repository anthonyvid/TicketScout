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

export const showInvalidColour = (element) => {
	element.style.backgroundColor = "#FFCCCC";
	setTimeout(() => {
		element.style.backgroundColor = "#fff";
	}, 500);
};

export const addCellToRow = (row, cellData) => {
	const tableData = row.insertCell();
	const content = document.createTextNode(cellData);
	tableData.appendChild(content);
};
