const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8083);

const menu = [
  { id: "m1", name: "Com ga", price: 45000 },
  { id: "m2", name: "Pho bo", price: 50000 },
  { id: "m3", name: "Banh mi", price: 25000 },
  { id: "m4", name: "Tra dao", price: 20000 }
];

const kitchen = new Map();

app.get("/health", (req, res) => {
  res.json({ service: "restaurant-service", status: "ok" });
});

app.get("/menu", (req, res) => {
  res.json(menu);
});

app.post("/kitchen/prepare", (req, res) => {
  const { orderId, items } = req.body;

  if (!orderId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "orderId and items are required" });
  }

  const prep = {
    prepId: uuidv4(),
    orderId,
    items,
    status: "READY",
    preparedAt: new Date().toISOString()
  };

  kitchen.set(orderId, prep);
  res.status(201).json(prep);
});

app.get("/kitchen/:orderId", (req, res) => {
  const prep = kitchen.get(req.params.orderId);
  if (!prep) {
    return res.status(404).json({ error: "Kitchen ticket not found" });
  }

  res.json(prep);
});

app.listen(PORT, HOST, () => {
  console.log(`restaurant-service running on http://${HOST}:${PORT}`);
});
