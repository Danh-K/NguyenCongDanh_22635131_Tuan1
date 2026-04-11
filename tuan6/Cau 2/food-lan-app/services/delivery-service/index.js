const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8085);

const deliveries = new Map();

app.get("/health", (req, res) => {
  res.json({ service: "delivery-service", status: "ok" });
});

app.post("/deliveries/create", (req, res) => {
  const { orderId, address } = req.body;

  if (!orderId || !address) {
    return res.status(400).json({ error: "orderId and address are required" });
  }

  const delivery = {
    deliveryId: uuidv4(),
    orderId,
    address,
    rider: "Rider A",
    status: "DELIVERING",
    createdAt: new Date().toISOString()
  };

  deliveries.set(orderId, delivery);
  res.status(201).json(delivery);
});

app.patch("/deliveries/:orderId/complete", (req, res) => {
  const delivery = deliveries.get(req.params.orderId);
  if (!delivery) {
    return res.status(404).json({ error: "Delivery not found" });
  }

  delivery.status = "DELIVERED";
  delivery.deliveredAt = new Date().toISOString();
  deliveries.set(delivery.orderId, delivery);

  res.json(delivery);
});

app.get("/deliveries/:orderId", (req, res) => {
  const delivery = deliveries.get(req.params.orderId);
  if (!delivery) {
    return res.status(404).json({ error: "Delivery not found" });
  }

  res.json(delivery);
});

app.listen(PORT, HOST, () => {
  console.log(`delivery-service running on http://${HOST}:${PORT}`);
});
