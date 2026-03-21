Testing (PowerShell)

1. Install deps:
   cd t:\NguyenCongDanh\bai3\flashsale_simple
   npm install

2. Start server in one terminal:
   npm start

3. In another terminal run the simple load simulator:
   $env:TARGET='http://localhost:3000/purchase'; $env:CONCURRENCY='100'; $env:DURATION='60'; node src/simulate_load.js

Notes:
- This is a very simple tester and runs from a single machine. For higher load, run multiple instances or use k6/wrk.
