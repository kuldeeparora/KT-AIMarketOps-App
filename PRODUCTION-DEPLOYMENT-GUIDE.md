# Production Deployment Guide for KT-AIMarketOps

## Overview
This guide covers deploying KT-AIMarketOps to production on both Vercel and Firebase.

## Project Configuration

### Firebase Project Details
- **Project ID**: `kt-aimarketops`
- **Project Name**: KT-AIMarketOps
- **Hosting Domain**: `kt-aimarketops.firebaseapp.com`

### Vercel Project Details
- **Project Name**: `kt-aimarketops`
- **Domain**: `kt-aimarketops.vercel.app`

## Deployment Steps

### 1. Firebase Production Setup
```bash
cd admin-dashboard
firebase login
firebase use kt-aimarketops
firebase deploy
```

### 2. Vercel Production Setup
```bash
# From root directory
vercel --prod
```

### 3. Environment Variables Setup

#### Vercel Environment Variables
Set these in your Vercel dashboard:
- `NEXT_PUBLIC_API_URL`: https://kt-aimarketops.vercel.app/api
- `NEXTAUTH_URL`: https://kt-aimarketops.vercel.app
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: kt-aimarketops.firebaseapp.com
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: kt-aimarketops
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: kt-aimarketops.appspot.com

#### Firebase Environment Variables
Set these in your Firebase project settings:
- `FIREBASE_PROJECT_ID`: kt-aimarketops
- `FIREBASE_STORAGE_BUCKET`: kt-aimarketops.appspot.com

## Production URLs

### Vercel
- **Production**: https://kt-aimarketops.vercel.app
- **Preview**: https://kt-aimarketops-git-[branch]-[username].vercel.app

### Firebase
- **Production**: https://kt-aimarketops.firebaseapp.com
- **Custom Domain**: (if configured)

## Monitoring

### Vercel
- Analytics: https://vercel.com/analytics
- Functions: https://vercel.com/functions
- Logs: https://vercel.com/logs

### Firebase
- Console: https://console.firebase.google.com/project/kt-aimarketops
- Analytics: https://console.firebase.google.com/project/kt-aimarketops/analytics
- Performance: https://console.firebase.google.com/project/kt-aimarketops/performance

## Troubleshooting

### Common Issues
1. **Build failures**: Check Node.js version and dependencies
2. **Environment variables**: Verify all required variables are set
3. **Domain issues**: Check DNS configuration
4. **Authentication**: Verify Firebase Auth configuration

### Support
- Vercel: https://vercel.com/support
- Firebase: https://firebase.google.com/support 