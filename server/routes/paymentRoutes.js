const express = require('express');
const { initiatePayment, verifyPayment, getTransactions } = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Initiate a payment
router.post('/initiate', protect, initiatePayment);

// Verify a payment
router.get('/verify', protect, verifyPayment);

// Get all transactions (admin only)
router.get('/transactions', protect, admin, getTransactions);

module.exports = router;