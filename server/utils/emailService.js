const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email verification
const sendEmailVerification = async (email, name, token) => {
  logger.email('=== EMAIL VERIFICATION PROCESS START ===', {
    email,
    name,
    token: token ? 'PROVIDED' : 'MISSING',
    frontendUrl: process.env.FRONTEND_URL,
    envVariables: {
      FRONTEND_URL: process.env.FRONTEND_URL,
      EMAIL_HOST: process.env.EMAIL_HOST,
      EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'NOT SET'
    }
  });
  
  const transporter = createTransporter();
  
  // Ensure we have a proper base URL - check multiple fallbacks
  let baseUrl = process.env.FRONTEND_URL;
  
  logger.email('Initial FRONTEND_URL check', { 
    raw: process.env.FRONTEND_URL,
    type: typeof process.env.FRONTEND_URL,
    length: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.length : 0
  });
  
  // If FRONTEND_URL is not set or is undefined, use localhost
  if (!baseUrl || baseUrl === 'undefined' || baseUrl.trim() === '') {
    baseUrl = 'http://localhost:5173';
    logger.warn('FRONTEND_URL not properly configured, using fallback', { 
      original: process.env.FRONTEND_URL,
      fallback: baseUrl 
    });
  }
  
  const verificationUrl = `${baseUrl}/verify-email/${token}`;
  
  logger.email('Generated verification URL', { 
    baseUrl, 
    token, 
    finalUrl: verificationUrl 
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@funmislist.com',
    to: email,
    subject: 'Verify Your Email - Funmislist',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Welcome to Funmislist!</h1>
        </div>
        
        <p style="font-size: 16px; color: #333;">Hi <strong>${name}</strong>,</p>
        
        <p style="font-size: 16px; color: #333; line-height: 1.5;">
          Thank you for registering with Funmislist. Please verify your email address by clicking the button below:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: bold;">
            Verify Email Address
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin: 20px 0;">
          Or copy and paste this link in your browser:
        </p>
        <p style="font-size: 14px; color: #0066cc; word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 5px;">
          ${verificationUrl}
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="font-size: 14px; color: #666;">
            <strong>Important:</strong> This link will expire in 24 hours for security reasons.
          </p>
          <p style="font-size: 14px; color: #666;">
            If you didn't create an account with us, please ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="font-size: 14px; color: #333;">
            Best regards,<br>
            <strong>The Funmislist Team</strong>
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully to:', email);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
};

// Send password reset email
const sendPasswordReset = async (email, name, token) => {
  const transporter = createTransporter();
  
  // Ensure we have a proper base URL - check multiple fallbacks
  let baseUrl = process.env.FRONTEND_URL;
  
  // If FRONTEND_URL is not set or is undefined, use localhost
  if (!baseUrl || baseUrl === 'undefined' || baseUrl.trim() === '') {
    baseUrl = 'http://localhost:5173';
    console.warn('FRONTEND_URL not properly configured, using fallback:', baseUrl);
  }
  
  const resetUrl = `${baseUrl}/reset-password/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@funmislist.com',
    to: email,
    subject: 'Password Reset Request - Funmislist',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>You requested to reset your password for your Funmislist account. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser: <a href="${resetUrl}">${resetUrl}</a></p>
        <p><strong>This link will expire in 10 minutes for security reasons.</strong></p>
        <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
        <p>Best regards,<br>The Funmislist Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send appointment confirmation email
const sendAppointmentConfirmation = async (email, name, appointmentDetails) => {
  const transporter = createTransporter();
  const { propertyTitle, date, time, propertyAddress } = appointmentDetails;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Appointment Confirmed - Funmislist',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Appointment Confirmed!</h2>
        <p>Hi ${name},</p>
        <p>Your appointment has been successfully booked. Here are the details:</p>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Appointment Details</h3>
          <p><strong>Property:</strong> ${propertyTitle}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Address:</strong> ${propertyAddress}</p>
        </div>
        <p>Please arrive on time for your appointment. If you need to reschedule or cancel, please contact us as soon as possible.</p>
        <p>We look forward to seeing you!</p>
        <p>Best regards,<br>The Funmislist Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendEmailVerification,
  sendPasswordReset,
  sendAppointmentConfirmation,
};