const express = require('express');
const router = express.Router();

// Debug route to check environment variables
router.get('/env', (req, res) => {
  console.log('=== ENVIRONMENT DEBUG ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
  console.log('GMAIL_USER:', process.env.GMAIL_USER ? 'SET' : 'NOT SET');
  console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? 'SET' : 'NOT SET');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
  console.log('========================');
  
  res.json({
    node_env: process.env.NODE_ENV,
    frontend_url: process.env.FRONTEND_URL,
    gmail_user_set: !!process.env.GMAIL_USER,
    gmail_pass_set: !!process.env.GMAIL_PASS,
    jwt_secret_set: !!process.env.JWT_SECRET,
    all_env_vars: Object.keys(process.env).filter(key => 
      key.includes('FRONTEND') || 
      key.includes('GMAIL') || 
      key.includes('JWT') ||
      key.includes('MONGO')
    )
  });
});

// Debug route to check email service
router.get('/email-test', (req, res) => {
  const { sendVerificationEmail } = require('../utils/emailService');
  
  console.log('=== EMAIL SERVICE TEST ===');
  console.log('FRONTEND_URL before email service:', process.env.FRONTEND_URL);
  
  // Test URL generation without actually sending email
  const testToken = 'test-token-123';
  const testEmail = 'test@example.com';
  
  try {
    // We'll modify emailService to return the URL for testing
    res.json({
      message: 'Email service test completed',
      frontend_url: process.env.FRONTEND_URL,
      test_verification_url: `${process.env.FRONTEND_URL || 'https://funmislist-project.vercel.app'}/verify-email?token=${testToken}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Email service test error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
