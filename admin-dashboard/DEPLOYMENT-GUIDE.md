# 🚀 AIMarketOps Deployment Guide

## Pre-Deployment Checklist

✅ **Code Quality**
- [x] All tests passing
- [x] No linting errors 
- [x] Build completes successfully
- [x] Health check endpoint working

✅ **Environment Variables Required**
```bash
NEXT_PUBLIC_BASE_URL=https://your-domain.com
SELLERDYNAMICS_API_URL=https://inventory.sellerdynamics.com/api
SELLERDYNAMICS_API_KEY=your_api_key
SELLERDYNAMICS_RETAILER_ID=your_retailer_id
SELLERDYNAMICS_LOGIN=your_login
SELLERDYNAMICS_PASSWORD=your_password
SHOPIFY_SHOP=your-shop.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_shopify_access_token_here
```

---

## 🔧 Platform-Specific Deployments

### 1️⃣ Vercel Deployment

**Prerequisites:**
```bash
npm install -g vercel
vercel login
```

**Quick Deploy:**
```bash
cd admin-dashboard
npm run deploy:vercel
```

**Manual Deploy:**
```bash
vercel --prod
```

**Environment Variables Setup:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all required environment variables
3. Redeploy to apply changes

**Configuration:**
- ✅ `vercel.json` configured
- ✅ API routes optimized
- ✅ Static assets cached
- ✅ Cron jobs for data sync

### 2️⃣ Render Deployment

**Prerequisites:**
1. Push code to GitHub/GitLab
2. Connect repository to Render

**Configuration:**
- ✅ `render.yaml` configured
- ✅ PostgreSQL database setup
- ✅ Persistent disk for cache data
- ✅ Auto-deploy on git push

**Steps:**
1. Create new Web Service on Render
2. Connect your repository
3. Use `admin-dashboard` as root directory
4. Set build command: `npm ci && npm run build`
5. Set start command: `npm start`
6. Add environment variables in Render dashboard
7. Deploy

**Database Setup:**
- PostgreSQL instance will be created automatically
- Connection string provided as `DATABASE_URL`

### 3️⃣ Firebase Deployment

**Prerequisites:**
```bash
npm install -g firebase-tools
firebase login
firebase init
```

**Quick Deploy:**
```bash
cd admin-dashboard
npm run deploy:firebase
```

**Manual Deploy:**
```bash
# Build for static export
npm run build
firebase deploy
```

**Configuration:**
- ✅ `firebase.json` configured
- ✅ Static hosting optimized
- ✅ Cloud Functions for API routes
- ✅ Firestore for data persistence

**Firebase Project Setup:**
1. Create Firebase project
2. Enable Hosting and Functions
3. Configure `firebase.json`
4. Set environment variables with `firebase functions:config:set`

---

## 🧪 Testing Deployments

### Health Check
Test each deployment:
```bash
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-20T12:00:00.000Z",
    "version": "1.0.0",
    "checks": {
      "api": "healthy",
      "database": "healthy"
    }
  }
}
```

### API Endpoints Test
```bash
# Test inventory API
curl https://your-domain.com/api/inventory/unified?limit=5

# Test Shopify filtering
curl https://your-domain.com/api/inventory/unified?source=Shopify&limit=5

# Test dashboard stats
curl https://your-domain.com/api/dashboard-stats
```

---

## 📊 Performance Optimization

### Caching Strategy
- ✅ 5-minute API response cache
- ✅ Static asset caching (1 year)
- ✅ CDN optimization
- ✅ Database query optimization

### Monitoring
- Health check endpoint: `/api/health`
- Performance metrics: Built-in Next.js analytics
- Error tracking: Console logging
- Uptime monitoring: Platform-specific

---

## 🔧 Deployment Commands

### All Platforms
```bash
# Deploy to all platforms
npm run deploy:production

# Deploy to specific platform
npm run deploy:vercel
npm run deploy:render  
npm run deploy:firebase
```

### Manual Deployment
```bash
# 1. Build and test locally
npm run build
npm start

# 2. Test health endpoint
curl http://localhost:3001/api/health

# 3. Deploy to platforms
vercel --prod                    # Vercel
git push origin main             # Render (auto-deploy)
firebase deploy                  # Firebase
```

---

## 🚨 Troubleshooting

### Common Issues

**Build Errors:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules/.cache
npm ci
npm run build
```

**Environment Variables:**
- Ensure all required vars are set on each platform
- Use platform-specific configuration methods
- Test with health endpoint

**API Timeouts:**
- Increase function timeout limits
- Optimize database queries
- Use caching effectively

**CORS Issues:**
- Configure CORS headers in next.config.js
- Ensure API routes handle preflight requests

### Platform-Specific Issues

**Vercel:**
- Function timeout: Increase in vercel.json
- Build size: Optimize dependencies
- Cold starts: Use edge functions where possible

**Render:**
- Disk space: Monitor persistent disk usage
- Memory: Upgrade plan if needed
- Database: Check connection strings

**Firebase:**
- Function limits: Monitor execution time
- Hosting: Check routing configuration
- Billing: Monitor usage quotas

---

## 📋 Post-Deployment Checklist

- [ ] All URLs responding correctly
- [ ] Health check passes on all platforms
- [ ] API endpoints working
- [ ] Authentication functioning
- [ ] Database connections established
- [ ] Environment variables configured
- [ ] SSL certificates valid
- [ ] Performance monitoring active
- [ ] Error tracking operational
- [ ] Backup systems configured

---

## 🔗 Deployment URLs

After successful deployment, update these URLs:

- **Vercel**: `https://your-app.vercel.app`
- **Render**: `https://your-app.onrender.com`  
- **Firebase**: `https://your-project.web.app`

---

## 📞 Support

For deployment issues:
1. Check platform-specific logs
2. Verify environment variables
3. Test health endpoint
4. Review build output
5. Contact platform support if needed

**Happy Deploying! 🚀** 