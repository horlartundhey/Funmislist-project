const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendEmailVerification, sendPasswordReset } = require('../utils/emailService');

// Register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Log registration attempt
    console.log('\n=== REGISTRATION ATTEMPT ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Environment check:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- FRONTEND_URL:', process.env.FRONTEND_URL);
    console.log('- EMAIL_USER:', process.env.EMAIL_USER ? 'Configured' : 'Not configured');

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Registration failed: User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({ name, email, password });
    console.log('User created successfully:', user._id);

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();
    console.log('Verification token generated:', verificationToken.substring(0, 10) + '...');

    // Send verification email
    try {
      console.log('Attempting to send verification email...');
      await sendEmailVerification(user.email, user.name, verificationToken);
      console.log('Verification email sent successfully');
    } catch (emailError) {
      console.error('=== EMAIL SENDING ERROR ===');
      console.error('Error message:', emailError.message);
      console.error('Error stack:', emailError.stack);
      console.error('========================');
      // Don't fail registration if email fails
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    console.log('Registration completed successfully');
    console.log('=========================\n');

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      token,
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('=== REGISTRATION ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('========================');
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password using the model method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({ 
        message: 'Please verify your email before logging in',
        needsVerification: true,
        email: user.email,
        name: user.name
      });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // Find user with this token and check if it's not expired
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Update user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send reset email
    try {
      await sendPasswordReset(user.email, user.name, resetToken);
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (emailError) {
      console.error('Password reset email failed:', emailError);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Email could not be sent' : (emailError.message || 'Email could not be sent') });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Server error' : (error.message || 'Server error') });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with this token and check if it's not expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Resend email verification
const resendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;

    console.log('\n=== RESEND VERIFICATION ATTEMPT ===');
    console.log('Email:', email);
    console.log('Environment check:');
    console.log('- FRONTEND_URL:', process.env.FRONTEND_URL);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('Resend failed: User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      console.log('Resend failed: Email already verified');
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();
    console.log('New verification token generated:', verificationToken.substring(0, 10) + '...');

    // Send verification email
    try {
      console.log('Attempting to resend verification email...');
      await sendEmailVerification(user.email, user.name, verificationToken);
      console.log('Verification email resent successfully');
      res.status(200).json({ message: 'Verification email sent' });
    } catch (emailError) {
      console.error('=== RESEND EMAIL ERROR ===');
      console.error('Error message:', emailError.message);
      console.error('Error stack:', emailError.stack);
      console.error('========================');
      res.status(500).json({ message: 'Email could not be sent' });
    }

    console.log('===========================\n');
  } catch (error) {
    console.error('=== RESEND VERIFICATION ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('==============================');
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  verifyEmail, 
  forgotPassword, 
  resetPassword, 
  resendEmailVerification 
};