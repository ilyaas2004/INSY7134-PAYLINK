const express = require('express');
const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./backend/config/db');
const { helmetConfig, generalRateLimiter } = require('./backend/middleware/security');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmetConfig);
app.use(generalRateLimiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'https://localhost:3000',
    credentials: true,
  })
);

// Routes
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/payments', require('./backend/routes/payment'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  // Production: Use HTTPS/SSL
  const sslOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
  };

  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server running on https://localhost:${PORT}`);
  });
} else {
  // Development: use plain HTTP
  app.listen(PORT, () => {
    console.log(`HTTP Server running on http://localhost:${PORT}`);
  });
}
