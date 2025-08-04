export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, email, password, name } = req.body;

    // Validate input
    if (!token || !email || !password || !name) {
      return res.status(400).json({
        error: 'Token, email, password, and name are required'});
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long'});
  }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Please enter a valid email address'});
  }

    try {
      // Verify invitation token (simplified for development)
      const isValidToken = token.length > 10; // Simple validation

      if (!isValidToken) {
        return res.status(400).json({
          success: false,
          error: 'Invalid invitation token'});
  }

      // In production, verify token against database and check expiration
      // For development, we'll just accept any valid-looking token

      // Create user account (simulated)
      const user = {
        id: Date.now().toString(),
        email: email,
        name: name,
        role: 'user', // Default role for invited users
        isActive: true,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        invitedBy: 'admin',
        invitationToken: token};

      console.log('User account created from invitation:', user);

      res.status(200).json({
        success: true,
        message: 'Invitation accepted successfully. You can now sign in.',
        user: {
    id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
  }
      });
    } catch (error) {
      console.error('Error accepting invitation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to accept invitation'});
  }
  } catch (error) {
    console.error('Error in accept invitation:', error);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred'});
  }
}
