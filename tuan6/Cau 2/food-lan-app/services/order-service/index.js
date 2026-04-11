const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8082);

const orders = new Map();

app.get("/health", (req, res) => {
  res.json({ service: "order-service", status: "ok" });
});

app.post("/orders", (req, res) => {
  const { customerName, items, total, address } = req.body;

  if (!customerName || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "customerName and items are required" });
  }

  const id = uuidv4();
  const order = {
    id,
    customerName,
    items,
    address: address || "",
    total: Number(total || 0),
    status: "CREATED",
    createdAt: new Date().toISOString()
  };

  orders.set(id, order);
  res.status(201).json(order);
});

app.get("/orders/:id", (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json(order);
});

app.patch("/orders/:id/status", (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: "status is required" });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  orders.set(order.id, order);

  res.json(order);
});

app.listen(PORT, HOST, () => {
  console.log(`order-service running on http://${HOST}:${PORT}`);
});
