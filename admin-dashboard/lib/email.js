import nodemailer from 'nodemailer';

/**
 * Email service configuration
 */
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || process.env.ALERT_EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.ALERT_EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 10000,
};

/**
 * Create email transporter
 */
function createTransporter() {
  return nodemailer.createTransporter(emailConfig);
}

/**
 * Send verification email
 * @param {string} to - Recipient email
 * @param {string} token - Verification token
 * @param {string} email - Email address
 */
export async function sendVerificationEmail(to, token, email) {
  try {
    const transporter = createTransporter();
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}&email=${email}`;
    
    const mailOptions = {
      from: process.env.SMTP_USER || process.env.ALERT_EMAIL_USER,
      to,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verify Your Email Address</h2>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} token - Reset token
 */
export async function sendPasswordResetEmail(to, token) {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.SMTP_USER || process.env.ALERT_EMAIL_USER,
      to,
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}

/**
 * Send notification email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} message - Email message
 */
export async function sendNotificationEmail(to, subject, message) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_USER || process.env.ALERT_EMAIL_USER,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${subject}</h2>
          <div style="color: #666;">
            ${message}
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Notification email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('Error sending notification email:', error);
    return false;
  }
}

/**
 * Send alert email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Email body
 */
export async function sendEmailAlert(to, subject, text) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_USER || process.env.ALERT_EMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log('Alert email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('Error sending alert email:', error);
    return false;
  }
} 