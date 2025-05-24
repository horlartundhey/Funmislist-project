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

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database - with connection status tracking
let dbConnected = false;
connectDB().then(() => {
  dbConnected = true;
}).catch(err => {
  console.error('Initial database connection failed:', err.message);
});

// Middleware to check DB connection status
app.use((req, res, next) => {
  if (!dbConnected && !mongoose.connection.readyState) {
    if (req.path.startsWith('/api')) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        error: 'SERVICE_UNAVAILABLE'
      });
    }
  }
  next();
});

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
// Serve uploaded files when using local storage
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use routes
app.use('/api', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/payments', paymentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});