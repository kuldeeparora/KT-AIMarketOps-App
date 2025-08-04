# Admin Authentication Setup Guide

## Overview
This system implements strict admin approval for all user logins. Only the administrator can approve or deny access requests.

## Environment Variables
Create a `.env.local` file in the admin-dashboard directory with the following variables:

```bash
# Admin Authentication
ADMIN_EMAIL=contact@kenttraders.co.uk

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth (if using Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# SellerDynamics API (if using real data)
SELLERDYNAMICS_ENDPOINT=your-sellerdynamics-endpoint
SELLERDYNAMICS_LOGIN=your-sellerdynamics-login
SELLERDYNAMICS_PASSWORD=your-sellerdynamics-password
SELLERDYNAMICS_RETAILER_ID=your-sellerdynamics-retailer-id

# Firebase Configuration (if using Firebase)
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
FIREBASE_APP_ID=your-firebase-app-id
```

## How It Works

### 1. Login Process
- Users attempt to sign in via Google or credentials
- All login attempts are intercepted and require admin approval
- Users see a message that their request is pending approval
- Admin receives console notifications with approval/denial commands

### 2. Admin Approval Process
- Admin can view pending requests at `/admin-approvals`
- Console shows approval requests with request IDs
- Admin can approve/deny via API endpoints or admin dashboard
- Approved users get session tokens valid for 24 hours

### 3. Security Features
- All sessions expire after 24 hours
- Admin can revoke sessions at any time
- Pre-approved users (admin email) bypass approval
- Static deployment shows demo mode with mock data

## API Endpoints

### View Pending Approvals
```bash
GET /api/auth/pending-approvals
```

### Approve Request
```bash
POST /api/auth/approve
Content-Type: application/json

{
  "requestId": "req_1234567890_abc123"
}
```

### Deny Request
```bash
POST /api/auth/deny
Content-Type: application/json

{
  "requestId": "req_1234567890_abc123"
}
```

## Console Commands

When a login request is made, the console will show:

```
🔐 ADMIN APPROVAL REQUIRED:
   User: user@example.com
   Name: John Doe
   Provider: google
   Request ID: req_1234567890_abc123
   To approve: POST /api/auth/approve with body: {"requestId": "req_1234567890_abc123"}
   To deny: POST /api/auth/deny with body: {"requestId": "req_1234567890_abc123"}
```

## Admin Dashboard

Visit `/admin-approvals` to:
- View all pending approval requests
- View active sessions
- Approve or deny requests via UI
- Monitor system activity

## Demo Mode

In static deployment (Firebase), the system shows:
- Demo mode banner
- Mock authentication
- No approval required
- Demo data only

## Adding Pre-approved Users

Edit `lib/adminAuth.js` and add emails to the `APPROVED_USERS` set:

```javascript
const APPROVED_USERS = new Set([
  'contact@kenttraders.co.uk',
  'admin@kenttraders.co.uk',
  'manager@kenttraders.co.uk'
]);
```

## Security Notes

1. **Session Management**: Sessions expire after 24 hours
2. **Admin Control**: Only admin can approve/deny requests
3. **Audit Trail**: All approvals/denials are logged
4. **Demo Mode**: Static deployment bypasses approval for demo
5. **Pre-approved**: Admin and pre-approved users bypass approval

## Testing

1. Start the development server: `npm run dev`
2. Try to sign in with any Google account
3. Check console for approval request
4. Use admin dashboard or API to approve/deny
5. Test session expiration and revocation

## Future Enhancements

- Email notifications for approval requests
- Time-based approval windows
- Role-based access control
- Audit logging to database
- Integration with external identity providers 