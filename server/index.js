/* eslint-env node */
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables FIRST
dotenv.config();

console.log('=== SERVER STARTUP ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VERCEL:', !!process.env.VERCEL);
console.log('MONGO_URI available:', !!process.env.MONGO_URI);
console.log('======================');

// Then require modules that use environment variables
let connectDB, testRoutes, authRoutes, adminRoutes, productRoutes;
let categoryRoutes, propertyRoutes, paymentRoutes, userRoutes;
let bannerRoutes, debugRoutes;

try {
  connectDB = require('./config/db');
  testRoutes = require('./routes/testRoutes');
  authRoutes = require('./routes/authRoutes');
  adminRoutes = require('./routes/adminRoutes');
  productRoutes = require('./routes/productRoutes');
  categoryRoutes = require('./routes/categoryRoutes');
  propertyRoutes = require('./routes/propertyRoutes');
  paymentRoutes = require('./routes/paymentRoutes');
  userRoutes = require('./routes/userRoutes');
  bannerRoutes = require('./routes/bannerRoutes');
  debugRoutes = require('./routes/debugRoutes');

  console.log('All modules loaded successfully');
} catch (error) {
  console.error('Error loading modules:', error.message);
  // In Vercel, still try to continue with a basic server
  if (process.env.VERCEL) {
    console.log('Continuing with basic server for Vercel...');
  } else {
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database - with connection status tracking
let dbConnected = false;

// Function to ensure database connection
const ensureDBConnection = async () => {
  try {
    if (!connectDB) {
      throw new Error('Database module not loaded');
    }
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
  // Skip initial DB connection in Vercel to prevent function startup failures
} else if (connectDB) {
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
    // Check if MONGO_URI is available
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI environment variable not set');
      return res.status(503).json({ 
        message: 'Database configuration error. Please contact support.',
        error: 'DB_CONFIG_ERROR'
      });
    }

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

// Environment check endpoint
app.get('/api/env-check', (req, res) => {
  res.json({
    message: 'Environment check',
    hasMongoUri: !!process.env.MONGO_URI,
    isVercel: !!process.env.VERCEL,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
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

// Use routes (with safety checks)
console.log('Registering routes...');
if (testRoutes) {
  console.log('Registering test routes at /api/test');
  app.use('/api/test', testRoutes);
}
if (authRoutes) app.use('/api/auth', dbMiddleware, authRoutes);
if (adminRoutes) app.use('/api/admin', dbMiddleware, adminRoutes);
if (productRoutes) app.use('/api/products', dbMiddleware, productRoutes);
if (categoryRoutes) app.use('/api/categories', dbMiddleware, categoryRoutes);
if (propertyRoutes) app.use('/api/properties', dbMiddleware, propertyRoutes);
if (paymentRoutes) app.use('/api/payments', dbMiddleware, paymentRoutes);
if (userRoutes) app.use('/api/users', dbMiddleware, userRoutes);
if (bannerRoutes) app.use('/api/banners', dbMiddleware, bannerRoutes);
if (debugRoutes) app.use('/debug', debugRoutes);
console.log('Routes registered successfully');

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