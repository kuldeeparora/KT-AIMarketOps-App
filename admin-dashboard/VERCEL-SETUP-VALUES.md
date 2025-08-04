# 🚀 Vercel Setup Values for Kent Traders

## 📋 **Fill These Values in Vercel:**

### **Project Settings:**
```
Project Name: kent-traders
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### **Environment Variables:**
```
Key: DATABASE_URL
Value: postgresql://kent_traders_user:password@dpg-xyz123-a.frankfurt-postgres.render.com/kent_traders

Key: NEXTAUTH_SECRET
Value: your-super-secret-key-here-make-it-long-and-random

Key: NEXTAUTH_URL
Value: https://kent-traders.vercel.app

Key: SELLERDYNAMICS_ENDPOINT
Value: https://login.sellerdynamics.com/api/SellerDynamicsAPI.asmx

Key: SELLERDYNAMICS_ENCRYPTED_LOGIN
Value: your-encrypted-login-from-sellerdynamics

Key: SELLERDYNAMICS_RETAILER_ID
Value: your-retailer-id-from-sellerdynamics
```

---

## 🔧 **Step-by-Step Setup:**

### **1. Project Configuration:**
- ✅ **Project Name**: `kent-traders`
- ✅ **Framework Preset**: `Next.js` (should auto-detect)
- ✅ **Root Directory**: `./` (leave as default)
- ✅ **Build Command**: `npm run build` (should auto-detect)
- ✅ **Output Directory**: `.next` (should auto-detect)
- ✅ **Install Command**: `npm install` (should auto-detect)

### **2. Environment Variables:**
Click "Add" for each environment variable:

#### **Database Configuration:**
```
Key: DATABASE_URL
Value: postgresql://kent_traders_user:password@dpg-xyz123-a.frankfurt-postgres.render.com/kent_traders
```

#### **Authentication Configuration:**
```
Key: NEXTAUTH_SECRET
Value: your-super-secret-key-here-make-it-long-and-random
```

```
Key: NEXTAUTH_URL
Value: https://kent-traders.vercel.app
```

#### **SellerDynamics Configuration:**
```
Key: SELLERDYNAMICS_ENDPOINT
Value: https://login.sellerdynamics.com/api/SellerDynamicsAPI.asmx
```

```
Key: SELLERDYNAMICS_ENCRYPTED_LOGIN
Value: your-encrypted-login-from-sellerdynamics
```

```
Key: SELLERDYNAMICS_RETAILER_ID
Value: your-retailer-id-from-sellerdynamics
```

---

## 🗄️ **Database Setup Required:**

### **Before deploying, you need to:**

1. **Create Render PostgreSQL Database:**
   - Go to https://render.com
   - Create PostgreSQL database
   - Copy the connection string
   - Replace the DATABASE_URL value above

2. **Generate NEXTAUTH_SECRET:**
   ```bash
   # Generate a secure secret
   openssl rand -base64 32
   ```

3. **Get SellerDynamics Credentials:**
   - Contact your SellerDynamics provider
   - Get encrypted login and retailer ID
   - Update the environment variables

---

## 🚀 **Deploy Button:**

After filling all values, click:
```
[Deploy]
```

---

## 📊 **Expected Deployment:**

### **Build Process:**
1. ✅ Install dependencies
2. ✅ Run build command
3. ✅ Deploy to Vercel
4. ✅ Set up environment variables
5. ✅ Configure database connection

### **Deployment URL:**
```
https://kent-traders.vercel.app
```

---

## 🧪 **Post-Deployment Testing:**

### **1. Check if site loads:**
```
https://kent-traders.vercel.app
```

### **2. Test authentication:**
- Try to login/logout
- Check if sessions work

### **3. Test inventory management:**
- Navigate to inventory pages
- Check if data loads
- Test stock updates

### **4. Test API endpoints:**
```bash
curl https://kent-traders.vercel.app/api/sellerdynamics
```

---

## 🔧 **Troubleshooting:**

### **If build fails:**
1. Check environment variables are set
2. Verify DATABASE_URL is correct
3. Ensure all required variables are present

### **If site doesn't load:**
1. Check deployment logs in Vercel dashboard
2. Verify environment variables
3. Test database connection

### **If authentication doesn't work:**
1. Check NEXTAUTH_SECRET is set
2. Verify NEXTAUTH_URL is correct
3. Test with different browsers

---

## 📞 **Support:**

### **Vercel Dashboard:**
- Go to https://vercel.com/dashboard
- Select your project
- Check deployment logs
- Configure custom domain

### **Environment Variables:**
- Can be updated anytime in Vercel dashboard
- Changes require redeployment
- Test after each change

---

**🎯 Once you fill these values and click Deploy, your Kent Traders admin dashboard will be live at https://kent-traders.vercel.app!** 