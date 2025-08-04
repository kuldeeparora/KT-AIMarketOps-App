// Email utility functions for the admin dashboard
// This is a simplified email service for development,
  export const sendVerificationEmail = async (email, token) => {
  // For development, we'll just log the email
  // In production, this would integrate with a real email service like SendGrid, AWS SES, etc.
  
  
  
  
  // Simulate email sending delay,
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    success: true,
    message: 'Verification email sent successfully',
    token: token
  };
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  
  
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    success: true,
    message: 'Password reset email sent successfully',
    token: resetToken
  };
};

export const sendWelcomeEmail = async (email, userName) => {
  
  
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    success: true,
    message: 'Welcome email sent successfully'
  };
};

export const sendNotificationEmail = async (email, subject, message) => {
  
  
  
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    success: true,
    message: 'Notification email sent successfully'
  };
};

// Email templates
export const emailTemplates = {
  verification: (token, email) => ({
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email Address</h2>
        <p>Please click the link below to verify your email address: </p>
        <a href="${process.env.NEXTAUTH_URL}/auth/verify?token=${token}&email=${email}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Verify Email
        </a>
        <p>If the button doesn't work, copy and paste this link into your browser: </p>
        <p style="word-break: break-all; color: #666;">
          ${process.env.NEXTAUTH_URL}/auth/verify?token=${token}&email=${email}
        </p>
      </div>
    `
  }),
  passwordReset: (resetToken, email) => ({
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>You requested a password reset. Click the link below to reset your password: </p>
        <a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}&email=${email}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Reset Password
        </a>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `
  }),
  welcome: (userName) => ({
    subject: 'Welcome to Kent Traders Admin Dashboard',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Kent Traders!</h2>
        <p>Hello ${userName}</p>
        <p>Welcome to the Kent Traders Admin Dashboard. We're excited to have you on board!</p>
        <p>You can now access all the features including: </p>
        <ul>
          <li>Inventory Management</li>
          <li>Order Processing</li>
          <li>Analytics & Reports</li>
          <li>AI-Powered Insights</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <p>Best regards<br>The Kent Traders Team</p>
      </div>
    `
  })
}; 