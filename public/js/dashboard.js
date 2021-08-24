"use strict";

import { Loader } from "https://unpkg.com/@googlemaps/js-api-loader@1.0.0/dist/index.esm.js";
import * as helper from "./helper/helper.js";

const loader = new Loader({
	apiKey: "AIzaSyAhyEiRQ5Xs5UijEum0VdIGWx3nI-NeH_0",
	version: "weekly",
});

const greeting = document.getElementById("greeting");
const trackingCover = document.getElementById("tracking_cover");
const ticketIDInput = document.getElementById("ticket_ID_input");
const trackBtn = document.getElementById("track_btn");
let greet = new Date();

if (greet.getHours() >= 0 && greet.getHours() < 12) {
	greeting.insertAdjacentHTML("afterbegin", `Good morning, `);
} else if (greet.getHours() >= 12 && greet.getHours() <= 17) {
	greeting.insertAdjacentHTML("afterbegin", `Good afternoon, `);
} else if (greet.getHours() >= 17 && greet.getHours() < 24) {
	greeting.insertAdjacentHTML("afterbegin", `Good evening, `);
}

const defaultLat = 43.687736;
const defaultLng = -79.46496;

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
				label: {
					text: "Package Location",
					fontWeight: "bold",
					fontSize: "18px",
				},
			});
		}
	});
};

async function getLatLngByZipcode(address) {
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
}

const showTrackingDetails = async (trackingObj) => {
	const { eta, from, status, to, location } = trackingObj;

	await getLatLngByZipcode(location.zip);

	document.getElementById("status_text").textContent = status;
	document.getElementById("location_text").textContent = location.city;
	document.getElementById("eta_text").textContent = eta;
	document.getElementById("from_text").textContent = to.city;
};

ticketIDInput.addEventListener("click", () => {
	showMap(defaultLat, defaultLng);
});

trackBtn.addEventListener("click", async () => {
	if (ticketIDInput.value.length < 4 || !/^\d+$/.test(ticketIDInput.value)) {
		helper.showInvalidColour(ticketIDInput);
		return;
	}

	const data = await helper.postReq("/track-shipment", {
		ticketID: ticketIDInput.value,
	});
	if (data.result.hasOwnProperty("tracking_error")) {
		helper.showInvalidColour(ticketIDInput);
		return;
	}
	//Loading animation//?

	showTrackingDetails(data.result);
});
