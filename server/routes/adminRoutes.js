const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Admin-only route example
router.get('/dashboard', protect, admin, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard!' });
});

module.exports = router;