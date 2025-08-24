/* eslint-env node */
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables FIRST
dotenv.config();

// Then require modules that use environment variables
const connectDB = require('./config/db');
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const debugRoutes = require('./routes/debugRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database - with connection status tracking
let dbConnected = false;

// Function to ensure database connection
const ensureDBConnection = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('Connecting to database...');
      await connectDB();
      dbConnected = true;
      console.log('Database connected successfully');
    }
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
};

// In serverless environments, establish connection on first request
if (process.env.VERCEL) {
  console.log('Serverless environment detected - will connect to DB on first request');
} else {
  // In traditional server environments, connect immediately
  connectDB().then(() => {
    dbConnected = true;
    console.log('Initial database connection established');
  }).catch(err => {
    console.error('Initial database connection failed:', err.message);
  });
}

// Middleware to ensure DB connection (only for DB-dependent routes)
const dbMiddleware = (req, res, next) => {
  // For serverless, try to connect if not connected
  if (process.env.VERCEL && mongoose.connection.readyState !== 1) {
    ensureDBConnection()
      .then(() => next())
      .catch(error => {
        console.error('Database connection middleware error:', error.message);
        return res.status(503).json({ 
          message: 'Database connection unavailable. Please try again later.',
          error: 'SERVICE_UNAVAILABLE'
        });
      });
  } else {
    next();
  }
};

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://funmislist-project.vercel.app',
    'https://funmislist-project-sgb3.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200
}));

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

app.use(express.json());
// Serve uploaded files when using local storage
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Simple test route without DB dependency
app.get('/api/test-cors', (req, res) => {
  res.json({
    message: 'CORS test successful',
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    headers: req.headers
  });
});

// Debug route to check environment variables
app.get('/debug/env', (req, res) => {
  console.log('=== ENVIRONMENT DEBUG ACCESS ===');
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
  console.log('GMAIL_USER:', process.env.GMAIL_USER ? 'SET' : 'NOT SET');
  console.log('================================');
  
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    FRONTEND_URL: process.env.FRONTEND_URL,
    EMAIL_CONFIGURED: !!process.env.EMAIL_USER,
    GMAIL_CONFIGURED: !!process.env.GMAIL_USER,
    PORT: process.env.PORT,
    timestamp: new Date().toISOString()
  });
});

// Use routes
console.log('Registering test routes at /api/test');
app.use('/api/test', testRoutes);
app.use('/api/auth', dbMiddleware, authRoutes);
app.use('/api/admin', dbMiddleware, adminRoutes);
app.use('/api/products', dbMiddleware, productRoutes);
app.use('/api/categories', dbMiddleware, categoryRoutes);
app.use('/api/properties', dbMiddleware, propertyRoutes);
app.use('/api/payments', dbMiddleware, paymentRoutes);
app.use('/api/users', dbMiddleware, userRoutes);
app.use('/api/banners', dbMiddleware, bannerRoutes);
app.use('/debug', debugRoutes);

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Handle specific error types
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(error.errors).map(err => err.message)
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format'
    });
  }
  
  if (error.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate field value'
    });
  }
  
  // Default error response
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server (only in non-serverless environments)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless functions
module.exports = app;