"use strict";

import { Loader } from "https://unpkg.com/@googlemaps/js-api-loader@1.0.0/dist/index.esm.js";
import * as helper from "./helper/helper.js";

const loader = new Loader({
	apiKey: "AIzaSyAhyEiRQ5Xs5UijEum0VdIGWx3nI-NeH_0",
	version: "weekly",
});

var pusher = new Pusher("e28b6821911a7e16e187", {
	cluster: "us2",
});

const defaultLat = 43.687736;
const defaultLng = -79.46496;
const tableRows = document.querySelectorAll("#table_row");
const tbody = document.getElementById("tbody");
const greeting = document.getElementById("greeting");
const ticketIDInput = document.getElementById("ticket_ID_input");
const trackBtn = document.getElementById("track_btn");
let greet = new Date();

/**
 * Adds a row to items in order table with given data
 * @param {Object} item row data
 */
const addRecentTicketTrio = (trioArray) => {
	for (let i = 0; i < trioArray.length; i++) {
		let newRow = tbody.insertRow();
		const fullname = `${trioArray[i][1].customer.firstname} ${trioArray[i][1].customer.lastname}`;
		helper.addCellToRow(newRow, trioArray[i][0]);
		helper.addCellToRow(newRow, fullname);
		helper.addCellToRow(newRow, trioArray[i][1].description);
		helper.addCellToRow(newRow, trioArray[i][1].status);
	}
};

/**
 * Will hide all tickets with status as "Resolved"
 */
const clearResolvedTickets = () => {
	let rows = 0;
	for (const row of tableRows) {
		const status =
			row.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.textContent.trim();
		if (status == "Resolved") {
			row.remove();
			continue;
		} else {
			rows++;
		}
		if (rows > 3) row.remove();
	}
};
clearResolvedTickets(); // Run asap

/**
 * Loads in google api map
 * @param {int} lat
 * @param {int} lng
 */
const showMap = (lat, lng) => {
	let map;

	loader.load().then(() => {
		map = new google.maps.Map(document.getElementById("map"), {
			center: { lat: lat, lng: lng },
			zoom: 10,
			mapId: "d2b1b19d316aa6a9",
			disableDefaultUI: true,
		});
		if (lat != defaultLat && lng != defaultLng) {
			var marker = new google.maps.Marker({
				map: map,
				position: new google.maps.LatLng(lat, lng),
			});
		}
	});
};

/**
 * Shows the tracking anmation after btn pressed
 * @returns Promise
 */
const trackingLoadingAnimation = async () => {
	document.querySelector(".tracking-info").classList.add("hidden");
	document.querySelector(".map-animation").classList.remove("hidden");
	document.querySelector(".lottie-animation").classList.remove("hidden");
	return new Promise((resolve) =>
		setTimeout(() => {
			document.querySelector(".map-animation").classList.add("hidden");
			resolve();
		}, 3000)
	);
};

/**
 * Will call showMap with lat,lng from given address
 * @param {string} address
 */
const getLatLngByZipcode = async (address) => {
	let geocoder = new google.maps.Geocoder();

	await geocoder.geocode({ address: address }, (results, status) => {
		if (status == google.maps.GeocoderStatus.OK) {
			showMap(
				results[0].geometry.location.lat(),
				results[0].geometry.location.lng()
			);
		} else {
			console.log("Error: " + status);
		}
	});
};

/**
 * Displays tracking details if/when found
 * @param {object} trackingObj
 */
const showTrackingDetails = async (trackingObj) => {
	document.querySelector(".map-animation").classList.add("hidden");
	document.querySelector(".lottie-animation").classList.add("hidden");
	document.querySelector(".tracking-info").classList.remove("hidden");

	const { eta, from, status, to, location } = trackingObj;

	const zip = typeof location.zip != "undefined" ? location.zip : "";
	const city = typeof location.city != "undefined" ? location.city : "";
	const country =
		typeof location.country != "undefined" ? location.country : "";

	await getLatLngByZipcode(`${city} ${zip} ${country}`);

	document.getElementById("status_text").textContent =
		status !== null ? status : "Unavailable";
	document.getElementById("location_text").textContent =
		location !== null ? location.city : "Unavailable";
	document.getElementById("eta_text").textContent =
		eta !== null ? new Date(eta).toLocaleDateString() : "Unavailable";
	document.getElementById("from_text").textContent =
		from !== null ? from.city : "Unavailable";
};

var channel = pusher.subscribe("ticket-channel");
channel.bind("dashboard-table-update", (data) => {
	console.log("YAaaaaasasasasasasasasasa");
	let recentTickets = data.recentTickets;

	recentTickets = recentTickets.filter(
		(ticket) => ticket[1].status != "Resolved"
	);

	const recentTicketTrio = recentTickets.slice(0, 3);

	tbody.lastElementChild.remove();
	tbody.lastElementChild.remove();
	tbody.lastElementChild.remove();

	addRecentTicketTrio(recentTicketTrio);
	const firstTableItem = tbody.firstElementChild;
	helper.showUpdatedRow(firstTableItem, firstTableItem.style.backgroundColor);
});

if (greet.getHours() >= 0 && greet.getHours() < 12) {
	greeting.insertAdjacentHTML("afterbegin", `Good morning, `);
} else if (greet.getHours() >= 12 && greet.getHours() <= 17) {
	greeting.insertAdjacentHTML("afterbegin", `Good afternoon, `);
} else if (greet.getHours() >= 17 && greet.getHours() < 24) {
	greeting.insertAdjacentHTML("afterbegin", `Good evening, `);
}

ticketIDInput.addEventListener(
	"click",
	() => {
		showMap(defaultLat, defaultLng);
	},
	{ once: true }
);

trackBtn.addEventListener("click", async () => {
	if (ticketIDInput.value.length < 4 || !/^\d+$/.test(ticketIDInput.value)) {
		helper.showInvalidColour(ticketIDInput);
		return;
	}

	const data = await helper.postReq("/tickets/track-shipment", {
		ticketID: ticketIDInput.value,
	});
	if (data.result.hasOwnProperty("tracking_error")) {
		helper.showInvalidColour(ticketIDInput);
		return;
	}

	// Show loading animation
	await trackingLoadingAnimation();
	// Display tracking details
	await showTrackingDetails(data.result);
});
