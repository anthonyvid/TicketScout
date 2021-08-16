const statusSelects = document.querySelectorAll(".status-selects");
const editCustomerInfo = document.getElementById("edit-customer-info");
const cancelChangeBtn = document.getElementById("cancel-info-change");
const submitChangeBtn = document.getElementById("submit-info-change");
const lastUpdated = document.getElementById("last-update-text");

(async () => {
	try {
		const response = await fetch("/get-store");
		const data = await response.json();
		const statusArray = data.store.storeSettings.tickets.status;
		for (const select of statusSelects) {
			for (let i = 0; i < statusArray.length; i++) {
				if (select.firstElementChild.text === statusArray[i][0]) {
					select.style.color = `#${statusArray[i][1]}`;
					select.previousElementSibling.style.color = `#${statusArray[i][1]}`;
				}
			}
		}
	} catch (error) {
		console.log(error);
	}
})();

editCustomerInfo.addEventListener("click", () => {
	editCustomerInfo.classList.add("hidden");
	document.getElementById("name").classList.add("hidden");
	document.getElementById("phone").classList.add("hidden");
	document.getElementById("email").classList.add("hidden");
	document.getElementById("subject").classList.add("hidden");
	document.getElementById("description").classList.add("hidden");
	document.getElementById("edit-firstname-field").classList.remove("hidden");
	document.getElementById("edit-lastname-field").classList.remove("hidden");
	document.getElementById("edit-phone-field").classList.remove("hidden");
	document.getElementById("edit-email-field").classList.remove("hidden");
	document.getElementById("edit-subject-field").classList.remove("hidden");
	document
		.getElementById("edit-description-field")
		.classList.remove("hidden");
	cancelChangeBtn.classList.remove("hidden");
	submitChangeBtn.classList.remove("hidden");
});

cancelChangeBtn.addEventListener("click", () => {
	editCustomerInfo.classList.remove("hidden");
	document.getElementById("name").classList.remove("hidden");
	document.getElementById("phone").classList.remove("hidden");
	document.getElementById("email").classList.remove("hidden");
	document.getElementById("subject").classList.remove("hidden");
	document.getElementById("description").classList.remove("hidden");
	document.getElementById("edit-firstname-field").classList.add("hidden");
	document.getElementById("edit-lastname-field").classList.add("hidden");
	document.getElementById("edit-phone-field").classList.add("hidden");
	document.getElementById("edit-email-field").classList.add("hidden");
	document.getElementById("edit-subject-field").classList.add("hidden");
	document.getElementById("edit-description-field").classList.add("hidden");
	cancelChangeBtn.classList.add("hidden");
	submitChangeBtn.classList.add("hidden");
});

console.log(document.getElementById("ticketID").textContent.trim());

for (const select of statusSelects) {
	select.addEventListener("change", (e) => {
		const id = document
			.getElementById("ticketID")
			.textContent.trim()
			.replace("#", "");
		const selection = e.target.value;
		const phone = document
			.getElementById("phone")
			.textContent.trim()
			.replace(/\D/g, "");
		(async () => {
			try {
				const response = await fetch("/update-ticket-status", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ selection, id, phone }),
				});
				const data = await response.json();

				location.reload();
			} catch (error) {
				console.log(error);
			}
		})();
	});
}

document.querySelector(".new-payment-btn").addEventListener("click", () => {
	document.getElementById("createNewPaymentForm").submit();
});

const issueSelects = document.querySelectorAll(".issue-selects");

for (const select of issueSelects) {
	select.addEventListener("change", (e) => {
		const id = document
			.getElementById("ticketID")
			.textContent.trim()
			.replace("#", "");
		const selection = e.target.value;
		const phone = document
			.getElementById("phone")
			.textContent.trim()
			.replace(/\D/g, "");
		(async () => {
			try {
				const response = await fetch("/update-ticket-issue", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ selection, id, phone }),
				});
				const data = await response.json();
				location.reload();
			} catch (error) {
				console.log(error);
			}
		})();
	});
}

const statusOptions = document.querySelectorAll(".status-options");
const issueOptions = document.querySelectorAll(".issue-options");

for (const option of statusOptions) {
	if (option.text.trim().length == 0) {
		option.setAttribute("hidden", true);
	}
}
for (const option of issueOptions) {
	if (option.text.trim().length == 0) {
		option.setAttribute("hidden", true);
	}
}

const currentTime = new Date().getTime();
const lastUpdateTime = Number(lastUpdated.textContent.replace(/\D/g, ""));
const timeDiffInSec = (currentTime - lastUpdateTime) / 1000;
const timeDiffInDays = timeDiffInSec / 60 / 60 / 24;
const timeDiffInMonths = timeDiffInDays * 30.417;

if (timeDiffInSec < 60) {
	lastUpdated.textContent = "Last updated: a minute ago";
} else if (timeDiffInSec > 59 && timeDiffInSec < 3600) {
	lastUpdated.textContent = `Last updated: ${Math.round(
		timeDiffInSec / 60
	)} minutes ago`;
} else if (timeDiffInSec > 3600 && timeDiffInSec < 7200) {
	lastUpdated.textContent = `Last updated: 1 hour ago`;
} else if (timeDiffInSec > 3600 && timeDiffInSec < 86400) {
	lastUpdated.textContent = `Last updated: ${Math.round(
		timeDiffInSec / 3600
	)} hours ago`;
} else if (timeDiffInSec > 86400 && timeDiffInSec < 172800) {
	lastUpdated.textContent = `Last updated: 1 day ago`;
} else if (timeDiffInSec > 172800 && timeDiffInDays < 30) {
	lastUpdated.textContent = `Last updated: ${Math.round(
		timeDiffInDays
	)} days ago`;
} else if (timeDiffInDays > 30 && timeDiffInDays < 60) {
	lastUpdated.textContent = `Last updated: 1 month ago`;
} else if (timeDiffInMonths > 1 && timeDiffInDays < 12) {
	lastUpdated.textContent = `Last updated: ${Math.round(
		timeDiffInMonths
	)} months ago`;
}

const submitForms = () => {
	const description = document.getElementById("edit-description-field").value;
	const subject = document.getElementById("edit-subject-field").value;
	const ticketID = document
		.getElementById("ticketID")
		.textContent.trim()
		.replace("#", "");
	const phone = document
		.getElementById("phone")
		.textContent.trim()
		.replace(/\D/g, "");
	(async () => {
		try {
			const response = await fetch("/update-ticket-info", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ subject, description, ticketID, phone }),
			});
			const data = await response.json();
		} catch (error) {
			console.log(error);
		}
	})();

	document.getElementById("editCustomerInfoForm").submit();
};

const documentBtn = document.querySelector(".documentBtn");

documentBtn.addEventListener("click", () => {
	printCustomerLabel();
});

function printCustomerLabel() {
	//need to figure out how im gonna make it print labels
	console.log("PRINT LABEL");
}

const linkedPayments = document.querySelectorAll(".linkedPayment");

for (const payment of linkedPayments) {
	const paymentID = payment.textContent.trim();
	payment.href += paymentID;
}

const displayTrackingDetailsForm = () => {
	document.getElementById("add-tracking-info").style.display = "none";
	document.querySelector(".tracking-field").style.display = "flex";
	document.getElementById("shipping-details").style.display = "none";
};

const confirmTrackingDetails = () => {
	if (document.getElementById("tracking-number").value == "") {
		document.getElementById("tracking-number").style.backgroundColor =
			"#FFCCCC";
		setTimeout(() => {
			document.getElementById("tracking-number").style.backgroundColor =
				"#fff";
		}, 500);
		return;
	} else if (
		Array.from(
			document.getElementById("carrier-select").selectedOptions,
			({ textContent }) => textContent
		)[0].trim() === "Select a carrier"
	) {
		document.getElementById("carrier-select").style.backgroundColor =
			"#FFCCCC";
		setTimeout(() => {
			document.getElementById("carrier-select").style.backgroundColor =
				"#fff";
		}, 500);
		return;
	}

	const trackingNumber = document.getElementById("tracking-number").value;

	const carrier = Array.from(
		document.getElementById("carrier-select").selectedOptions,
		({ textContent }) => textContent
	)[0].trim();

	const ticketID = document
		.getElementById("ticketID")
		.textContent.trim()
		.replace("#", "");

	const phone = document
		.getElementById("phone")
		.textContent.trim()
		.replace(/\D/g, "");

	(async () => {
		try {
			const response = await fetch("/update-ticket-shipping-info", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					trackingNumber,
					carrier,
					ticketID,
					phone,
				}),
			});
			const data = await response.json();
		} catch (error) {
			console.log(error);
		}
	})();
	location.reload();
};

const chatBoxTextarea = document.getElementById("chat-msg");
const sendMsg = document.getElementById("send-msg");

sendMsg.addEventListener("click", () => {
	if (chatBoxTextarea.value == "") {
		chatBoxTextarea.style.backgroundColor = "#FFCCCC";
		setTimeout(() => {
			chatBoxTextarea.style.backgroundColor = "#fff";
		}, 500);
		return;
	}

	console.log("yaa");

	const message = chatBoxTextarea.value.trim();
	const toPhone = document
		.getElementById("phone")
		.textContent.trim()
		.replace(/\D/g, "");

	(async () => {
		try {
			const response = await fetch("/send-sms", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message,
					toPhone,
				}),
			});
			const data = await response.json();
			const messageBox = document.createElement("div");
			messageBox.classList.add("message");
			const messageText = document.createTextNode(data.msg);
			messageBox.appendChild(messageText);
			document.querySelector(".chat-body").appendChild(messageBox);
			chatBoxTextarea.value = "";
		} catch (error) {
			console.log(error);
		}
	})();
});
