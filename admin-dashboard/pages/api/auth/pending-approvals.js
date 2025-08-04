import adminAuth from '../../../lib/adminAuth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Only admin can view pending approvals
    const adminEmail = process.env.ADMIN_EMAIL || 'contact@kenttraders.co.uk';
    
    // In a real implementation, you'd verify the admin's session here
    // For now, we'll allow viewing from the server

    const pendingApprovals = adminAuth.getPendingApprovals();
    const activeSessions = adminAuth.getActiveSessions();

    return res.status(200).json({
      success: true,
      data: {
        pendingApprovals,
        activeSessions,
        totalPending: pendingApprovals.length,
        totalActive: activeSessions.length
      }
    });

  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch pending approvals',
      message: error.message
    });
  }
} 