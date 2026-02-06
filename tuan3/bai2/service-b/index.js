const express = require("express");
const app = express();
const PORT = 3001;

// 1. API luôn thành công
app.get("/api/success", (req, res) => {
  res.status(200).json({ message: "Hello from Service B - Success" });
});

// 2. API mô phỏng lỗi (luôn trả 500) - Test Circuit Breaker
app.get("/api/error", (req, res) => {
  console.log("Received request to /error");
  res.status(500).json({ message: "Internal Server Error from Service B" });
});

// 3. API chập chờn (ngẫu nhiên lỗi) - Test Retry
app.get("/api/flaky", (req, res) => {
  const random = Math.random();
  console.log("Received request to /flaky, random:", random);
  if (random < 0.5) {
    res.status(500).json({ message: "Flaky Error" });
  } else {
    res.status(200).json({ message: "Flaky Success" });
  }
});

// 4. API chậm (Delay 3s) - Test Timeout / Bulkhead
app.get("/api/slow", (req, res) => {
  console.log("Received request to /slow");
  setTimeout(() => {
    res.status(200).json({ message: "Service B response after delay" });
  }, 3000);
});

app.listen(PORT, () => {
  console.log(`Service B is running on port ${PORT}`);
});
