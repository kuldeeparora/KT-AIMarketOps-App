#!/bin/bash

# 🚀 Kent Traders Admin Dashboard Deployment Script
# This script automates the deployment process

set -e

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if required tools are installed
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
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed."
        exit 1
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
NEXTAUTH_URL="https://your-domain.vercel.app"

# SellerDynamics Configuration
SELLERDYNAMICS_ENDPOINT="https://login.sellerdynamics.com/api/SellerDynamicsAPI.asmx"
SELLERDYNAMICS_ENCRYPTED_LOGIN="your-encrypted-login"
SELLERDYNAMICS_RETAILER_ID="your-retailer-id"

# Vercel Configuration
VERCEL_TOKEN="your-vercel-token"
VERCEL_ORG_ID="your-org-id"
VERCEL_PROJECT_ID="your-project-id"
EOF
        print_warning "Please update .env.local with your actual values"
    else
        print_success "Environment file already exists"
    fi
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Check if logged in to Vercel
    if ! vercel whoami &> /dev/null; then
        print_warning "Please login to Vercel first: vercel login"
        exit 1
    fi
    
    # Deploy
    vercel --prod --yes
    print_success "Deployed to Vercel successfully"
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

# Create admin user
create_admin_user() {
    print_status "Creating admin user..."
    
    # This would typically be done through a seed script
    print_warning "Please create admin user manually or run seed script"
}

# Main deployment function
main() {
    echo "🎯 Kent Traders Admin Dashboard Deployment"
    echo "========================================"
    
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
    
    # Deploy to Vercel
    deploy_vercel
    
    # Create admin user
    create_admin_user
    
    echo ""
    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update environment variables in Vercel dashboard"
    echo "2. Configure your domain"
    echo "3. Set up monitoring and analytics"
    echo "4. Test all functionality"
    echo ""
    echo "🌐 Your application should be live at: https://your-domain.vercel.app"
}

# Run main function
main "$@" 