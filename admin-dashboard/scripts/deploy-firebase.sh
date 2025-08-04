#!/bin/bash

# 🔥 Firebase Deployment Script for Kent Traders Admin Dashboard

set -e

echo "🔥 Starting Firebase deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check dependencies
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    
    if ! command -v firebase &> /dev/null; then
        print_status "Installing Firebase CLI..."
        npm install -g firebase-tools
    fi
    
    print_success "All dependencies are installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm ci
    print_success "Dependencies installed"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    npm test -- --coverage --watchAll=false
    print_success "Tests passed"
}

# Run linting
run_lint() {
    print_status "Running linting..."
    npm run lint:eslint
    print_success "Linting passed"
}

# Build application
build_app() {
    print_status "Building application..."
    npm run build
    print_success "Application built successfully"
}

# Setup environment variables
setup_env() {
    print_status "Setting up environment variables..."
    
    if [ ! -f .env.local ]; then
        print_warning "Creating .env.local file..."
        cat > .env.local << EOF
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID="kent-traders-admin"
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
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
EOF
        print_warning "Please update .env.local with your actual values"
    else
        print_success "Environment file already exists"
    fi
}

# Initialize Firebase
init_firebase() {
    print_status "Initializing Firebase..."
    
    # Check if logged in to Firebase
    if ! firebase projects:list &> /dev/null; then
        print_warning "Please login to Firebase first: firebase login"
        exit 1
    fi
    
    # Initialize Firebase if not already done
    if [ ! -f .firebaserc ]; then
        print_status "Initializing Firebase project..."
        firebase init hosting
        firebase init firestore
        firebase init functions
    fi
    
    print_success "Firebase initialized"
}

# Deploy to Firebase
deploy_firebase() {
    print_status "Deploying to Firebase..."
    
    # Deploy hosting
    firebase deploy --only hosting
    
    # Deploy functions
    firebase deploy --only functions
    
    # Deploy Firestore rules
    firebase deploy --only firestore:rules
    
    # Deploy Firestore indexes
    firebase deploy --only firestore:indexes
    
    print_success "Deployed to Firebase successfully"
    
    # Get the deployment URL
    DEPLOY_URL=$(firebase hosting:channel:list --json | jq -r '.result.channels[0].url')
    print_success "Your site is live at: $DEPLOY_URL"
}

# Setup Firestore
setup_firestore() {
    print_status "Setting up Firestore..."
    
    # Deploy Firestore rules
    firebase deploy --only firestore:rules
    
    # Deploy Firestore indexes
    firebase deploy --only firestore:indexes
    
    print_success "Firestore setup complete"
}

# Main deployment function
main() {
    echo "🎯 Kent Traders Admin Dashboard - Firebase Deployment"
    echo "===================================================="
    
    # Check dependencies
    check_dependencies
    
    # Setup environment
    setup_env
    
    # Install dependencies
    install_dependencies
    
    # Run tests
    run_tests
    
    # Run linting
    run_lint
    
    # Build application
    build_app
    
    # Initialize Firebase
    init_firebase
    
    # Setup Firestore
    setup_firestore
    
    # Deploy to Firebase
    deploy_firebase
    
    echo ""
    print_success "🎉 Firebase deployment completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update environment variables in Firebase console"
    echo "2. Configure your custom domain"
    echo "3. Set up authentication providers"
    echo "4. Test all functionality"
    echo ""
    echo "🌐 Your application should be live at: https://kent-traders-admin.web.app"
}

# Run main function
main "$@" 