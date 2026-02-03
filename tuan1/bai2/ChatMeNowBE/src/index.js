const express = require("express");
const http = require("http");
const connectDB = require("./config/db");
const routes = require("./api/routes/index");
const cors = require("cors");
const dotenv = require("dotenv");

const path = require("path");
dotenv.config({ path: path.resolve(__dirname, ".env") });
connectDB();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

const server = http.createServer(app);

app.use("/api", routes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server đang lắng nghe trên cổng ${PORT}`);
});
