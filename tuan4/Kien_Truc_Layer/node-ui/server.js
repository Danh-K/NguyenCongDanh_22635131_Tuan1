const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const UI_PORT = process.env.UI_PORT || 3000;
const BACKEND_BASE = process.env.BACKEND_BASE || 'http://localhost:8081';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Proxy API requests to backend
app.all('/api/*', async (req, res) => {
  const backendUrl = BACKEND_BASE + req.originalUrl;
  
  try {
    const options = {
      method: req.method,
      headers: req.headers
    };
    delete options.headers.host;
    
    const backendReq = http.request(backendUrl, options, (backendRes) => {
      res.status(backendRes.statusCode || 500);
      Object.keys(backendRes.headers).forEach(key => {
        res.setHeader(key, backendRes.headers[key]);
      });
      backendRes.pipe(res);
    });
    
    backendReq.on('error', (err) => {
      console.error(`Backend request error: ${err.message}`);
      res.status(502).json({ 
        error: 'Backend unavailable',
        message: err.message 
      });
    });
    
    if (req.body && Object.keys(req.body).length > 0) {
      backendReq.write(JSON.stringify(req.body));
    }
    backendReq.end();
  } catch (error) {
    console.error(`Error forwarding request: ${error.message}`);
    res.status(502).json({ error: 'Internal proxy error' });
  }
});

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(UI_PORT, () => {
  console.log(`Layer UI running on http://localhost:${UI_PORT}`);
  console.log(`Backend address: ${BACKEND_BASE}`);
  console.log(`To change backend, set: $env:BACKEND_BASE='http://your-server:8081'`);
});
