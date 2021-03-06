"use strict";

import * as helper from "./helper/helper.js";

/**
 * Scrollspy effect on account settings sidebar
 * @returns none
 */
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

/**
 * Converts rbg to hex value
 * @param {string} rgb 
 * @returns string  
 */
const rgb2hex = (rgb) =>
	`#${rgb
		.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
		.slice(1)
		.map((n) => parseInt(n, 10).toString(16).padStart(2, "0"))
		.join("")}`;

//////////////////////////////////
/* ACCOUNT SETTINGS: Time Clock */
//////////////////////////////////
const userClockHistory = JSON.parse(
	document.getElementById("user-clock-history").value
);
const tableBodyRef = document.getElementById("table_body_ref");
const adminTableBodyRef = document.getElementById("admin_table_body_ref");
const fromDateFilter = document.getElementById("from_date");
const toDateFilter = document.getElementById("to_date");
const filterDateBtn = document.getElementById("filter_dates_btn");
const clearDateBtn = document.getElementById("reset_dates_btn");
const hoursWorkedText = document.getElementById("hours_worked_text");
const userClockTable = document.getElementById("user_clock_table");
const employeeTotalCheckbox = document.getElementById(
	"total_up_employee_hours"
);

let totalHoursWorked = 0;

/**
 * Displays the users timecocks, most recent first
 */
for (let i = userClockHistory.length - 1; i > -1; i--) {
	const newRow = tableBodyRef.insertRow();
	newRow.classList.add("table-row");

	// Date of clock
	helper.addCellToRow(newRow, userClockHistory[i].date);
	// Clock In time of clock
	helper.addCellToRow(
		newRow,
		new Date(userClockHistory[i].clockInTime).toLocaleTimeString()
	);
	// Clock Out time of clock
	helper.addCellToRow(
		newRow,
		new Date(userClockHistory[i].clockOutTime).toLocaleTimeString()
	);
	// Number of Hours worked for clock
	helper.addCellToRow(newRow, userClockHistory[i].hoursWorked.toFixed(3));

	totalHoursWorked += Number(userClockHistory[i].hoursWorked);
}

hoursWorkedText.textContent = `Total hours worked: ${totalHoursWorked.toFixed(
	2
)}`;

// Clear from and to date inputs, as well as hours worked for that period
clearDateBtn.addEventListener(
	"click",
	() => {
		hoursWorkedText.textContent = `Total hours worked: ${totalHoursWorked.toFixed(
			2
		)}`;
		const tableRows = document.querySelectorAll(".table-row");
		for (const row of tableRows) {
			row.style.display = "flex";
		}
		fromDateFilter.value = "";
		toDateFilter.value = "";
	},
	{ passive: true }
);

filterDateBtn.addEventListener(
	"click",
	() => {
		if (!fromDateFilter.value) {
			helper.showInvalidColour(fromDateFilter);
			return;
		} else if (!toDateFilter.value) {
			helper.showInvalidColour(toDateFilter);
			return;
		}

		let hoursWorkedForPeriod = 0;
		const tableRows = document.querySelectorAll(".table-row");

		// Show clocks on table for the selected period
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
			2
		)}`;
	},
	{ passive: true }
);

employeeTotalCheckbox.addEventListener(
	"click",
	async () => {
		if (!employeeTotalCheckbox.checked) {
			userClockTable.style.display = "table";
			hoursWorkedText.style.display = "flex";
			document.getElementById("pay_period").textContent = "";
			document.querySelector(".admin-table").classList.add("hide");
			$(".admin-table tbody tr").remove();
		} else {
			// Employee Totals checkbox selected, validate from and to date inputs
			if (!fromDateFilter.value) {
				helper.showInvalidColour(fromDateFilter);
				employeeTotalCheckbox.checked = false;
				return;
			} else if (!toDateFilter.value) {
				helper.showInvalidColour(toDateFilter);
				employeeTotalCheckbox.checked = false;
				return;
			}
			userClockTable.style.display = "none";
			hoursWorkedText.style.display = "none";
			document.querySelector(".admin-table").classList.remove("hide");

			const data = await helper.postReq(
				"/admin/get-employees-timeclock-history",
				{
					fromDate: fromDateFilter.value,
					toDate: toDateFilter.value,
				}
			);
			// Display each employees time clock history for selected period
			for (let i = 0; i < data.employeesClockHistory.length; i++) {
				const newRow = adminTableBodyRef.insertRow();
				newRow.classList.add("table-row");
				helper.addCellToRow(newRow, data.employeesClockHistory[i][0]);
				helper.addCellToRow(
					newRow,
					data.employeesClockHistory[i][1].toFixed(3)
				);
			}
		}
	},
	{ passive: true }
);

////////////////////////////////
/* ACCOUNT SETTINGS: Payments */
////////////////////////////////
const createCategoryBtn = document.getElementById("create_category");
const removeCategoryBtn = document.getElementById("remove_category");
const categoryInput = document.getElementById("category_input");
const taxRateInput = document.getElementById("tax_rate_input");
const primaryAddress = document.getElementById("primary_address");
const city = document.getElementById("city");
const province = document.getElementById("province");
const postalCode = document.getElementById("postal_code");
const addressInputs = document.querySelectorAll(".address-input");

createCategoryBtn.addEventListener(
	"click",
	async () => {
		// Show Input with animation
		removeCategoryBtn.style.display = "none";
		categoryInput.style.display = "flex";
		createCategoryBtn.style.width = "25%";

		if (!categoryInput.value) {
			helper.showInvalidColour(categoryInput);
			return;
		}
		// send post and add category
		await helper.postReq("/admin/add-category", {
			category: categoryInput.value,
		});
		document.location.reload();
	},
	{ passive: true }
);

removeCategoryBtn.addEventListener(
	"click",
	async () => {
		// Show Input with animation
		createCategoryBtn.style.display = "none";
		categoryInput.style.display = "flex";
		removeCategoryBtn.style.width = "25%";

		if (!categoryInput.value) {
			helper.showInvalidColour(categoryInput);
			return;
		}
		// Send post and delete category
		await helper.postReq("/admin/delete-category", {
			category: categoryInput.value,
		});
		document.location.reload();
	},
	{ passive: true }
);

document.getElementById("tax_rate_btn").addEventListener(
	"click",
	async () => {
		if (!taxRateInput.value || !/^\d+$/.test(taxRateInput.value)) {
			helper.showInvalidColour(taxRateInput);
			return;
		}
		// Send post request to add new tax rate
		await helper.postReq("/admin/update-store-taxRate", {
			taxRate: taxRateInput.value,
		});
		document.location.reload();
	},
	{ passive: true }
);

document
	.getElementById("update_address_button")
	.addEventListener("click", async () => {
		for (const input of addressInputs) {
			if (!input.value) {
				helper.showInvalidColour(input);
				return;
			}
		}

		// Send post request to update store address
		await helper.postReq("/admin/update-store-address", {
			primary: primaryAddress.value,
			city: city.value,
			province: province.value,
			postalCode: postalCode.value,
		});
		document.location.reload();
	});

////////////////////////////////
/* ACCOUNT SETTINGS: Tickets */
////////////////////////////////
const ticketStatuses = document.querySelectorAll(".status");
const statusNameInput = document.getElementById("status_name_input");
const statusColorInput = document.getElementById("status_color_input");
const colorPreview = document.getElementById("color_preview");
const addOrUpdateStatusBtn = document.getElementById(
	"update_ticket_status_settings"
);
const deleteTicketStatusBtn = document.getElementById(
	"delete_ticket_status_settings"
);
const colorCopy = document.querySelectorAll(".color-copy");
const createIssueBtn = document.getElementById("create_issue");
const deleteIssueBtn = document.getElementById("remove_issue");
const issueInput = document.getElementById("issue_input");

// Change color of colorPreview when input is changed
statusColorInput.addEventListener(
	"input",
	(e) => {
		colorPreview.style.backgroundColor = e.target.value;
	},
	{ passive: true }
);

// For any status, input name and color into inputs if clicked
for (const status of ticketStatuses) {
	const statusColor = JSON.parse(status.lastElementChild.value);
	const colorCircle = status.firstElementChild.nextElementSibling;
	colorCircle.style.backgroundColor = `#${statusColor}`;

	status.addEventListener(
		"click",
		() => {
			statusNameInput.value = status.firstElementChild.textContent.trim();
			statusColorInput.value = "#" + statusColor;
			colorPreview.style.backgroundColor = "#" + statusColor;
		},
		{ passive: true }
	);
}

addOrUpdateStatusBtn.addEventListener("click", async () => {
	if (!statusNameInput.value) {
		helper.showInvalidColour(statusNameInput);
		return;
	} else if (
		statusColorInput.value.length < 2 ||
		!statusColorInput.value.startsWith("#")
	) {
		helper.showInvalidColour(statusColorInput);
		return;
	}
	for (const status of ticketStatuses) {
		// If a status already exists
		if (
			status.firstElementChild.textContent.toUpperCase().trim() ===
			statusNameInput.value.toUpperCase()
		) {
			helper.showInvalidColour(statusNameInput);
			return;
		}
	}

	// Send post request to add a ticket status
	await helper.postReq("/admin/update-ticket-status-settings", {
		statusName: statusNameInput.value.trim(),
		statusColor: statusColorInput.value.trim().substring(1),
	});
	document.location.reload();
});

deleteTicketStatusBtn.addEventListener(
	"click",
	async () => {
		if (!statusNameInput.value) {
			helper.showInvalidColour(statusNameInput);
			return;
		}
		const defaultStatusNames = ["new", "reply", "resolved", "priority"]; // Default statuses
		let statusNames = []; // Contains existing statuses
		[...ticketStatuses].forEach((item) => {
			statusNames.push(item.textContent.trim().toUpperCase());
		});

		// If status that is being deleted doesnt exist, or if its a default status
		if (
			!statusNames.includes(statusNameInput.value.toUpperCase()) ||
			defaultStatusNames.includes(statusNameInput.value.toLowerCase())
		) {
			helper.showInvalidColour(statusNameInput);
			return;
		}

		// Send post request to delete a ticket status
		await helper.postReq("/admin/delete-ticket-status-settings", {
			statusName: statusNameInput.value.trim(),
			statusColor: statusColorInput.value.trim().substring(1),
		});
		document.location.reload();
	},
	{ passive: true }
);

// If a color in palette is pressed, copy to clipboard
for (const color of colorCopy) {
	const colorRGB = window
		.getComputedStyle(color)
		.getPropertyValue("background-color");
	color.addEventListener(
		"click",
		async () => {
			await navigator.clipboard.writeText(rgb2hex(colorRGB));
		},
		{ passive: true }
	);
}

createIssueBtn.addEventListener(
	"click",
	async () => {
		// Show input with animation
		deleteIssueBtn.style.display = "none";
		issueInput.style.display = "flex";
		createIssueBtn.style.width = "25%";

		if (!issueInput.value) {
			helper.showInvalidColour(issueInput);
			return;
		}
		// Send post request to add issue to settings
		await helper.postReq("/admin/add-issue", {
			issue: issueInput.value.trim().toLowerCase(),
		});
		document.location.reload();
	},
	{ passive: true }
);

deleteIssueBtn.addEventListener(
	"click",
	async () => {
		// Show input with animation
		createIssueBtn.style.display = "none";
		issueInput.style.display = "flex";
		deleteIssueBtn.style.width = "25%";

		if (issueInput.value == "") {
			helper.showInvalidColour(issueInput);
			return;
		}

		// Send post request to delete issue from settings
		await helper.postReq("/admin/delete-issue", {
			issue: issueInput.value.trim().toLowerCase(),
		});

		document.location.reload();
	},
	{ passive: true }
);

////////////////////////////////
/* ACCOUNT SETTINGS: Tickets */
////////////////////////////////
const inviteEmployeeInput = document.getElementById("invite_employee_input");
const inviteEmployeeBtn = document.getElementById("invite_employee_btn");
const removeEmployeeInput = document.getElementById("remove_employee_input");
const removeEmployeeBtn = document.getElementById("remove_employee_btn");
const employeePermissionInput = document.getElementById(
	"employee_permission_input"
);
const toggleEmployeePermissionBtn = document.getElementById(
	"toggle_employee_permission_btn"
);

inviteEmployeeBtn.addEventListener("click", async () => {
	if (
		!inviteEmployeeInput.value ||
		!helper.isValidEmail(inviteEmployeeInput.value)
	) {
		helper.showInvalidColour(inviteEmployeeInput);
		return;
	}

	const data = await helper.postReq("/admin/invite-employee", {
		email: inviteEmployeeInput.value.toLowerCase(),
		signUpCode: document.getElementById("store_signUpCode").value,
	});

	if (Object.keys(data).length) {
		helper.showInvalidColour(inviteEmployeeInput);
		return;
	}
	helper.showValidColour(inviteEmployeeBtn);
});

removeEmployeeBtn.addEventListener("click", async () => {
	if (
		!removeEmployeeInput.value ||
		!helper.isValidEmail(removeEmployeeInput.value)
	) {
		helper.showInvalidColour(removeEmployeeInput);
		return;
	}

	const data = await helper.postReq("/admin/delete-employee", {
		email: removeEmployeeInput.value.toLowerCase(),
	});

	if (Object.keys(data).length) {
		helper.showInvalidColour(removeEmployeeInput);
		return;
	}
	helper.showValidColour(removeEmployeeInput);
});

toggleEmployeePermissionBtn.addEventListener("click", async () => {
	if (
		!employeePermissionInput.value ||
		!helper.isValidEmail(employeePermissionInput.value)
	) {
		helper.showInvalidColour(employeePermissionInput);
		return;
	}

	const data = await helper.postReq("/admin/toggle-admin-permissions", {
		email: employeePermissionInput.value.toLowerCase(),
	});

	if (Object.keys(data).length) {
		helper.showInvalidColour(employeePermissionInput);
		return;
	}
	helper.showValidColour(toggleEmployeePermissionBtn);
});

////////////////////////////////
/* ACCOUNT SETTINGS: Delete Data */
////////////////////////////////
const deleteStoreDataBtns = document.querySelectorAll(".delete-store-data");
const confirmRemovalBtns = document.querySelectorAll(".confirm-removal");

for (const btn of deleteStoreDataBtns) {
	btn.addEventListener(
		"click",
		() => {
			if (btn.parentElement.previousElementSibling.value < 2) {
				helper.showInvalidColour(
					btn.parentElement.previousElementSibling
				);
				return;
			}

			// Show input
			btn.style.width = "30%";
			btn.nextElementSibling.style.display = "flex";
		},
		{ passive: true }
	);
}

for (const btn of confirmRemovalBtns) {
	btn.addEventListener(
		"click",
		async () => {
			if (btn.parentElement.previousElementSibling.value < 2) {
				helper.showInvalidColour(
					btn.parentElement.previousElementSibling
				);
				return;
			}

			const url = btn.textContent.trim().split(" ")[1].toLowerCase();
			const deletionItem =
				btn.parentElement.previousElementSibling.value.replace(
					/[^0-9]/g,
					""
				);

			if (!deletionItem) {
				helper.showInvalidColour(
					btn.parentElement.previousElementSibling
				);
				return;
			}

			// Send post request to delete data
			const data = await helper.postReq(`/admin/delete-${url}`, {
				item: deletionItem,
			});

			if (Object.keys(data).length) {
				helper.showInvalidColour(
					btn.parentElement.previousElementSibling
				);
				btn.parentElement.previousElementSibling.value = data.error;
				return;
			}

			helper.showValidColour(btn.parentElement.previousElementSibling);
			btn.parentElement.previousElementSibling.value = "";
			btn.previousElementSibling.style.width = "100%";
			btn.style.display = "none";
		},
		{ passive: true }
	);
}
