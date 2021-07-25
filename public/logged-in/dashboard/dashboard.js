const greeting = document.getElementById("greeting");

let today = new Date();
if (today.getHours() >= 0 && today.getHours() < 12) {
	greeting.insertAdjacentHTML("afterbegin", `Good morning, `);
} else if (today.getHours() >= 12 && today.getHours() <= 17) {
	greeting.insertAdjacentHTML("afterbegin", `Good afternoon, `);
} else if (today.getHours() >= 17 && today.getHours() < 24) {
	greeting.insertAdjacentHTML("afterbegin", `Good evening, `);
}
