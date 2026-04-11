const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8084);

const payments = new Map();

app.get("/health", (req, res) => {
  res.json({ service: "payment-service", status: "ok" });
});

app.post("/payments/charge", (req, res) => {
  const { orderId, amount, method } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "orderId is required" });
  }

  const payment = {
    transactionId: uuidv4(),
    orderId,
    amount: Number(amount || 0),
    method: method || "cash",
    status: "PAID",
    paidAt: new Date().toISOString()
  };

  payments.set(orderId, payment);
  res.status(201).json(payment);
});

app.get("/payments/:orderId", (req, res) => {
  const payment = payments.get(req.params.orderId);
  if (!payment) {
    return res.status(404).json({ error: "Payment not found" });
  }

  res.json(payment);
});

app.listen(PORT, HOST, () => {
  console.log(`payment-service running on http://${HOST}:${PORT}`);
});
