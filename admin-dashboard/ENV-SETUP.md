# 🔐 Environment Setup for Google Authentication & Firebase

## 📋 Required Environment Variables

Create a `.env.local` file in the `admin-dashboard` directory with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Optional: Restrict to specific email domains
ALLOWED_EMAIL_DOMAINS=kenttraders.co.uk,gmail.com

# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Firebase Admin Configuration (Server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Database Configuration (if using Prisma)
DATABASE_URL="file:./dev.db"

# AI/AGI System Configuration
OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
PINECONE_API_KEY=your-pinecone-api-key
LANGCHAIN_API_KEY=your-langchain-api-key

# Security Configuration
JWT_SECRET=your-jwt-secret-key-here
ENCRYPTION_KEY=your-encryption-key-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Session Configuration
SESSION_MAX_AGE=2592000
SESSION_UPDATE_AGE=86400
```

## 🔧 Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen:
   - Application name: "Kent Traders Admin Dashboard"
   - User support email: your-email@kenttraders.co.uk
   - Developer contact information: your-email@kenttraders.co.uk

### 2. Configure OAuth 2.0 Client

1. **Application type**: Web application
2. **Authorized JavaScript origins**:
   ```
   http://localhost:3001
   https://your-domain.com
   ```
3. **Authorized redirect URIs**:
   ```
   http://localhost:3001/api/auth/callback/google
   https://your-domain.com/api/auth/callback/google
   ```

### 3. Get Your Credentials

After creating the OAuth client, you'll get:
- **Client ID**: Copy this to `GOOGLE_CLIENT_ID`
- **Client Secret**: Copy this to `GOOGLE_CLIENT_SECRET`

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Enter project name: "Kent Traders Admin Dashboard"
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Add Web App to Firebase

1. In your Firebase project, click "Add app" → "Web"
2. Register app with name: "Kent Traders Admin Dashboard"
3. Copy the Firebase config object

### 3. Enable Firebase Services

1. **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable Google provider
   - Enable Email/Password provider

2. **Firestore Database**:
   - Go to Firestore Database → Create database
   - Start in test mode (for development)
   - Choose a location close to your users

3. **Storage**:
   - Go to Storage → Get started
   - Start in test mode (for development)
   - Choose a location close to your users

### 4. Create Service Account

1. Go to Project Settings → Service accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Use the values from this file in your environment variables

### 5. Configure Security Rules

**Firestore Rules** (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin can read/write all data
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

**Storage Rules** (`storage.rules`):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload/delete their own files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin can access all files
    match /{allPaths=**} {
      allow read, write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🔐 Security Features Implemented

### ✅ Authentication Features
- **Google OAuth 2.0** - Secure Google sign-in
- **Credentials Provider** - Email/password fallback
- **JWT Sessions** - Secure session management
- **Token Refresh** - Automatic token renewal
- **Role-based Access** - User role management

### ✅ Security Enhancements
- **Domain Restriction** - Limit to specific email domains
- **Session Management** - Configurable session times
- **Rate Limiting** - Prevent abuse
- **CSRF Protection** - Built into NextAuth
- **Secure Headers** - XSS and injection protection

### ✅ User Experience
- **Seamless Sign-in** - Google OAuth integration
- **User Menu** - Profile and settings access
- **Session Persistence** - Stay logged in
- **Responsive Design** - Works on all devices

## 🚀 Quick Start

1. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your actual values
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Navigate to `http://localhost:3001`
   - You'll be redirected to sign-in page
   - Use Google OAuth or credentials

## 🔒 Security Best Practices

### Environment Variables
- ✅ Use strong, unique secrets
- ✅ Never commit `.env.local` to version control
- ✅ Rotate secrets regularly
- ✅ Use different secrets for dev/staging/prod

### Google OAuth
- ✅ Restrict to your domain with `ALLOWED_EMAIL_DOMAINS`
- ✅ Use HTTPS in production
- ✅ Configure proper redirect URIs
- ✅ Monitor OAuth usage in Google Cloud Console

### Application Security
- ✅ Enable HTTPS in production
- ✅ Use secure session cookies
- ✅ Implement rate limiting
- ✅ Regular security audits

## 🛠️ Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Check your Google OAuth configuration
   - Ensure redirect URIs match exactly

2. **"Client ID not found"**
   - Verify `GOOGLE_CLIENT_ID` in `.env.local`
   - Check Google Cloud Console credentials

3. **"Session not found"**
   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your domain

4. **"Access denied"**
   - Check `ALLOWED_EMAIL_DOMAINS` configuration
   - Verify user email domain is allowed

### Debug Mode
Enable debug mode in development:
```bash
NODE_ENV=development
```

## 📊 Monitoring

### Google Cloud Console
- Monitor OAuth usage
- Check for suspicious activity
- Review API quotas

### Application Logs
- Session events are logged
- Authentication failures tracked
- User activity monitored

## 🔄 Updates and Maintenance

### Regular Tasks
- ✅ Rotate secrets quarterly
- ✅ Update dependencies monthly
- ✅ Review OAuth permissions annually
- ✅ Monitor security advisories

### Backup and Recovery
- ✅ Backup environment variables
- ✅ Document OAuth configuration
- ✅ Test authentication flow regularly

---

**🚀 Your Google authentication is now ready for production use!** 