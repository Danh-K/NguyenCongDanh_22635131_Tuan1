const axios = require('axios');

// Simple single-process load tester for 60s
// Usage: node src/simulate_load.js

const target = process.env.TARGET || 'http://localhost:3000/purchase';
const durationSec = parseInt(process.env.DURATION || '60', 10);
const concurrency = parseInt(process.env.CONCURRENCY || '50', 10);

let successes = 0;
let failures = 0;
let total = 0;

async function worker(id) {
  const end = Date.now() + durationSec * 1000;
  while (Date.now() < end) {
    try {
      const r = await axios.post(target, { userId: `user_${id}` });
      if (r.data && r.data.success) successes++;
      else failures++;
    } catch (e) {
      failures++;
    }
    total++;
  }
}

(async () => {
  const workers = [];
  for (let i = 0; i < concurrency; i++) workers.push(worker(i));
  await Promise.all(workers);
  console.log({ total, successes, failures });
})();
