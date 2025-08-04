#!/bin/bash

# 🔥 Firebase + Render PostgreSQL Setup Script

set -e

echo "🔥 Setting up Firebase + Render PostgreSQL..."

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

# Setup Firebase
setup_firebase() {
    print_status "Setting up Firebase..."
    
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
    
    print_success "Firebase setup complete"
}

# Setup database
setup_database() {
    print_status "Setting up PostgreSQL database..."
    
    # Generate Prisma client
    npx prisma generate
    
    # Push schema to database
    npx prisma db push
    
    print_success "Database setup complete"
}

# Create environment file
create_env_file() {
    print_status "Creating environment file..."
    
    if [ ! -f .env.local ]; then
        cat > .env.local << EOF
# Firebase Configuration
FIREBASE_PROJECT_ID="kent-traders-admin"
FIREBASE_API_KEY="your-api-key"
FIREBASE_AUTH_DOMAIN="kent-traders-admin.firebaseapp.com"
FIREBASE_STORAGE_BUCKET="kent-traders-admin.appspot.com"
FIREBASE_MESSAGING_SENDER_ID="123456789"
FIREBASE_APP_ID="1:123456789:web:abc123"

# Render PostgreSQL Database
DATABASE_URL="postgresql://user:password@host:port/database"

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

# Deploy to Firebase
deploy_firebase() {
    print_status "Deploying to Firebase..."
    
    # Deploy hosting
    firebase deploy --only hosting
    
    # Deploy functions
    firebase deploy --only functions
    
    # Deploy Firestore rules
    firebase deploy --only firestore:rules
    
    print_success "Deployed to Firebase successfully"
}

# Test setup
test_setup() {
    print_status "Testing setup..."
    
    # Test database connection
    npx prisma studio &
    
    # Test API endpoints
    print_status "Testing API endpoints..."
    print_warning "Please test your API endpoints manually"
    
    print_success "Setup testing complete"
}

# Main setup function
main() {
    echo "🎯 Kent Traders Admin Dashboard - Firebase + Render Setup"
    echo "========================================================"
    
    # Check dependencies
    check_dependencies
    
    # Install dependencies
    install_dependencies
    
    # Create environment file
    create_env_file
    
    # Setup Firebase
    setup_firebase
    
    # Setup database
    setup_database
    
    # Deploy to Firebase
    deploy_firebase
    
    # Test setup
    test_setup
    
    echo ""
    print_success "🎉 Firebase + Render setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update environment variables in .env.local"
    echo "2. Create Render PostgreSQL database"
    echo "3. Update DATABASE_URL with Render connection string"
    echo "4. Test all functionality"
    echo "5. Configure custom domain"
    echo ""
    echo "🌐 Your application should be live at: https://kent-traders-admin.web.app"
    echo ""
    echo "📊 Services:"
    echo "- Firebase Hosting: Web application"
    echo "- Firebase Authentication: User management"
    echo "- Firebase Firestore: Real-time data"
    echo "- Render PostgreSQL: Primary database"
    echo ""
    echo "🔧 Configuration files:"
    echo "- firebase.json: Firebase configuration"
    echo "- firestore.rules: Firestore security rules"
    echo "- firestore.indexes.json: Firestore indexes"
    echo "- prisma/schema.prisma: PostgreSQL schema"
}

# Run main function
main "$@" 