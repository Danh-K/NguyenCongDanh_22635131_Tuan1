const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { publishEvent, subscribeToEvent } = require("./event-bus");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8084);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes("*")
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin blocked"));
    },
  })
);
app.use(express.json());

let payments = [];

// Listen for BOOKING_CREATED
subscribeToEvent("BOOKING_CREATED", async (data) => {
  console.log("[Event] Received BOOKING_CREATED", data);
  const { bookingId, userId, userName, total } = data;

  // Simulate payment processing delay
  console.log(`Processing payment for Booking #${bookingId}...`);
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Random success/fail (80% success)
  const success = Math.random() > 0.2;

  if (success) {
    const payment = {
      id: payments.length ? payments[payments.length - 1].id + 1 : 1,
      bookingId,
      userId,
      amount: total,
      status: "SUCCESS",
      timestamp: new Date().toISOString()
    };
    payments.push(payment);

    await publishEvent("PAYMENT_COMPLETED", {
      bookingId,
      userId,
      userName,
      amount: total,
      timestamp: new Date().toISOString()
    });
  } else {
    await publishEvent("BOOKING_FAILED", {
      bookingId,
      userId,
      reason: "Payment failed",
      timestamp: new Date().toISOString()
    });
  }
});

app.get("/health", (_, res) => {
  res.json({ service: "payment-service", status: "ok" });
});

app.get("/payments", (_, res) => {
  res.json(payments);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`payment-service listening on ${port}`);
});
