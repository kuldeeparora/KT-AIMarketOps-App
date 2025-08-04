import { sendVerificationEmail } from '../../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, token } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required'});
    }

    // For development, we'll simulate email verification
    // In production, this would verify the token against the database
    if (token) {
      // Verify the token (simplified for development)
      const isValidToken = token.length > 10; // Simple validation

      if (isValidToken) {
        // Mark email as verified in database (simulated)
        res.status(200).json({
          success: true,
          message: 'Email verified successfully',
          verified: true});
      } else {
        res.status(400).json({
          success: false,
          error: 'Invalid verification token'});
      }
    } else {
      // Send verification email
      try {
        // Generate verification token (simplified)
        const verificationToken =
          Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // In production, store this token in database with expiration
        const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${verificationToken}&email=${email}`;

        // Send verification email (simulated)
        console.log('Verification email would be sent to:', email);
        console.log('Verification URL:', verificationUrl);

        res.status(200).json({
          success: true,
          message: 'Verification email sent successfully',
          token: verificationToken, // For development testing
        });
      } catch (error) {
        console.error('Error sending verification email:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to send verification email'});
      }
    }
  } catch (error) {
    console.error('Error in email verification:', error);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred'});
  }
}
