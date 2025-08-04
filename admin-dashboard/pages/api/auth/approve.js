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

    // Only admin can approve requests
    const adminEmail = process.env.ADMIN_EMAIL || 'contact@kenttraders.co.uk';
    
    // In a real implementation, you'd verify the admin's session here
    // For now, we'll allow approval from the server

    const sessionId = adminAuth.approveRequest(requestId, adminEmail);

    return res.status(200).json({
      success: true,
      message: 'Login request approved',
      sessionId,
      data: {
        requestId,
        approvedBy: adminEmail,
        approvedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Approval error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to approve request',
      message: error.message
    });
  }
} 