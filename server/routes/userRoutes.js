const express = require('express');
const router = express.Router();
const { getUserTransactions } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/users/me/transactions - Get logged-in user's transactions
router.get('/me/transactions', protect, getUserTransactions);

module.exports = router;
