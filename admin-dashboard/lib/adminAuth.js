// Admin Authentication System
// This system requires manual approval for all user logins

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'contact@kenttraders.co.uk';
const APPROVED_USERS = new Set([
  ADMIN_EMAIL,
  // Add other approved emails here
]);

// Pending approval requests
const pendingApprovals = new Map();

// Approved sessions
const approvedSessions = new Map();

class AdminAuthSystem {
  constructor() {
    this.adminEmail = ADMIN_EMAIL;
    this.approvedUsers = APPROVED_USERS;
  }

  // Check if user is admin
  isAdmin(email) {
    return email === this.adminEmail;
  }

  // Check if user is pre-approved
  isPreApproved(email) {
    return this.approvedUsers.has(email);
  }

  // Request approval for login
  requestApproval(userData) {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const approvalRequest = {
      id: requestId,
      user: userData,
      timestamp: new Date().toISOString(),
      status: 'pending',
      approvedBy: null,
      approvedAt: null
    };

    pendingApprovals.set(requestId, approvalRequest);
    
    console.log(`🔐 ADMIN APPROVAL REQUIRED:`);
    console.log(`   User: ${userData.email}`);
    console.log(`   Name: ${userData.name}`);
    console.log(`   Provider: ${userData.provider}`);
    console.log(`   Request ID: ${requestId}`);
    console.log(`   To approve: POST /api/auth/approve with body: {"requestId": "${requestId}"}`);
    console.log(`   To deny: POST /api/auth/deny with body: {"requestId": "${requestId}"}`);
    
    return requestId;
  }

  // Get pending approvals (admin only)
  getPendingApprovals() {
    return Array.from(pendingApprovals.values());
  }

  // Approve a login request
  approveRequest(requestId, approvedBy = ADMIN_EMAIL) {
    const request = pendingApprovals.get(requestId);
    if (!request) {
      throw new Error('Approval request not found');
    }

    request.status = 'approved';
    request.approvedBy = approvedBy;
    request.approvedAt = new Date().toISOString();

    // Create approved session
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    approvedSessions.set(sessionId, {
      ...request.user,
      sessionId,
      approvedAt: request.approvedAt,
      approvedBy: request.approvedBy
    });

    pendingApprovals.delete(requestId);
    
    console.log(`✅ APPROVED: ${request.user.email} by ${approvedBy}`);
    
    return sessionId;
  }

  // Deny a login request
  denyRequest(requestId, deniedBy = ADMIN_EMAIL) {
    const request = pendingApprovals.get(requestId);
    if (!request) {
      throw new Error('Approval request not found');
    }

    request.status = 'denied';
    request.deniedBy = deniedBy;
    request.deniedAt = new Date().toISOString();

    pendingApprovals.delete(requestId);
    
    console.log(`❌ DENIED: ${request.user.email} by ${deniedBy}`);
    
    return true;
  }

  // Validate session
  validateSession(sessionId) {
    const session = approvedSessions.get(sessionId);
    if (!session) {
      return null;
    }

    // Check if session is still valid (24 hours)
    const sessionAge = Date.now() - new Date(session.approvedAt).getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (sessionAge > maxAge) {
      approvedSessions.delete(sessionId);
      return null;
    }

    return session;
  }

  // Get all active sessions
  getActiveSessions() {
    return Array.from(approvedSessions.values());
  }

  // Revoke session
  revokeSession(sessionId) {
    const session = approvedSessions.get(sessionId);
    if (session) {
      approvedSessions.delete(sessionId);
      console.log(`🚫 REVOKED: Session for ${session.email}`);
      return true;
    }
    return false;
  }

  // Clean up expired sessions
  cleanupExpiredSessions() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [sessionId, session] of approvedSessions.entries()) {
      const sessionAge = now - new Date(session.approvedAt).getTime();
      if (sessionAge > maxAge) {
        approvedSessions.delete(sessionId);
      }
    }
  }
}

// Create singleton instance
const adminAuth = new AdminAuthSystem();

// Clean up expired sessions every hour
setInterval(() => {
  adminAuth.cleanupExpiredSessions();
}, 60 * 60 * 1000);

export default adminAuth; 