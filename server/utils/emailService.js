const nodemailer = require('nodemailer');

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
  const transporter = createTransporter();
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify Your Email - Funmislist',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Welcome to Funmislist!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering with Funmislist. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>Or copy and paste this link in your browser: <a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account with us, please ignore this email.</p>
        <p>Best regards,<br>The Funmislist Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send password reset email
const sendPasswordReset = async (email, name, token) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
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