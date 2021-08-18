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

const showEmployeeTotals = (data) => {
	console.log(data);

	const adminTBodyRed = document.getElementById("adminTBodyRed");

	for (let i = 0; i < data.length; i++) {
		const newRow = adminTBodyRed.insertRow();
		newRow.classList.add("table-row");
		const td1 = newRow.insertCell();
		let tdContent = document.createTextNode(data[i][0]);
		td1.appendChild(tdContent);

		const td2 = newRow.insertCell();
		let hoursWorked = 0;

		data[i][1].forEach((item) => {
			hoursWorked += item.hoursWorked;
		});

		tdContent = document.createTextNode(hoursWorked.toFixed(5));
		td2.appendChild(tdContent);

		const td3 = newRow.insertCell();
		tdContent = document.createTextNode(
			document
				.getElementById("pay-period")
				.textContent.trim()
				.split(" ")[2]
		);
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
		document.getElementById("table").style.display = "none";
		hoursWorkedText.style.display = "none";
		document.querySelector(".admin-table").classList.remove("hide");
		(async () => {
			try {
				const response = await fetch(
					"/get-employees-timeclock-history"
				);
				const data = await response.json();
				document.getElementById("pay-period").textContent =
					"Pay period: " + data.payPeriod;
				showEmployeeTotals(data.employeesClockHistory);
			} catch (error) {
				console.log(error);
			}
		})();
	}
});
