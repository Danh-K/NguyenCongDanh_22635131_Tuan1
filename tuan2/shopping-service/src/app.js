require("dotenv").config();
require("./config/db");

const express = require("express");
const app = express();

app.use(express.json());
app.use("/orders", require("./routes/order.routes"));

module.exports = app;
