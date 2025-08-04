#!/bin/bash
# security-audit.sh - Comprehensive Security & Auth Audit

echo "🔒 KENT TRADERS SECURITY & AUTHENTICATION AUDIT"
echo "================================================="

echo ""
echo "1. 🔍 AUTHENTICATION CONFIGURATION AUDIT:"
echo "-------------------------------------------"

# Check NextAuth configuration
if [ -f "pages/api/auth/[...nextauth].ts" ] || [ -f "pages/api/auth/[...nextauth].js" ]; then
    echo "✅ NextAuth endpoint found"
else
    echo "❌ NextAuth endpoint missing - CRITICAL SECURITY ISSUE"
fi

# Check Google OAuth configuration
if grep -q "GOOGLE_CLIENT_ID" .env.local; then
    echo "✅ Google OAuth client ID configured"
else
    echo "❌ Google OAuth not configured"
fi

if grep -q "GOOGLE_CLIENT_SECRET" .env.local; then
    echo "✅ Google OAuth client secret configured"
else
    echo "❌ Google OAuth client secret missing"
fi

# Check NextAuth Secret
if grep -q "NEXTAUTH_SECRET" .env.local; then
    echo "✅ NextAuth secret configured"
else
    echo "❌ NextAuth secret missing - CRITICAL SECURITY ISSUE"
fi

# Check NEXTAUTH_URL for production
if grep -q "NEXTAUTH_URL.*vercel.app" .env.local || grep -q "NEXTAUTH_URL.*kent-traders" .env.local; then
    echo "✅ NextAuth URL configured for production"
else
    echo "⚠️  NextAuth URL might not be configured for production"
fi

echo ""
echo "2. 🛡️ API SECURITY AUDIT:"
echo "-------------------------"

# Check for API rate limiting
echo "🔍 Checking API rate limiting..."
if grep -r "rate.*limit" pages/api/ 2>/dev/null; then
    echo "✅ Rate limiting found in some APIs"
else
    echo "❌ No rate limiting detected - SECURITY RISK"
fi

# Check for input validation
echo "🔍 Checking input validation..."
if grep -r "validation\|validate\|joi\|yup\|zod" pages/api/ 2>/dev/null | head -3; then
    echo "✅ Input validation found in some APIs"
else
    echo "❌ Limited input validation - SECURITY RISK"
fi

# Check for CORS configuration
echo "🔍 Checking CORS configuration..."
if grep -r "Access-Control-Allow" pages/api/ 2>/dev/null | head -3; then
    echo "✅ CORS headers configured"
else
    echo "❌ CORS not properly configured"
fi

echo ""
echo "3. 📊 SELLERDYNAMICS INTEGRATION AUDIT:"
echo "---------------------------------------"

# Check SellerDynamics credentials
if grep -q "SELLERDYNAMICS_RETAILER_ID" .env.local; then
    echo "✅ SellerDynamics Retailer ID configured"
else
    echo "❌ SellerDynamics Retailer ID missing"
fi

if grep -q "SELLERDYNAMICS_ENCRYPTED_LOGIN" .env.local; then
    echo "✅ SellerDynamics encrypted login configured"
else
    echo "❌ SellerDynamics encrypted login missing"
fi

# Check API endpoint
echo "🔍 Testing SellerDynamics API endpoint..."
if curl -s --connect-timeout 5 "https://login.sellerdynamics.com/api/SellerDynamicsAPI.asmx" | grep -q "soap"; then
    echo "✅ SellerDynamics SOAP endpoint reachable"
else
    echo "❌ SellerDynamics SOAP endpoint unreachable"
fi

echo ""
echo "4. 🔐 ENVIRONMENT SECURITY AUDIT:"
echo "---------------------------------"

# Check for sensitive data exposure
echo "🔍 Checking for exposed secrets..."
if grep -q "your-.*-key\|test.*password\|placeholder" .env.local; then
    echo "⚠️  Found placeholder values in environment"
fi

# Check Firebase security
if grep -q "FIREBASE_PRIVATE_KEY.*BEGIN PRIVATE KEY" .env.local; then
    echo "✅ Firebase private key configured"
else
    echo "❌ Firebase private key not properly configured"
fi

echo ""
echo "5. 🌐 PRODUCTION DEPLOYMENT AUDIT:"
echo "----------------------------------"

# Check Vercel configuration
if [ -f "vercel.json" ]; then
    echo "✅ Vercel configuration found"
    if grep -q "env" vercel.json; then
        echo "✅ Environment variables configured in Vercel"
    else
        echo "⚠️  Environment variables might not be set in Vercel"
    fi
else
    echo "❌ Vercel configuration missing"
fi

echo ""
echo "6. 🎯 RECOMMENDATIONS:"
echo "---------------------"
echo "🔒 HIGH PRIORITY SECURITY FIXES:"
echo "   1. Implement Google OAuth with NextAuth"
echo "   2. Add API rate limiting middleware"
echo "   3. Implement comprehensive input validation"
echo "   4. Set up HTTPS redirects and security headers"
echo "   5. Configure session management and CSRF protection"
echo ""
echo "📊 SELLERDYNAMICS FIXES:"
echo "   1. Verify SellerDynamics API credentials in production"
echo "   2. Test API connectivity from Vercel environment"
echo "   3. Implement error handling and retry logic"
echo "   4. Add data validation for SellerDynamics responses"
echo ""
echo "🚀 PRODUCTION DEPLOYMENT:"
echo "   1. Set all environment variables in Vercel"
echo "   2. Configure custom domain with SSL"
echo "   3. Set up monitoring and logging"
echo "   4. Implement backup and recovery procedures"
