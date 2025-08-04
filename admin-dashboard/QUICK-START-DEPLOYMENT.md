# 🚀 Quick Start Deployment Guide

## ⚡ **Deploy in 5 Minutes**

### **Step 1: Setup Database (2 minutes)**

1. **Sign up for PlanetScale** (free tier)
   - Go to [planetscale.com](https://planetscale.com)
   - Create account and new database
   - Copy connection string

2. **Update environment variables**
   ```bash
   # Edit .env.local
   DATABASE_URL="mysql://username:password@host:port/database"
   ```

### **Step 2: Deploy to Vercel (2 minutes)**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### **Step 3: Configure Environment (1 minute)**

1. **Go to Vercel Dashboard**
2. **Add environment variables:**
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `SELLERDYNAMICS_ENDPOINT`
   - `SELLERDYNAMICS_ENCRYPTED_LOGIN`
   - `SELLERDYNAMICS_RETAILER_ID`

---

## 🎯 **One-Command Deployment**

```bash
# Run the automated deployment script
./scripts/deploy.sh
```

This script will:
- ✅ Check dependencies
- ✅ Install packages
- ✅ Run tests
- ✅ Build application
- ✅ Setup database
- ✅ Deploy to Vercel

---

## 📋 **Manual Deployment Steps**

### **1. Database Setup**
```bash
# Install Prisma
npm install prisma @prisma/client

# Generate client
npx prisma generate

# Push schema
npx prisma db push
```

### **2. Build & Deploy**
```bash
# Install dependencies
npm ci

# Run tests
npm test

# Build application
npm run build

# Deploy to Vercel
vercel --prod
```

### **3. Environment Configuration**
```bash
# Set environment variables in Vercel
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
```

---

## 🔧 **Required Environment Variables**

```bash
# Database
DATABASE_URL="mysql://username:password@host:port/database"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.vercel.app"

# SellerDynamics
SELLERDYNAMICS_ENDPOINT="https://login.sellerdynamics.com/api/SellerDynamicsAPI.asmx"
SELLERDYNAMICS_ENCRYPTED_LOGIN="your-encrypted-login"
SELLERDYNAMICS_RETAILER_ID="your-retailer-id"
```

---

## 🎉 **Success Checklist**

- [ ] Database connected and working
- [ ] Application deployed to Vercel
- [ ] Environment variables configured
- [ ] Authentication working
- [ ] Inventory sync functional
- [ ] Stock updates working
- [ ] Cost price updates working
- [ ] Vendor information displaying

---

## 🆘 **Troubleshooting**

### **Database Connection Issues**
```bash
# Test database connection
npx prisma db push --preview-feature

# Check connection
npx prisma studio
```

### **Build Errors**
```bash
# Clear cache
rm -rf .next
npm run build
```

### **Deployment Issues**
```bash
# Check Vercel logs
vercel logs

# Redeploy
vercel --prod --force
```

---

## 📞 **Support**

- **GitHub Issues**: Bug reports and feature requests
- **Vercel Support**: Platform-specific issues
- **Documentation**: See `DEPLOYMENT-PLAN.md` for detailed guide

---

**🎯 Your app will be live at: `https://your-domain.vercel.app`** 