const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { subscribeToEvent } = require("./event-bus");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8085);

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

let notifications = [];

// Subscribe to Payment Events
subscribeToEvent("PAYMENT_COMPLETED", (data) => {
  const message = `Booking #${data.bookingId} thành công! User ${data.userName} đã đặt đơn #${data.bookingId} thành công`;
  const notification = {
    id: notifications.length ? notifications[notifications.length - 1].id + 1 : 1,
    bookingId: data.bookingId,
    userName: data.userName,
    message,
    status: "SUCCESS",
    createdAt: new Date().toISOString(),
  };
  notifications.push(notification);
  console.log(`[Notification] ${message}`);
});

subscribeToEvent("BOOKING_FAILED", (data) => {
  const message = `Booking #${data.bookingId} thất bại! Lý do: ${data.reason}`;
  const notification = {
    id: notifications.length ? notifications[notifications.length - 1].id + 1 : 1,
    bookingId: data.bookingId,
    userId: data.userId,
    message,
    status: "FAILED",
    createdAt: new Date().toISOString(),
  };
  notifications.push(notification);
  console.log(`[Notification] ${message}`);
});

app.get("/health", (_, res) => {
  res.json({ service: "notification-service", status: "ok" });
});

app.get("/notifications", (_, res) => {
  res.json(notifications);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`notification-service listening on ${port}`);
});
