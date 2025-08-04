# 🔥 Firebase Configuration Values Guide

## 📋 **Step-by-Step: Getting Your Firebase Values**

### **Step 1: Web App Configuration**

1. **In Firebase Console**, click the **gear icon** (Project Settings) in top left
2. **Scroll down** to "Your apps" section
3. **Click "Add app"** → **Web** (</> icon)
4. **Register app** with name: "Kent Traders Admin Dashboard"
5. **Copy the config object** - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",                    // ← Copy this
  authDomain: "kent-traders-admin.firebaseapp.com",  // ← Copy this
  projectId: "kent-traders-admin",         // ← Copy this
  storageBucket: "kent-traders-admin.appspot.com",   // ← Copy this
  messagingSenderId: "123456789",          // ← Copy this
  appId: "1:123456789:web:abcdef"         // ← Copy this
};
```

### **Step 2: Service Account (Admin) Configuration**

1. **In Project Settings**, click **"Service accounts"** tab
2. **Click "Generate new private key"**
3. **Download the JSON file**
4. **Open the JSON file** and copy these values:

```json
{
  "type": "service_account",
  "project_id": "kent-traders-admin",
  "private_key_id": "abc123...",          // ← Copy this
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",  // ← Copy this
  "client_email": "firebase-adminsdk-xxxxx@kent-traders-admin.iam.gserviceaccount.com",  // ← Copy this
  "client_id": "123456789",               // ← Copy this
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40kent-traders-admin.iam.gserviceaccount.com"  // ← Copy this
}
```

### **Step 3: Create Your .env.local File**

Create a file called `.env.local` in the `admin-dashboard` directory with:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth Configuration (you'll get these from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Firebase Configuration (Client-side) - from Step 1
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-from-firebase-config
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kent-traders-admin.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kent-traders-admin
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kent-traders-admin.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id-from-firebase-config
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id-from-firebase-config

# Firebase Admin Configuration (Server-side) - from Step 2
FIREBASE_PROJECT_ID=kent-traders-admin
FIREBASE_PRIVATE_KEY_ID=from-service-account-json
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key From Service Account\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@kent-traders-admin.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=from-service-account-json
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40kent-traders-admin.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=kent-traders-admin.appspot.com

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

### **Step 4: Enable Firebase Services**

#### **Authentication**:
1. Click **"Authentication"** in left sidebar
2. Go to **"Sign-in method"** tab
3. Enable **Google** provider
4. Enable **Email/Password** provider
5. Add **localhost** to authorized domains

#### **Storage**:
1. Click **"Storage"** in left sidebar
2. Click **"Get started"**
3. Choose location: **eur3** (same as Firestore)
4. Start in **test mode**

### **Step 5: Test Your Configuration**

Once you've created the `.env.local` file:

```bash
# Test Firebase configuration
curl http://localhost:3001/firebase-test

# Test authentication
curl http://localhost:3001/auth/signin

# Check server status
curl http://localhost:3001
```

---

## 🎯 **What You Need to Do Right Now:**

1. **Get the Web App config** from Project Settings
2. **Create the Service Account** and download JSON
3. **Enable Authentication** and Storage services
4. **Create the `.env.local` file** with your values
5. **Test the configuration**

---

## ✅ **Success Indicators:**

- ✅ Firebase test page shows all green checks
- ✅ Authentication page loads without errors
- ✅ Google sign-in works
- ✅ No console errors in browser
- ✅ Server runs without build errors

**🎉 Once you complete these steps, your Firebase integration will be fully functional!** 