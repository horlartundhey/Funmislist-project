const express = require('express');
const router = express.Router();

// Debug route to check environment variables
router.get('/env', (req, res) => {
  console.log('=== ENVIRONMENT DEBUG ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST ? 'SET' : 'NOT SET');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
  console.log('========================');
  
  res.json({
    node_env: process.env.NODE_ENV,
    frontend_url: process.env.FRONTEND_URL,
    email_user_set: !!process.env.EMAIL_USER,
    email_pass_set: !!process.env.EMAIL_PASS,
    email_host_set: !!process.env.EMAIL_HOST,
    jwt_secret_set: !!process.env.JWT_SECRET,
    all_env_vars: Object.keys(process.env).filter(key => 
      key.includes('FRONTEND') || 
      key.includes('EMAIL') || 
      key.includes('JWT') ||
      key.includes('MONGO')
    ),
    timestamp: new Date().toISOString()
  });
});

// Debug route to check email service
router.get('/email-test', (req, res) => {
  console.log('=== EMAIL SERVICE TEST ===');
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
  
  const emailConfig = {
    hasEmailHost: !!process.env.EMAIL_HOST,
    hasEmailUser: !!process.env.EMAIL_USER,
    hasEmailPass: !!process.env.EMAIL_PASS,
    emailHost: process.env.EMAIL_HOST,
    emailUser: process.env.EMAIL_USER,
    frontendUrl: process.env.FRONTEND_URL,
    nodeEnv: process.env.NODE_ENV
  };
  
  res.json({
    message: 'Email configuration check',
    config: emailConfig,
    timestamp: new Date().toISOString()
  });
});

// Test actual email sending
router.post('/send-test-email', async (req, res) => {
  try {
    const { sendEmailVerification } = require('../utils/emailService');
    const testEmail = req.body.email || 'test@example.com';
    const testName = req.body.name || 'Test User';
    const testToken = 'test-token-123456789';
    
    console.log('=== SENDING TEST EMAIL ===');
    console.log('To:', testEmail);
    console.log('Name:', testName);
    console.log('Token:', testToken);
    
    await sendEmailVerification(testEmail, testName, testToken);
    
    res.json({
      message: 'Test email sent successfully',
      sentTo: testEmail,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test email failed:', error);
    res.status(500).json({
      message: 'Test email failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
