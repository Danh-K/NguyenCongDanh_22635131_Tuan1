Flash-sale simple demo (Node.js)

This is a minimal Node.js app to demonstrate a flash-sale endpoint without Redis, MQ, or Docker.

Quick start (PowerShell):

1. Open PowerShell in the workspace folder:
   cd t:\NguyenCongDanh\bai3\flashsale_simple

2. Install dependencies:
   npm install

3. Start the server:
   npm start

Endpoints:
- GET /health -> health check
- POST /purchase -> attempt to buy 1 ticket. Body: { "userId": "<id>" }

Notes:
- Inventory is kept in-memory. This is only for demo/testing and will reset when the process restarts.
- Concurrency is simulated via atomic operations on JS variables; in real world use Redis or DB transactions.
