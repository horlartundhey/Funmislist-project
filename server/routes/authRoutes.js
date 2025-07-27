const express = require('express');
const { 
  registerUser, 
  loginUser, 
  verifyEmail, 
  forgotPassword, 
  resetPassword, 
  resendEmailVerification 
} = require('../controllers/authController');
const router = express.Router();

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Verify email
router.get('/verify-email/:token', verifyEmail);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.put('/reset-password/:token', resetPassword);

// Resend email verification
router.post('/resend-verification', resendEmailVerification);

module.exports = router;