"use strict";

import { Loader } from "https://unpkg.com/@googlemaps/js-api-loader@1.0.0/dist/index.esm.js";
import * as helper from "./helper/helper.js";

const greeting = document.getElementById("greeting");
const trackingCover = document.getElementById("tracking_cover");

let greet = new Date();

if (greet.getHours() >= 0 && greet.getHours() < 12) {
	greeting.insertAdjacentHTML("afterbegin", `Good morning, `);
} else if (greet.getHours() >= 12 && greet.getHours() <= 17) {
	greeting.insertAdjacentHTML("afterbegin", `Good afternoon, `);
} else if (greet.getHours() >= 17 && greet.getHours() < 24) {
	greeting.insertAdjacentHTML("afterbegin", `Good evening, `);
}

trackingCover.addEventListener("click", () => {
	trackingCover.style.display = "none";
	let map;
	const loader = new Loader({
		apiKey: "AIzaSyAhyEiRQ5Xs5UijEum0VdIGWx3nI-NeH_0",
		version: "weekly",
	});
	loader.load().then(() => {
		map = new google.maps.Map(document.getElementById("map"), {
			center: { lat: -34.397, lng: 150.644 },
			zoom: 10,
			mapId: "d2b1b19d316aa6a9",
			disableDefaultUI: true,
		});
	});
});

const ticketIDs = document.querySelectorAll(".ticket_link");
const customers = document.querySelectorAll(".customer_link");
const subjects = document.querySelectorAll(".subject_link");

for (const ID of ticketIDs) {
	ID.href += ID.textContent;
}

for (const subject of subjects) {
	const id =
		subject.parentElement.parentElement.firstElementChild.firstElementChild
			.textContent;

	subject.href += id;
}

for (const customer of customers) {
	const id =
		customer.parentElement.parentElement.firstElementChild.firstElementChild
			.textContent;
	(async () => {
		const response = await fetch("/get-phone", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id }),
		});
		const data = await response.json();
		customer.href += data.phone;
	})();
}

const ticketIDInput = document.getElementById("ticket_ID_input");
const trackBtn = document.getElementById("track_btn");

const showTrackingDetails = (trackingObj) => {
	const { eta, from, status, to } = trackingObj;

	if (status == "DELIVERED") {
		document
			.querySelector(".search-wrap")
			.appendChild(document.createTextNode("Delivered!"));
	}
};

trackBtn.addEventListener("click", () => {
	if (ticketIDInput.value.length < 4 || !/^\d+$/.test(ticketIDInput.value)) {
		helper.showInvalidColour(ticketIDInput);
		return;
	}

	(async () => {
		const data = await helper.postReq("/track-shipment", {
			ticketID: ticketIDInput.value,
		});
		if (data.result.hasOwnProperty("tracking_error")) {
			helper.showInvalidColour(ticketIDInput);
			return;
		}
		//Loading animation//?

		showTrackingDetails(data.result);
	})();
});
