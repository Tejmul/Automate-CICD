const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const wishlistRouter = require('./routes/wishlist');
const authRouter = require('./routes/auth');

const app = express();

// Middleware
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

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/wishlist', wishlistRouter);

// Health Check Route
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

// In production (Docker), serve the built client as static files
const path = require('path');
const publicDir = path.join(__dirname, '..', 'public');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(publicDir));
}

// Root Route (dev fallback)
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(publicDir, 'index.html'));
  } else {
    res.send('ShopSmart Backend Service');
  }
});

app.use(errorHandler);

// SPA fallback — serve index.html for unknown routes in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

module.exports = app;
