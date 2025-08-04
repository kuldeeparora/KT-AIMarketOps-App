import adminAuth from '../../../lib/adminAuth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ error: 'Request ID is required' });
    }

    // Only admin can deny requests
    const adminEmail = process.env.ADMIN_EMAIL || 'contact@kenttraders.co.uk';
    
    // In a real implementation, you'd verify the admin's session here
    // For now, we'll allow denial from the server

    adminAuth.denyRequest(requestId, adminEmail);

    return res.status(200).json({
      success: true,
      message: 'Login request denied',
      data: {
        requestId,
        deniedBy: adminEmail,
        deniedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Denial error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to deny request',
      message: error.message
    });
  }
} 