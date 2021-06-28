const express = require("express");
const app = express();
const router = require("./router");
const dbConnect = require("./mongoDb");

console.log("in app.js");

// app.use(sessionOptions);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

//where views are coming from
app.set("views", "views");
app.set("view engine", "ejs");

app.use("/", router);

module.exports = app;
