const express = require('express');
const cors = require('cors');
const path = require('path');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (allowedOrigins.length === 0) return cb(null, true);
      return cb(null, allowedOrigins.includes(origin));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (req, res) => {
  res.json({ name: 'ShopSmart API', status: 'ok' });
});

const publicDir = path.join(__dirname, '..', 'public');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(publicDir));
}

app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(publicDir, 'index.html'));
  } else {
    res.send('ShopSmart Backend Service');
  }
});

app.use(errorHandler);

if (process.env.NODE_ENV === 'production') {
  app.use((req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

module.exports = app;
