#!/bin/bash

# 🚀 Netlify Deployment Script for Kent Traders Admin Dashboard

set -e

echo "🚀 Starting Netlify deployment..."

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
    
    if ! command -v netlify &> /dev/null; then
        print_status "Installing Netlify CLI..."
        npm install -g netlify-cli
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
# Database Configuration
DATABASE_URL="mysql://username:password@host:port/database"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-site.netlify.app"

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

# Deploy to Netlify
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    # Check if logged in to Netlify
    if ! netlify status &> /dev/null; then
        print_warning "Please login to Netlify first: netlify login"
        exit 1
    fi
    
    # Initialize Netlify if not already done
    if [ ! -f .netlify/state.json ]; then
        print_status "Initializing Netlify site..."
        netlify init
    fi
    
    # Deploy
    netlify deploy --prod --dir=.next
    print_success "Deployed to Netlify successfully"
    
    # Get the deployment URL
    DEPLOY_URL=$(netlify status --json | jq -r '.url')
    print_success "Your site is live at: $DEPLOY_URL"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Install Prisma CLI if not installed
    if ! command -v npx prisma &> /dev/null; then
        print_status "Installing Prisma..."
        npm install prisma @prisma/client
    fi
    
    # Generate Prisma client
    npx prisma generate
    
    # Push schema to database
    npx prisma db push
    
    print_success "Database setup complete"
}

# Main deployment function
main() {
    echo "🎯 Kent Traders Admin Dashboard - Netlify Deployment"
    echo "=================================================="
    
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
    
    # Setup database
    setup_database
    
    # Deploy to Netlify
    deploy_netlify
    
    echo ""
    print_success "🎉 Netlify deployment completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update environment variables in Netlify dashboard"
    echo "2. Configure your custom domain"
    echo "3. Set up form handling and redirects"
    echo "4. Test all functionality"
    echo ""
    echo "🌐 Your application should be live at: https://your-site.netlify.app"
}

# Run main function
main "$@" 