const express = require("express");
const path = require("path");

const app = express();

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8081);

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://192.168.1.11:8082";
const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL || "http://192.168.1.12:8083";
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || "http://192.168.1.13:8084";
const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL || "http://192.168.1.14:8085";

app.use(express.static(path.join(__dirname, "public")));

app.get("/config.js", (req, res) => {
  res.type("application/javascript");
  res.send(`window.APP_CONFIG = ${JSON.stringify({
    ORDER_SERVICE_URL,
    RESTAURANT_SERVICE_URL,
    PAYMENT_SERVICE_URL,
    DELIVERY_SERVICE_URL
  })};`);
});

app.listen(PORT, HOST, () => {
  console.log(`frontend running on http://${HOST}:${PORT}`);
});
