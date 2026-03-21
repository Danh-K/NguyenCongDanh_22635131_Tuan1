const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.UI_PORT || 3000;
const BACKEND_BASE = process.env.BACKEND_BASE || "http://localhost:8081";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.all("/api/*", async (req, res) => {
  const targetUrl = `${BACKEND_BASE}${req.originalUrl}`;

  try {
    const headers = {
      "Content-Type": "application/json"
    };

    const options = {
      method: req.method,
      headers
    };

    if (!["GET", "HEAD"].includes(req.method)) {
      options.body = JSON.stringify(req.body || {});
    }

    const response = await fetch(targetUrl, options);
    const text = await response.text();

    res.status(response.status);

    if (text.length === 0) {
      return res.end();
    }

    const responseType = response.headers.get("content-type") || "";
    if (responseType.includes("application/json")) {
      return res.type("application/json").send(text);
    }

    return res.send(text);
  } catch (error) {
    return res.status(502).json({
      error: "BAD_GATEWAY",
      message: `Cannot reach backend at ${BACKEND_BASE}`,
      detail: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Node UI running at http://localhost:${PORT}`);
  console.log(`Proxy target: ${BACKEND_BASE}`);
});
