window.onload = () => {
	const sections = document.querySelectorAll(".section");
	const menuItems = document.querySelectorAll(".menu-item");

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries)
				if (entry.isIntersecting) {
					for (const item of menuItems) {
						if (
							item.textContent
								.trim()
								.toLowerCase()
								.replace(" ", "") === entry.target.id
						) {
							item.classList.add("color-menu-item");
						} else {
							item.classList.remove("color-menu-item");
						}
					}
				}
		},
		{
			rootMargin: "-50% 0px",
		}
	);
	for (let i = 0; i < sections.length; i++) observer.observe(sections[i]);
};

let totalhoursWorked = 0;
const userClockHistory = JSON.parse(
	document.getElementById("user-clock-history").value
);

const tbodyref = document.getElementById("tbodyref");

for (let i = userClockHistory.length - 1; i > -1; i--) {
	const newRow = tbodyref.insertRow();
	newRow.classList.add("table-row");
	const td1 = newRow.insertCell();
	let tdContent = document.createTextNode(userClockHistory[i].date);
	td1.appendChild(tdContent);
	const td2 = newRow.insertCell();
	tdContent = document.createTextNode(
		new Date(userClockHistory[i].clockInTime).toLocaleTimeString()
	);
	td2.appendChild(tdContent);
	const td3 = newRow.insertCell();
	tdContent = document.createTextNode(
		new Date(userClockHistory[i].clockOutTime).toLocaleTimeString()
	);
	td3.appendChild(tdContent);
	const td4 = newRow.insertCell();
	tdContent = document.createTextNode(
		Number(userClockHistory[i].hoursWorked).toFixed(5)
	);
	totalhoursWorked += Number(parseFloat(tdContent.wholeText));

	td4.appendChild(tdContent);
}

const fromDateFilter = document.getElementById("fromDate");
const toDateFilter = document.getElementById("toDate");

const filterDateBtn = document.getElementById("filter-dates-btn");
const clearDateBtn = document.getElementById("reset-dates-btn");

const hoursWorkedText = document.getElementById("hours-worked-text");
hoursWorkedText.textContent = `Total hours worked: ${totalhoursWorked.toFixed(
	5
)}`;

clearDateBtn.addEventListener("click", () => {
	hoursWorkedText.textContent = `Total hours worked: ${totalhoursWorked.toFixed(
		5
	)}`;
	const tableRows = document.querySelectorAll(".table-row");
	for (const row of tableRows) {
		row.style.display = "flex";
	}
	fromDateFilter.value = "";
	toDateFilter.value = "";
});

filterDateBtn.addEventListener("click", () => {
	if (!fromDateFilter.value) {
		showInvalidColour(fromDateFilter);
		return;
	} else if (!toDateFilter.value) {
		showInvalidColour(toDateFilter);
		return;
	}
	let hoursWorkedForPeriod = 0;
	const tableRows = document.querySelectorAll(".table-row");
	for (const row of tableRows) {
		let dateOnRow = row.firstElementChild.textContent.trim();
		if (
			dateOnRow < fromDateFilter.value ||
			dateOnRow > toDateFilter.value
		) {
			row.style.display = "none";
		} else {
			hoursWorkedForPeriod += parseFloat(
				row.lastElementChild.textContent
			);
		}
	}
	hoursWorkedText.textContent = `Hours worked for selected period: ${hoursWorkedForPeriod.toFixed(
		5
	)}`;
});

const showInvalidColour = (element) => {
	element.style.backgroundColor = "#FFCCCC";
	setTimeout(() => {
		element.style.backgroundColor = "#fff";
	}, 500);
};

const employeeTotalCheckbox = document.getElementById("totalUpEmployeeHours");

const showEmployeeTotals = (data, payPeriod) => {
	const adminTBodyRed = document.getElementById("adminTBodyRed");

	for (let i = 0; i < data.length; i++) {
		const newRow = adminTBodyRed.insertRow();
		newRow.classList.add("table-row");
		const td1 = newRow.insertCell();
		let tdContent = document.createTextNode(data[i][0]);
		td1.appendChild(tdContent);

		const td2 = newRow.insertCell();
		tdContent = document.createTextNode(data[i][1].toFixed(5));
		td2.appendChild(tdContent);

		const td3 = newRow.insertCell();
		tdContent = document.createTextNode(payPeriod);
		td3.appendChild(tdContent);
	}
};

employeeTotalCheckbox.addEventListener("click", () => {
	if (!employeeTotalCheckbox.checked) {
		document.getElementById("table").style.display = "table";
		hoursWorkedText.style.display = "flex";
		document.getElementById("pay-period").textContent = "";
		document.querySelector(".admin-table").classList.add("hide");
		$(".admin-table tbody tr").remove();
	} else {
		if (!fromDateFilter.value) {
			showInvalidColour(fromDateFilter);
			employeeTotalCheckbox.checked = false;
			return;
		} else if (!toDateFilter.value) {
			showInvalidColour(toDateFilter);
			employeeTotalCheckbox.checked = false;
			return;
		}
		document.getElementById("table").style.display = "none";
		hoursWorkedText.style.display = "none";
		document.querySelector(".admin-table").classList.remove("hide");
		(async () => {
			try {
				const response = await fetch(
					"/get-employees-timeclock-history",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							fromDate: fromDateFilter.value,
							toDate: toDateFilter.value,
						}),
					}
				);
				const data = await response.json();
				document.getElementById("pay-period").textContent =
					"Pay period: " + data.payPeriod;
				showEmployeeTotals(data.employeesClockHistory, data.payPeriod);
			} catch (error) {
				console.log(error);
			}
		})();
	}
});

const createCategoryBtn = document.getElementById("create-category");
const removeCategoryBtn = document.getElementById("remove-category");
const categoryInput = document.getElementById("category-input");

createCategoryBtn.addEventListener("click", () => {
	removeCategoryBtn.style.display = "none";
	categoryInput.style.display = "flex";
	createCategoryBtn.style.width = "25%";

	if (categoryInput.value == "") {
		showInvalidColour(categoryInput);
		return;
	}

	(async () => {
		try {
			await fetch("/add-category", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					category: categoryInput.value,
				}),
			});
			document.location.reload();
			console.log("yaa");
		} catch (error) {
			console.log(error);
		}
	})();
});

removeCategoryBtn.addEventListener("click", () => {
	createCategoryBtn.style.display = "none";
	categoryInput.style.display = "flex";
	removeCategoryBtn.style.width = "25%";
	if (categoryInput.value == "") {
		showInvalidColour(categoryInput);
		return;
	}

	(async () => {
		try {
			await fetch("/remove-category", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					category: categoryInput.value,
				}),
			});
			document.location.reload();
		} catch (error) {
			console.log(error);
		}
	})();
});

const taxRateInput = document.getElementById("taxRateInput");

document.getElementById("taxRateBtn").addEventListener("click", () => {
	if (taxRateInput.value == "" || !/^\d+$/.test(taxRateInput.value)) {
		showInvalidColour(taxRateInput);
		return;
	}

	(async () => {
		try {
			await fetch("/update-store-taxRate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					taxRate: taxRateInput.value,
				}),
			});
			document.location.reload();
		} catch (error) {
			console.log(error);
		}
	})();
});

const primaryAddress = document.getElementById("primary-address");
const city = document.getElementById("city");
const province = document.getElementById("province");
const postalCode = document.getElementById("postal-code");
const addressInputs = document.querySelectorAll(".address-input");

document
	.getElementById("update-address-button")
	.addEventListener("click", () => {
		for (const input of addressInputs) {
			if (!input.value) {
				showInvalidColour(input);
				return;
			}
		}

		(async () => {
			try {
				await fetch("/update-store-address", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						primary: primaryAddress.value,
						city: city.value,
						province: province.value,
						postalCode: postalCode.value,
					}),
				});
				document.location.reload();
			} catch (error) {
				console.log(error);
			}
		})();
	});

const ticketStatuses = document.querySelectorAll(".status");
const statusNameInput = document.getElementById("status-name-input");
const statusColorInput = document.getElementById("status-color-input");
const colorPreview = document.getElementById("color-preview");

const showColorPreview = (e) => {
	colorPreview.style.backgroundColor = e.value;
};

for (const status of ticketStatuses) {
	const statusColor = JSON.parse(status.lastElementChild.value);
	const colorCircle = status.firstElementChild.nextElementSibling;
	colorCircle.style.backgroundColor = `#${statusColor}`;

	status.addEventListener("click", () => {
		statusNameInput.value = status.firstElementChild.textContent.trim();
		statusColorInput.value = "#" + statusColor;
		colorPreview.style.backgroundColor = "#" + statusColor;
	});
}

const addOrUpdateStatusBtn = document.getElementById(
	"update-ticket-status-settings"
);

addOrUpdateStatusBtn.addEventListener("click", () => {
	if (!statusNameInput.value) {
		showInvalidColour(statusNameInput);
		return;
	} else if (
		statusColorInput.value.length < 2 ||
		!statusColorInput.value.startsWith("#")
	) {
		showInvalidColour(statusColorInput);
		return;
	}
	for (const status of ticketStatuses) {
		if (
			status.firstElementChild.textContent.toUpperCase().trim() ===
			statusNameInput.value.toUpperCase()
		) {
			showInvalidColour(statusNameInput);
			return;
		}
	}

	(async () => {
		try {
			await fetch("/update-ticket-status-settings", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					statusName: statusNameInput.value.trim(),
					statusColor: statusColorInput.value.trim().substring(1),
				}),
			});
			document.location.reload();
		} catch (error) {
			console.log(error);
		}
	})();
});

const deleteTicketStatusBtn = document.getElementById(
	"delete-ticket-status-settings"
);

deleteTicketStatusBtn.addEventListener(
	"click",
	() => {
		if (!statusNameInput.value) {
			showInvalidColour(statusNameInput);
			return;
		}
		let statusNames = [];
		[...ticketStatuses].forEach((item) => {
			statusNames.push(item.textContent.trim().toUpperCase());
		});

		if (!statusNames.includes(statusNameInput.value.toUpperCase())) {
			showInvalidColour(statusNameInput);
			return;
		}

		(async () => {
			try {
				await fetch("/delete-ticket-status-settings", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						statusName: statusNameInput.value.trim(),
						statusColor: statusColorInput.value.trim().substring(1),
					}),
				});
				document.location.reload();
			} catch (error) {
				console.log(error);
			}
		})();
	},
	{ passive: true }
);

const rgb2hex = (rgb) =>
	`#${rgb
		.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
		.slice(1)
		.map((n) => parseInt(n, 10).toString(16).padStart(2, "0"))
		.join("")}`;

const colorCopy = document.querySelectorAll(".color-copy");

for (color of colorCopy) {
	const colorRGB = window
		.getComputedStyle(color)
		.getPropertyValue("background-color");
	color.addEventListener("click", async () => {
		await navigator.clipboard.writeText(rgb2hex(colorRGB));
	});
}

const createIssueBtn = document.getElementById("create-issue");
const deleteIssueBtn = document.getElementById("remove-issue");
const issueInput = document.getElementById("issue-input");

createIssueBtn.addEventListener("click", () => {
	deleteIssueBtn.style.display = "none";
	issueInput.style.display = "flex";
	createIssueBtn.style.width = "25%";

	if (issueInput.value == "") {
		showInvalidColour(issueInput);
		return;
	}

	(async () => {
		try {
			await fetch("/add-issue", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					issue: issueInput.value.trim().toLowerCase(),
				}),
			});
			document.location.reload();
			console.log("yaa");
		} catch (error) {
			console.log(error);
		}
	})();
});

deleteIssueBtn.addEventListener("click", () => {
	createIssueBtn.style.display = "none";
	issueInput.style.display = "flex";
	deleteIssueBtn.style.width = "25%";
	if (issueInput.value == "") {
		showInvalidColour(issueInput);
		return;
	}

	(async () => {
		try {
			await fetch("/remove-issue", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					issue: issueInput.value.trim().toLowerCase(),
				}),
			});
			document.location.reload();
		} catch (error) {
			console.log(error);
		}
	})();
});

const deleteStoreDataBtns = document.querySelectorAll(".delete-store-data");
const confirmRemovalBtns = document.querySelectorAll(".confirm-removal");

for (const btn of deleteStoreDataBtns) {
	btn.addEventListener("click", () => {
		if (btn.parentElement.previousElementSibling.value < 2) {
			showInvalidColour(btn.parentElement.previousElementSibling);
			return;
		}

		btn.style.width = "30%";
		btn.nextElementSibling.style.display = "flex";
	});
}

for (const btn of confirmRemovalBtns) {
	btn.addEventListener("click", () => {
		if (btn.parentElement.previousElementSibling.value < 2) {
			showInvalidColour(btn.parentElement.previousElementSibling);
			return;
		}

		const url = btn.textContent.trim().split(" ")[1].toLowerCase();
		const deletionItem =
			btn.parentElement.previousElementSibling.value.replace(
				/[^0-9]/g,
				""
			);

		if (!deletionItem) {
			showInvalidColour(btn.parentElement.previousElementSibling);
			return;
		}

		(async () => {
			try {
				await fetch(`/delete-${url}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						item: deletionItem,
					}),
				});
				document.location.reload();
			} catch (error) {
				console.log(error);
			}
		})();
	});
}
