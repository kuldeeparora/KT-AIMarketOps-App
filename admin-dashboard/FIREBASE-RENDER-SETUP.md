# 🔥 Firebase + Render PostgreSQL Setup Guide

## 🎯 **Recommended Architecture**

### **Firebase Services:**
- ✅ **Hosting** - Web application
- ✅ **Authentication** - User management
- ✅ **Firestore** - Real-time data
- ✅ **Cloud Functions** - Serverless API
- ✅ **Analytics** - User tracking

### **Render Services:**
- ✅ **PostgreSQL Database** - Primary data storage
- ✅ **Redis Cache** - Performance optimization
- ✅ **Background Jobs** - Data processing

---

## 🚀 **Step 1: Firebase Project Setup**

### **1.1 Create Firebase Project**
```bash
# Go to https://console.firebase.google.com
# Create new project: "kent-traders-admin"
# Enable Google Analytics
```

### **1.2 Enable Firebase Services**
```bash
# Enable these services in Firebase Console:
# - Authentication (Email/Password)
# - Firestore Database
# - Cloud Functions
# - Hosting
```

### **1.3 Install Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
firebase projects:list
```

---

## 🗄️ **Step 2: Render PostgreSQL Setup**

### **2.1 Create Render Account**
```bash
# Go to https://render.com
# Sign up with GitHub
# Connect your repository
```

### **2.2 Create PostgreSQL Database**
```bash
# In Render Dashboard:
# 1. Click "New +"
# 2. Select "PostgreSQL"
# 3. Configure:
#    - Name: kent-traders-db
#    - Database: kent_traders
#    - User: kent_traders_user
#    - Plan: Free
```

### **2.3 Get Database Connection**
```bash
# Copy the internal database URL
# Format: postgresql://user:password@host:port/database
# Example: postgresql://kent_traders_user:abc123@dpg-xyz123-a.frankfurt-postgres.render.com/kent_traders
```

---

## ⚙️ **Step 3: Configure Environment Variables**

### **3.1 Firebase Configuration**
```bash
# Get from Firebase Console > Project Settings > General
FIREBASE_PROJECT_ID="kent-traders-admin"
FIREBASE_API_KEY="AIzaSyC..."
FIREBASE_AUTH_DOMAIN="kent-traders-admin.firebaseapp.com"
FIREBASE_STORAGE_BUCKET="kent-traders-admin.appspot.com"
FIREBASE_MESSAGING_SENDER_ID="123456789"
FIREBASE_APP_ID="1:123456789:web:abc123"
```

### **3.2 Render Database Configuration**
```bash
# From Render PostgreSQL dashboard
DATABASE_URL="postgresql://kent_traders_user:password@dpg-xyz123-a.frankfurt-postgres.render.com/kent_traders"
```

### **3.3 NextAuth Configuration**
```bash
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://kent-traders-admin.web.app"
```

### **3.4 SellerDynamics Configuration**
```bash
SELLERDYNAMICS_ENDPOINT="https://login.sellerdynamics.com/api/SellerDynamicsAPI.asmx"
SELLERDYNAMICS_ENCRYPTED_LOGIN="your-encrypted-login"
SELLERDYNAMICS_RETAILER_ID="your-retailer-id"
```

---

## 🔧 **Step 4: Update Prisma Schema for PostgreSQL**

### **4.1 Update schema.prisma**
```prisma
// Update your schema.prisma file
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Your existing models remain the same
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String?
  role      Role     @default(VIEWER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  inventoryHistory InventoryHistory[]

  @@map("users")
}

model Product {
  id           String   @id @default(cuid())
  sku          String   @unique
  productName  String
  stockLevel   Int      @default(0)
  costPrice    Decimal  @default(0) @db.Decimal(10, 2)
  sellingPrice Decimal  @default(0) @db.Decimal(10, 2)
  vendor       String?
  category     String?
  isKit        Boolean  @default(false)
  reorderPoint Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  inventoryHistory InventoryHistory[]

  @@map("products")
}

model InventoryHistory {
  id           Int      @id @default(autoincrement())
  productId    String
  oldStock     Int?
  newStock     Int?
  changeReason String?
  changedBy    String?
  changedAt    DateTime @default(now())

  // Relations
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  user    User?  @relation(fields: [changedBy], references: [id])

  @@map("inventory_history")
}

model SellerDynamicsProduct {
  id           String   @id @default(cuid())
  sku          String   @unique
  productName  String
  stockLevel   Int      @default(0)
  costPrice    Decimal  @default(0) @db.Decimal(10, 2)
  vendor       String?
  category     String?
  isKit        Boolean  @default(false)
  goodId       String?
  reorderPoint Int      @default(0)
  lastUpdated  DateTime @default(now())
  createdAt    DateTime @default(now())

  @@map("sellerdynamics_products")
}

enum Role {
  ADMIN
  MANAGER
  VIEWER
}
```

### **4.2 Update package.json**
```json
{
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "prisma": "^5.0.0",
    "firebase": "^10.0.0",
    "firebase-admin": "^12.0.0"
  }
}
```

---

## 🚀 **Step 5: Deploy to Firebase**

### **5.1 Initialize Firebase**
```bash
# In your project directory
firebase init hosting
firebase init firestore
firebase init functions
```

### **5.2 Configure Firebase Settings**
```bash
# Select your project
# Use default settings
# Don't overwrite existing files
```

### **5.3 Deploy to Firebase**
```bash
# Deploy hosting
firebase deploy --only hosting

# Deploy functions
firebase deploy --only functions

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

---

## 🗄️ **Step 6: Setup Render Database**

### **6.1 Deploy Database Schema**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to Render PostgreSQL
npx prisma db push

# Verify connection
npx prisma studio
```

### **6.2 Create Initial Data**
```sql
-- Connect to your Render PostgreSQL database
-- Run these commands:

-- Create admin user
INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  'admin-001',
  'admin@kenttraders.com',
  'Admin User',
  '$2a$10$hashedpassword',
  'ADMIN',
  NOW(),
  NOW()
);

-- Create sample products
INSERT INTO products (id, sku, "productName", "stockLevel", "costPrice", "sellingPrice", vendor, category, "isKit", "reorderPoint", "createdAt", "updatedAt")
VALUES 
  ('prod-001', 'BG-NBS12', 'BG NBS12 Brushed Steel Light Switch', 54, 3.10, 5.99, 'BG', 'Electrical', false, 10, NOW(), NOW()),
  ('prod-002', 'BG-NBS13', 'BG NBS13 Brushed Steel Light Switch', 32, 3.15, 6.49, 'BG', 'Electrical', false, 10, NOW(), NOW());
```

---

## 🔧 **Step 7: Update API Routes for Firebase + PostgreSQL**

### **7.1 Update Database Connection**
```javascript
// lib/prisma.js
import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
```

### **7.2 Update Authentication for Firebase**
```javascript
// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (user && await bcrypt.compare(credentials.password, user.password)) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role
            };
          }
          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/auth/signout'
  },
  secret: process.env.NEXTAUTH_SECRET,
});
```

---

## 🧪 **Step 8: Testing Your Setup**

### **8.1 Test Database Connection**
```bash
# Test Prisma connection
npx prisma studio

# Test API endpoints
curl https://your-firebase-app.web.app/api/sellerdynamics
```

### **8.2 Test Authentication**
```bash
# Test login/logout
# Verify sessions work
# Check role-based access
```

### **8.3 Test Inventory Management**
```bash
# Test product listing
# Test stock updates
# Test cost price updates
# Test vendor information
```

---

## 📊 **Step 9: Monitoring & Analytics**

### **9.1 Firebase Analytics**
```javascript
// Add to your app
import { getAnalytics } from 'firebase/analytics';

const analytics = getAnalytics(app);
```

### **9.2 Render Database Monitoring**
- Monitor database performance in Render dashboard
- Set up alerts for high usage
- Check connection pool status

### **9.3 Error Tracking**
```javascript
// Add Sentry for error tracking
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: process.env.NODE_ENV,
});
```

---

## 🔒 **Step 10: Security Configuration**

### **10.1 Firebase Security Rules**
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
    }
    
    match /products/{productId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN' ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'MANAGER'
      );
    }
  }
}
```

### **10.2 Environment Variables Security**
```bash
# In Firebase Console > Functions > Configuration
# Add all environment variables securely
```

---

## 🎯 **Final Configuration Summary**

### **✅ Firebase Services:**
- Hosting: `https://kent-traders-admin.web.app`
- Authentication: Email/Password
- Firestore: Real-time data
- Functions: Serverless API
- Analytics: User tracking

### **✅ Render Services:**
- PostgreSQL: Primary database
- Connection: `postgresql://user:pass@host:port/db`
- Monitoring: Built-in dashboard

### **✅ Environment Variables:**
```bash
# Firebase
FIREBASE_PROJECT_ID="kent-traders-admin"
FIREBASE_API_KEY="your-api-key"
FIREBASE_AUTH_DOMAIN="kent-traders-admin.firebaseapp.com"
FIREBASE_STORAGE_BUCKET="kent-traders-admin.appspot.com"
FIREBASE_MESSAGING_SENDER_ID="123456789"
FIREBASE_APP_ID="1:123456789:web:abc123"

# Database
DATABASE_URL="postgresql://user:pass@host:port/db"

# NextAuth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="https://kent-traders-admin.web.app"

# SellerDynamics
SELLERDYNAMICS_ENDPOINT="https://login.sellerdynamics.com/api/SellerDynamicsAPI.asmx"
SELLERDYNAMICS_ENCRYPTED_LOGIN="your-login"
SELLERDYNAMICS_RETAILER_ID="your-id"
```

---

## 🚀 **Deploy Commands**

### **Firebase Deployment:**
```bash
# Deploy everything
firebase deploy

# Or deploy specific services
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
```

### **Database Setup:**
```bash
# Setup database
npx prisma generate
npx prisma db push
npx prisma studio
```

---

**🎯 Your Firebase + Render PostgreSQL setup is complete! This gives you the best of both worlds: Firebase's excellent hosting and real-time features with Render's robust PostgreSQL database.** 