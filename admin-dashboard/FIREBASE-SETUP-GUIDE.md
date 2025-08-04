# 🔥 Firebase Setup Guide for Kent Traders Admin

## ✅ **Your Firebase Project is Ready!**

**Project Name**: `kent-traders-admin`  
**Database**: Cloud Firestore (eur3)  
**Status**: Ready to configure

---

## 📋 **Step-by-Step Setup**

### **Step 1: Get Firebase Configuration**

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `kent-traders-admin`
3. **Go to Project Settings** (gear icon in top left)
4. **Scroll to "Your apps"** section
5. **Click "Add app"** → **Web** (</>)
6. **Register app** with name: "Kent Traders Admin Dashboard"
7. **Copy the config object** that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "kent-traders-admin.firebaseapp.com",
  projectId: "kent-traders-admin",
  storageBucket: "kent-traders-admin.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### **Step 2: Enable Firebase Services**

#### **Authentication**:
1. Go to **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Enable **Email/Password** provider
4. Configure authorized domains if needed

#### **Storage**:
1. Go to **Storage** → **Get started**
2. Choose location: **eur3** (same as Firestore)
3. Start in **test mode** for development

#### **Firestore Rules**:
1. Go to **Firestore Database** → **Rules**
2. Use **test mode** for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Test mode only
    }
  }
}
```

### **Step 3: Create Service Account**

1. Go to **Project Settings** → **Service accounts**
2. Click **"Generate new private key"**
3. Download the JSON file
4. Use the values from this file in your environment variables

### **Step 4: Update Environment Variables**

Create a `.env.local` file in the `admin-dashboard` directory with:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-from-firebase-config
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kent-traders-admin.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kent-traders-admin
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kent-traders-admin.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id-from-firebase-config
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id-from-firebase-config

# Firebase Admin Configuration (Server-side)
FIREBASE_PROJECT_ID=kent-traders-admin
FIREBASE_PRIVATE_KEY_ID=from-service-account-json
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key From Service Account\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@kent-traders-admin.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=from-service-account-json
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40kent-traders-admin.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=kent-traders-admin.appspot.com

# Other configurations...
```

### **Step 5: Test Your Setup**

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test Firebase Configuration**:
   - Go to: http://localhost:3001/firebase-test
   - Check all services are working

3. **Test Authentication**:
   - Go to: http://localhost:3001/auth/signin
   - Try Google sign-in

---

## 🔧 **Configuration Values You Need**

### **From Firebase Web App Config**:
- `apiKey`: Your Firebase API key
- `authDomain`: `kent-traders-admin.firebaseapp.com`
- `projectId`: `kent-traders-admin`
- `storageBucket`: `kent-traders-admin.appspot.com`
- `messagingSenderId`: Your sender ID
- `appId`: Your app ID

### **From Service Account JSON**:
- `private_key_id`: From the JSON file
- `private_key`: From the JSON file (with \n for line breaks)
- `client_email`: From the JSON file
- `client_id`: From the JSON file

### **From Google OAuth**:
- `GOOGLE_CLIENT_ID`: From Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: From Google Cloud Console

---

## 🚀 **Quick Test Commands**

Once configured, test with:

```bash
# Test Firebase connection
curl http://localhost:3001/firebase-test

# Test authentication
curl http://localhost:3001/auth/signin

# Check server status
curl http://localhost:3001
```

---

## 📞 **Need Help?**

If you encounter issues:

1. **Check Firebase Console** for any service errors
2. **Verify environment variables** are correctly set
3. **Check browser console** for JavaScript errors
4. **Review server logs** for backend errors

---

## ✅ **Success Indicators**

Your setup is complete when:

- ✅ Firebase test page shows all green checks
- ✅ Authentication page loads without errors
- ✅ Google sign-in works
- ✅ No console errors in browser
- ✅ Server runs without build errors

**🎉 Your Firebase integration will be fully functional!** 