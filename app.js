const express = require("express");
const router = require("./router");
const dbConnect = require("./mongoDb");
const expressLayouts = require("express-ejs-layouts");

const app = express();

console.log("in app.js");

// app.use(sessionOptions);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

//where views are coming from
app.set("views", "views");
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(expressLayouts);

app.use("/", router);

module.exports = app;
