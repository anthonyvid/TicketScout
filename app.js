const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();

console.log("in app.js");

app.use(express.json());
app.use(express.static("public"));

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//EJS
app.use(expressLayouts);
// app.set("views", "views");
app.set("view engine", "ejs");
// app.set("layout", "layouts/logged-out-layout");

//Routes
app.use("/", require("./routes/userRouter"));
app.use("/admin", require("./routes/adminRouter"));

module.exports = app;
