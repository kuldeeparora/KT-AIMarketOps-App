# 🚀 Step-by-Step Deployment Guide

## 📋 **Choose Your Platform**

### **🏆 Vercel (Recommended for Next.js)**
- Best for: Next.js applications
- Database: External (PlanetScale)
- Cost: $0/month
- Deploy time: 5 minutes

### **🌐 Netlify (Alternative to Vercel)**
- Best for: Static sites with serverless functions
- Database: External (PlanetScale)
- Cost: $0/month
- Deploy time: 5 minutes

### **⚡ Render (Full-Stack with Database)**
- Best for: Full-stack applications
- Database: Built-in PostgreSQL
- Cost: $0/month
- Deploy time: 10 minutes

### **🔥 Firebase (Google Ecosystem)**
- Best for: Real-time applications
- Database: Built-in Firestore
- Cost: $0/month
- Deploy time: 8 minutes

---

## 🚀 **Option 1: Vercel Deployment (Recommended)**

### **Step 1: Setup Database (2 minutes)**

1. **Sign up for PlanetScale**
   ```bash
   # Go to https://planetscale.com
   # Create free account
   # Create new database
   # Copy connection string
   ```

2. **Install PlanetScale CLI**
   ```bash
   npm install -g pscale
   ```

3. **Connect to database**
   ```bash
   pscale connect kent-traders-db main --port 3309
   ```

### **Step 2: Configure Environment (1 minute)**

1. **Create environment file**
   ```bash
   # Edit .env.local
   DATABASE_URL="mysql://username:password@host:port/database"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="https://your-domain.vercel.app"
   SELLERDYNAMICS_ENDPOINT="https://login.sellerdynamics.com/api/SellerDynamicsAPI.asmx"
   SELLERDYNAMICS_ENCRYPTED_LOGIN="your-encrypted-login"
   SELLERDYNAMICS_RETAILER_ID="your-retailer-id"
   ```

### **Step 3: Deploy (2 minutes)**

1. **Run deployment script**
   ```bash
   ./scripts/deploy.sh
   ```

2. **Or deploy manually**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

### **Step 4: Configure Production (1 minute)**

1. **Go to Vercel Dashboard**
2. **Add environment variables**
3. **Configure custom domain**
4. **Test functionality**

---

## 🌐 **Option 2: Netlify Deployment**

### **Step 1: Setup Database (2 minutes)**

1. **Sign up for PlanetScale**
   ```bash
   # Go to https://planetscale.com
   # Create free account
   # Create new database
   # Copy connection string
   ```

2. **Install PlanetScale CLI**
   ```bash
   npm install -g pscale
   ```

3. **Connect to database**
   ```bash
   pscale connect kent-traders-db main --port 3309
   ```

### **Step 2: Configure Environment (1 minute)**

1. **Create environment file**
   ```bash
   # Edit .env.local
   DATABASE_URL="mysql://username:password@host:port/database"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="https://your-site.netlify.app"
   SELLERDYNAMICS_ENDPOINT="https://login.sellerdynamics.com/api/SellerDynamicsAPI.asmx"
   SELLERDYNAMICS_ENCRYPTED_LOGIN="your-encrypted-login"
   SELLERDYNAMICS_RETAILER_ID="your-retailer-id"
   ```

### **Step 3: Deploy (2 minutes)**

1. **Run deployment script**
   ```bash
   ./scripts/deploy-netlify.sh
   ```

2. **Or deploy manually**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login to Netlify
   netlify login
   
   # Initialize Netlify
   netlify init
   
   # Deploy
   netlify deploy --prod --dir=.next
   ```

### **Step 4: Configure Production (1 minute)**

1. **Go to Netlify Dashboard**
2. **Add environment variables**
3. **Configure custom domain**
4. **Test functionality**

---

## ⚡ **Option 3: Render Deployment**

### **Step 1: Setup Render Account (2 minutes)**

1. **Sign up for Render**
   ```bash
   # Go to https://render.com
   # Create free account
   # Connect GitHub repository
   ```

2. **Create Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repo
   - Use these settings:
     - **Build Command**: `npm ci && npm run build`
     - **Start Command**: `npm start`
     - **Environment**: Node
     - **Plan**: Free

### **Step 2: Create Database (2 minutes)**

1. **Create PostgreSQL Database**
   - Click "New +"
   - Select "PostgreSQL"
   - Use these settings:
     - **Name**: kent-traders-db
     - **Database**: kent_traders
     - **User**: kent_traders_user
     - **Plan**: Free

2. **Get connection string**
   - Copy the internal database URL
   - Format: `postgresql://user:password@host:port/database`

### **Step 3: Configure Environment (2 minutes)**

1. **Add environment variables in Render**
   ```bash
   DATABASE_URL="postgresql://user:password@host:port/database"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="https://your-app.onrender.com"
   SELLERDYNAMICS_ENDPOINT="https://login.sellerdynamics.com/api/SellerDynamicsAPI.asmx"
   SELLERDYNAMICS_ENCRYPTED_LOGIN="your-encrypted-login"
   SELLERDYNAMICS_RETAILER_ID="your-retailer-id"
   ```

### **Step 4: Deploy (2 minutes)**

1. **Run deployment guide**
   ```bash
   ./scripts/deploy-render.sh
   ```

2. **Deploy automatically**
   - Render will auto-deploy when you push to main branch
   - Or manually deploy from Render dashboard

### **Step 5: Configure Production (2 minutes)**

1. **Wait for deployment to complete**
2. **Test the application**
3. **Configure custom domain**
4. **Set up monitoring**

---

## 🔥 **Option 4: Firebase Deployment**

### **Step 1: Setup Firebase Project (2 minutes)**

1. **Go to Firebase Console**
   ```bash
   # Go to https://console.firebase.google.com
   # Create new project
   # Enable Firestore Database
   # Enable Authentication
   ```

2. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

3. **Login to Firebase**
   ```bash
   firebase login
   ```

### **Step 2: Initialize Firebase (2 minutes)**

1. **Initialize Firebase in project**
   ```bash
   firebase init hosting
   firebase init firestore
   firebase init functions
   ```

2. **Configure Firebase settings**
   - Select your project
   - Use default settings
   - Don't overwrite existing files

### **Step 3: Configure Environment (2 minutes)**

1. **Create environment file**
   ```bash
   # Edit .env.local
   FIREBASE_PROJECT_ID="your-project-id"
   FIREBASE_API_KEY="your-api-key"
   FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   FIREBASE_APP_ID="your-app-id"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="https://your-project.web.app"
   SELLERDYNAMICS_ENDPOINT="https://login.sellerdynamics.com/api/SellerDynamicsAPI.asmx"
   SELLERDYNAMICS_ENCRYPTED_LOGIN="your-encrypted-login"
   SELLERDYNAMICS_RETAILER_ID="your-retailer-id"
   ```

### **Step 4: Deploy (2 minutes)**

1. **Run deployment script**
   ```bash
   ./scripts/deploy-firebase.sh
   ```

2. **Or deploy manually**
   ```bash
   # Deploy hosting
   firebase deploy --only hosting
   
   # Deploy functions
   firebase deploy --only functions
   
   # Deploy Firestore rules
   firebase deploy --only firestore:rules
   ```

### **Step 5: Configure Production (2 minutes)**

1. **Go to Firebase Console**
2. **Configure Authentication providers**
3. **Set up Firestore rules**
4. **Test functionality**

---

## 🧪 **Testing Your Deployment**

### **Step 1: Basic Functionality Test**

1. **Check if site loads**
   ```bash
   # Visit your deployment URL
   # Should see the admin dashboard
   ```

2. **Test authentication**
   - Try to login/logout
   - Check if sessions work

3. **Test inventory functionality**
   - Navigate to inventory pages
   - Check if data loads
   - Test stock updates

### **Step 2: API Endpoints Test**

1. **Test SellerDynamics API**
   ```bash
   curl https://your-domain.com/api/sellerdynamics
   ```

2. **Test update API**
   ```bash
   curl -X POST https://your-domain.com/api/sellerdynamics/update \
     -H "Content-Type: application/json" \
     -d '{"sku":"BG-NBS12","stockLevel":100}'
   ```

### **Step 3: Database Test**

1. **Check database connection**
   ```bash
   # Test with Prisma Studio
   npx prisma studio
   ```

2. **Verify data persistence**
   - Make changes in the app
   - Check if they persist in database

---

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Build Errors**
   ```bash
   # Clear cache and rebuild
   rm -rf .next
   npm run build
   ```

2. **Database Connection Issues**
   ```bash
   # Test database connection
   npx prisma db push
   npx prisma studio
   ```

3. **Environment Variables**
   - Check if all variables are set
   - Verify variable names are correct
   - Restart deployment after changes

4. **Authentication Issues**
   - Check NEXTAUTH_SECRET is set
   - Verify NEXTAUTH_URL is correct
   - Test with different browsers

### **Platform-Specific Issues:**

#### **Vercel**
```bash
# Check deployment logs
vercel logs

# Redeploy
vercel --prod --force
```

#### **Netlify**
```bash
# Check deployment logs
netlify logs

# Redeploy
netlify deploy --prod --dir=.next
```

#### **Render**
```bash
# Check logs in Render dashboard
# Redeploy from dashboard
```

#### **Firebase**
```bash
# Check deployment status
firebase projects:list

# Redeploy
firebase deploy
```

---

## 📊 **Performance Monitoring**

### **Vercel Analytics**
- Built-in performance monitoring
- Automatic error tracking
- Real-time metrics

### **Netlify Analytics**
- Built-in analytics
- Form submissions
- Performance insights

### **Render Monitoring**
- Built-in monitoring
- Log aggregation
- Performance metrics

### **Firebase Analytics**
- Built-in analytics
- User behavior tracking
- Performance monitoring

---

## 🔒 **Security Checklist**

### **✅ Environment Variables**
- [ ] All secrets are in environment variables
- [ ] No secrets in code
- [ ] Variables are encrypted in production

### **✅ Authentication**
- [ ] Login/logout works
- [ ] Sessions are secure
- [ ] Role-based access works

### **✅ Database Security**
- [ ] Database connection is secure
- [ ] SQL injection protection
- [ ] Data encryption at rest

### **✅ API Security**
- [ ] CORS is configured
- [ ] Rate limiting is active
- [ ] Input validation works

---

## 🎉 **Success Checklist**

### **✅ Deployment Complete**
- [ ] Site is live and accessible
- [ ] All pages load correctly
- [ ] No build errors

### **✅ Functionality Working**
- [ ] Authentication works
- [ ] Inventory management works
- [ ] Stock updates work
- [ ] Cost price updates work
- [ ] Vendor information displays

### **✅ Performance Good**
- [ ] Page load time < 3 seconds
- [ ] API response time < 1 second
- [ ] No console errors

### **✅ Security Verified**
- [ ] HTTPS is active
- [ ] Environment variables are set
- [ ] No sensitive data exposed

---

## 📞 **Support Resources**

### **Platform Support:**
- **Vercel**: https://vercel.com/docs
- **Netlify**: https://docs.netlify.com
- **Render**: https://render.com/docs
- **Firebase**: https://firebase.google.com/docs

### **Database Support:**
- **PlanetScale**: https://planetscale.com/docs
- **Firestore**: https://firebase.google.com/docs/firestore

### **Next.js Support:**
- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth.js**: https://next-auth.js.org

---

**🎯 Your deployment is complete! Choose your preferred platform and follow the step-by-step guide above. All platforms offer excellent free tiers with zero ongoing costs!** 