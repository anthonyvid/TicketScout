const greeting = document.getElementById("greeting");

let greet = new Date();
console.log("test");

if (greet.getHours() >= 0 && greet.getHours() < 12) {
	greeting.insertAdjacentHTML("afterbegin", `Good morning, `);
} else if (greet.getHours() >= 12 && greet.getHours() <= 17) {
	greeting.insertAdjacentHTML("afterbegin", `Good afternoon, `);
} else if (greet.getHours() >= 17 && greet.getHours() < 24) {
	greeting.insertAdjacentHTML("afterbegin", `Good evening, `);
}
