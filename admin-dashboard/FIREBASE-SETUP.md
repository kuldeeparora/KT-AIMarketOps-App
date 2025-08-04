# 🔥 Firebase Setup Guide for Kent Traders Admin Dashboard

## 🎯 **Overview**

This guide will help you set up Firebase for the Kent Traders admin dashboard, providing:
- ✅ **Hosting** - Web application hosting
- ✅ **Authentication** - User management and security
- ✅ **Firestore** - Real-time database
- ✅ **Cloud Functions** - Serverless API
- ✅ **Analytics** - User tracking and insights

---

## 🚀 **Step 1: Create Firebase Project**

### **1.1 Go to Firebase Console**
1. Visit [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `kent-traders-admin`
4. Enable Google Analytics (optional)
5. Click "Create project"

### **1.2 Enable Firebase Services**
In your Firebase project, enable these services:

#### **Authentication**
1. Go to Authentication > Sign-in method
2. Enable Email/Password
3. Add authorized domains

#### **Firestore Database**
1. Go to Firestore Database
2. Click "Create database"
3. Start in production mode
4. Choose a location (e.g., europe-west3)

#### **Hosting**
1. Go to Hosting
2. Click "Get started"
3. Follow the setup wizard

#### **Cloud Functions**
1. Go to Functions
2. Click "Get started"
3. Enable billing (required for Functions)

---

## 🔧 **Step 2: Configure Environment Variables**

### **2.1 Get Firebase Configuration**
1. Go to Project Settings > General
2. Scroll down to "Your apps"
3. Click "Add app" > Web app
4. Register app with name: `kent-traders-admin-web`
5. Copy the configuration

### **2.2 Update .env.local**
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID="kent-traders-admin"
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyC..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="kent-traders-admin.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="kent-traders-admin.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abc123"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"

# Firebase Admin Configuration
FIREBASE_PROJECT_ID="kent-traders-admin"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@kent-traders-admin.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET="kent-traders-admin.appspot.com"

# NextAuth Configuration
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://kent-traders-admin.web.app"

# SellerDynamics Configuration
SELLERDYNAMICS_ENDPOINT="https://login.sellerdynamics.com/api/SellerDynamicsAPI.asmx"
SELLERDYNAMICS_ENCRYPTED_LOGIN="your-encrypted-login"
SELLERDYNAMICS_RETAILER_ID="your-retailer-id"
```

---

## 🔑 **Step 3: Setup Firebase Admin SDK**

### **3.1 Generate Service Account Key**
1. Go to Project Settings > Service accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the values for environment variables

### **3.2 Update Admin Configuration**
Replace the placeholder values in `.env.local`:
```bash
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@kent-traders-admin.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour actual private key\n-----END PRIVATE KEY-----\n"
```

---

## 🗄️ **Step 4: Setup Firestore Database**

### **4.1 Create Collections**
Create these collections in Firestore:

#### **Users Collection**
```javascript
{
  id: "user-id",
  email: "admin@kenttraders.com",
  name: "Admin User",
  role: "ADMIN",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### **Products Collection**
```javascript
{
  id: "product-id",
  sku: "BG-NBS12",
  productName: "BG NBS12 Brushed Steel Light Switch",
  stockLevel: 54,
  costPrice: 3.10,
  sellingPrice: 5.99,
  vendor: "BG",
  category: "Electrical",
  isKit: false,
  reorderPoint: 10,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### **Inventory History Collection**
```javascript
{
  id: "history-id",
  productId: "product-id",
  oldStock: 50,
  newStock: 54,
  changeReason: "Stock update",
  changedBy: "user-id",
  changedAt: timestamp
}
```

### **4.2 Deploy Firestore Rules**
```bash
firebase deploy --only firestore:rules
```

### **4.3 Deploy Firestore Indexes**
```bash
firebase deploy --only firestore:indexes
```

---

## 🚀 **Step 5: Deploy to Firebase**

### **5.1 Install Dependencies**
```bash
npm install
```

### **5.2 Build Application**
```bash
npm run build
```

### **5.3 Deploy to Firebase**
```bash
# Deploy hosting
firebase deploy --only hosting

# Deploy functions
firebase deploy --only functions

# Deploy everything
firebase deploy
```

### **5.4 Automated Deployment**
```bash
./scripts/deploy-firebase.sh
```

---

## 🧪 **Step 6: Testing**

### **6.1 Test Authentication**
1. Visit your Firebase app
2. Test login/logout functionality
3. Verify role-based access

### **6.2 Test Database**
1. Test product listing
2. Test stock updates
3. Test inventory history

### **6.3 Test API Endpoints**
1. Test SellerDynamics API
2. Test update endpoints
3. Verify error handling

---

## 📊 **Step 7: Monitoring & Analytics**

### **7.1 Firebase Analytics**
- Monitor user behavior
- Track page views
- Analyze user engagement

### **7.2 Firebase Performance**
- Monitor app performance
- Track load times
- Identify bottlenecks

### **7.3 Firebase Crashlytics**
- Monitor app crashes
- Get crash reports
- Fix issues quickly

---

## 🔒 **Step 8: Security Configuration**

### **8.1 Authentication Rules**
- Configure sign-in methods
- Set up password requirements
- Enable email verification

### **8.2 Firestore Security**
- Review security rules
- Test access permissions
- Monitor access logs

### **8.3 API Security**
- Secure API endpoints
- Implement rate limiting
- Monitor API usage

---

## 🎯 **Firebase Services Used**

### **✅ Hosting**
- Static file hosting
- Custom domain support
- SSL certificates
- Global CDN

### **✅ Authentication**
- Email/password auth
- Role-based access
- Session management
- Security rules

### **✅ Firestore**
- Real-time database
- Offline support
- Automatic scaling
- Security rules

### **✅ Cloud Functions**
- Serverless API
- Background processing
- Scheduled tasks
- Event-driven functions

### **✅ Analytics**
- User behavior tracking
- Performance monitoring
- Crash reporting
- Custom events

---

## 📋 **Environment Variables Checklist**

### **✅ Required Variables**
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `FIREBASE_CLIENT_EMAIL`
- [ ] `FIREBASE_PRIVATE_KEY`
- [ ] `FIREBASE_STORAGE_BUCKET`
- [ ] `NEXTAUTH_SECRET`
- [ ] `NEXTAUTH_URL`

---

## 🚀 **Deployment Commands**

### **Quick Deploy**
```bash
./scripts/deploy-firebase.sh
```

### **Manual Deploy**
```bash
# Build
npm run build

# Deploy hosting
firebase deploy --only hosting

# Deploy functions
firebase deploy --only functions

# Deploy Firestore
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### **Full Deploy**
```bash
firebase deploy
```

---

## 🎉 **Success Criteria**

### **✅ Application Deployed**
- [ ] Site loads at Firebase URL
- [ ] All pages accessible
- [ ] No console errors

### **✅ Authentication Working**
- [ ] Login/logout functions
- [ ] Role-based access
- [ ] Session persistence

### **✅ Database Connected**
- [ ] Products load from Firestore
- [ ] Stock updates work
- [ ] History tracking active

### **✅ API Endpoints**
- [ ] SellerDynamics API responds
- [ ] Update endpoints work
- [ ] Error handling active

---

**🎯 Your Firebase setup is complete! The admin dashboard is now hosted on Firebase with real-time database, authentication, and analytics!** 