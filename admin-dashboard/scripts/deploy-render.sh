#!/bin/bash

# 🚀 Render Deployment Script for Kent Traders Admin Dashboard

set -e

echo "🚀 Starting Render deployment..."

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
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-app.onrender.com"

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

# Deploy to Render
deploy_render() {
    print_status "Deploying to Render..."
    
    print_warning "Render deployment requires manual setup:"
    echo ""
    echo "1. Go to https://render.com"
    echo "2. Create a new Web Service"
    echo "3. Connect your GitHub repository"
    echo "4. Use the following settings:"
    echo "   - Build Command: npm ci && npm run build"
    echo "   - Start Command: npm start"
    echo "   - Environment: Node"
    echo "   - Plan: Free"
    echo ""
    echo "5. Add environment variables:"
    echo "   - DATABASE_URL"
    echo "   - NEXTAUTH_SECRET"
    echo "   - NEXTAUTH_URL"
    echo "   - SELLERDYNAMICS_ENDPOINT"
    echo "   - SELLERDYNAMICS_ENCRYPTED_LOGIN"
    echo "   - SELLERDYNAMICS_RETAILER_ID"
    echo ""
    echo "6. Create a PostgreSQL database in Render"
    echo "7. Connect the database to your web service"
    echo ""
    
    print_success "Render deployment guide completed"
}

# Main deployment function
main() {
    echo "🎯 Kent Traders Admin Dashboard - Render Deployment"
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
    
    # Deploy to Render
    deploy_render
    
    echo ""
    print_success "🎉 Render deployment setup completed!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Follow the Render setup guide above"
    echo "2. Connect your GitHub repository"
    echo "3. Configure environment variables"
    echo "4. Set up the PostgreSQL database"
    echo "5. Deploy and test functionality"
    echo ""
    echo "🌐 Your application will be live at: https://your-app.onrender.com"
}

# Run main function
main "$@" 