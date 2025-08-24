/* eslint-env node */
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://funmislist-project.vercel.app',
    'https://funmislist-project-sgb3.vercel.app'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Test routes
app.get('/', (req, res) => {
  res.send('Test API is running...');
});

app.get('/api/test-cors', (req, res) => {
  res.json({
    message: 'CORS test successful',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/env-check', (req, res) => {
  res.json({
    message: 'Environment check',
    hasMongoUri: !!process.env.MONGO_URI,
    isVercel: !!process.env.VERCEL,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`
  });
});

// For Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
  });
}

module.exports = app;
