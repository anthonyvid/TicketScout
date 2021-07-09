const express = require("express");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const expressLayouts = require("express-ejs-layouts");
var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");

const app = express();

console.log("in app.js");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

//where views are coming from
app.set("views", "views");
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(expressLayouts);

app.use(userRouter);
app.use(adminRouter);

module.exports = app;
