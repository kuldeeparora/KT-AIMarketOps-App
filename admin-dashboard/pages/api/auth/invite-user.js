export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, role = 'user', invitedBy } = req.body;

    // Validate input
    if (!email || !name) {
      return res.status(400).json({
        error: 'Email and name are required'});
  }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Please enter a valid email address'});
  }

    // Validate role
    const validRoles = ['admin', 'user', 'manager'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: 'Invalid role. Must be admin, user, or manager'});
    }

    try {
      // Generate invitation token
      const invitationToken =
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      // In production, store invitation in database with expiration
      const invitationUrl = `${process.env.NEXTAUTH_URL}/auth/accept-invitation?token=${invitationToken}&email=${email}`;

      // Create invitation data
      const invitation = {
        id: Date.now().toString(),
        email: email,
        name: name,
        role: role,
        invitedBy: invitedBy || 'admin',
        token: invitationToken,
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      };

      // Send invitation email (simulated)
      console.log('Invitation email would be sent to:', email);
      console.log('Invitation URL:', invitationUrl);
      console.log('Invitation data:', invitation);

      res.status(200).json({
        success: true,
        message: 'Invitation sent successfully',
        invitation: {
    id: invitation.id,
          email: invitation.email,
          name: invitation.name,
          role: invitation.role,
          status: invitation.status,
          token: invitationToken // For development testing
  }});
    } catch (error) {
      console.error('Error creating invitation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create invitation'});
  }
  } catch (error) {
    console.error('Error in user invitation:', error);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred'});
  }
}
