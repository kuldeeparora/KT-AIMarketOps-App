#!/bin/bash

# Kent Traders Admin Dashboard - Production Deployment Script
# This script deploys the complete admin dashboard with all new features

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="kent-traders-admin-dashboard"
DEPLOYMENT_ENV="production"
NODE_VERSION="18.x"
REDIS_HOST="${REDIS_HOST:-localhost}"
REDIS_PORT="${REDIS_PORT:-6379}"
WEBSOCKET_PORT="${WEBSOCKET_PORT:-3002}"
FRONTEND_PORT="${FRONTEND_PORT:-3001}"

echo -e "${BLUE}🚀 Starting Production Deployment for ${PROJECT_NAME}${NC}"
echo "=================================================="

# Function to log with timestamp
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check prerequisites
log "Checking prerequisites..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    error "Node.js is not installed"
    exit 1
fi

NODE_VERSION_CURRENT=$(node --version)
log "Node.js version: $NODE_VERSION_CURRENT"

# Check npm
if ! command -v npm &> /dev/null; then
    error "npm is not installed"
    exit 1
fi

# Check Redis
if ! command -v redis-cli &> /dev/null; then
    warning "Redis CLI not found. Please ensure Redis is running on $REDIS_HOST:$REDIS_PORT"
else
    if redis-cli -h $REDIS_HOST -p $REDIS_PORT ping &> /dev/null; then
        log "Redis connection successful"
    else
        warning "Redis connection failed. Please ensure Redis is running"
    fi
fi

# Check environment variables
log "Checking environment variables..."

REQUIRED_ENV_VARS=(
    "SHOPIFY_SHOP"
    "SHOPIFY_ACCESS_TOKEN"
    "SELLERDYNAMICS_SOAP_ENDPOINT"
    "SELLERDYNAMICS_ENCRYPTED_LOGIN"
    "SELLERDYNAMICS_RETAILER_ID"
    "JWT_SECRET"
)

MISSING_VARS=()
for var in "${REQUIRED_ENV_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    warning "Missing environment variables: ${MISSING_VARS[*]}"
    warning "Please ensure all required environment variables are set"
fi

# Create necessary directories
log "Creating necessary directories..."
mkdir -p logs
mkdir -p server
mkdir -p public/assets

# Install dependencies
log "Installing dependencies..."
npm ci --production=false

# Build the application
log "Building the application..."
npm run build

# Create production environment file
log "Creating production environment configuration..."
cat > .env.production << EOF
# Production Environment Configuration
NODE_ENV=production

# Shopify Configuration
SHOPIFY_SHOP=${SHOPIFY_SHOP}
SHOPIFY_ACCESS_TOKEN=${SHOPIFY_ACCESS_TOKEN}

# SellerDynamics Configuration
SELLERDYNAMICS_SOAP_ENDPOINT=${SELLERDYNAMICS_SOAP_ENDPOINT}
SELLERDYNAMICS_ENCRYPTED_LOGIN=${SELLERDYNAMICS_ENCRYPTED_LOGIN}
SELLERDYNAMICS_RETAILER_ID=${SELLERDYNAMICS_RETAILER_ID}
SELLERDYNAMICS_PAGE_SIZE=100000

# OKTA Configuration (Optional)
OKTA_DOMAIN=${OKTA_DOMAIN:-}
OKTA_CLIENT_ID=${OKTA_CLIENT_ID:-}
OKTA_CLIENT_SECRET=${OKTA_CLIENT_SECRET:-}
OKTA_API_TOKEN=${OKTA_API_TOKEN:-}

# Redis Configuration
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
REDIS_PASSWORD=${REDIS_PASSWORD:-}

# WebSocket Configuration
WEBSOCKET_PORT=${WEBSOCKET_PORT}
FRONTEND_URL=${FRONTEND_URL:-http://localhost:3001}

# JWT Configuration
JWT_SECRET=${JWT_SECRET}

# Monitoring Configuration
LOG_LEVEL=info
PROMETHEUS_PORT=9090

# Email Configuration
SMTP_HOST=${SMTP_HOST:-}
SMTP_PORT=${SMTP_PORT:-587}
SMTP_USER=${SMTP_USER:-}
SMTP_PASS=${SMTP_PASS:-}
EOF

# Create systemd service files
log "Creating systemd service files..."

# Main application service
cat > /etc/systemd/system/kent-traders-admin.service << EOF
[Unit]
Description=Kent Traders Admin Dashboard
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$(pwd)
Environment=NODE_ENV=production
Environment=PORT=${FRONTEND_PORT}
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=kent-traders-admin

[Install]
WantedBy=multi-user.target
EOF

# WebSocket server service
cat > /etc/systemd/system/kent-traders-websocket.service << EOF
[Unit]
Description=Kent Traders WebSocket Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$(pwd)
Environment=NODE_ENV=production
Environment=WEBSOCKET_PORT=${WEBSOCKET_PORT}
ExecStart=/usr/bin/node server/websocket-server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=kent-traders-websocket

[Install]
WantedBy=multi-user.target
EOF

# Create startup script
log "Creating startup script..."
cat > start-production.sh << 'EOF'
#!/bin/bash

# Kent Traders Admin Dashboard - Production Startup Script

echo "Starting Kent Traders Admin Dashboard..."

# Start WebSocket server
echo "Starting WebSocket server..."
node server/websocket-server.js &
WEBSOCKET_PID=$!

# Wait for WebSocket server to start
sleep 5

# Start main application
echo "Starting main application..."
node server.js &
MAIN_PID=$!

# Wait for both processes
wait $WEBSOCKET_PID $MAIN_PID
EOF

chmod +x start-production.sh

# Create health check script
log "Creating health check script..."
cat > health-check.sh << 'EOF'
#!/bin/bash

# Health check script for Kent Traders Admin Dashboard

FRONTEND_URL="http://localhost:3001"
WEBSOCKET_URL="http://localhost:3002/health"

echo "Performing health checks..."

# Check frontend
if curl -f -s "$FRONTEND_URL" > /dev/null; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend is not responding"
    exit 1
fi

# Check WebSocket server
if curl -f -s "$WEBSOCKET_URL" > /dev/null; then
    echo "✅ WebSocket server is healthy"
else
    echo "❌ WebSocket server is not responding"
    exit 1
fi

# Check Redis connection
if redis-cli -h $REDIS_HOST -p $REDIS_PORT ping > /dev/null 2>&1; then
    echo "✅ Redis connection is healthy"
else
    echo "❌ Redis connection failed"
    exit 1
fi

echo "🎉 All health checks passed!"
EOF

chmod +x health-check.sh

# Create monitoring script
log "Creating monitoring script..."
cat > monitor.sh << 'EOF'
#!/bin/bash

# Monitoring script for Kent Traders Admin Dashboard

echo "Kent Traders Admin Dashboard - System Monitor"
echo "============================================="

# System metrics
echo "System Metrics:"
echo "  CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "  Memory Usage: $(free | grep Mem | awk '{printf "%.2f%%", $3/$2 * 100.0}')"
echo "  Disk Usage: $(df / | tail -1 | awk '{print $5}')"

# Process status
echo ""
echo "Process Status:"
if pgrep -f "server.js" > /dev/null; then
    echo "  ✅ Main application is running"
else
    echo "  ❌ Main application is not running"
fi

if pgrep -f "websocket-server.js" > /dev/null; then
    echo "  ✅ WebSocket server is running"
else
    echo "  ❌ WebSocket server is not running"
fi

# Port status
echo ""
echo "Port Status:"
if netstat -tuln | grep ":3001 " > /dev/null; then
    echo "  ✅ Port 3001 (Frontend) is listening"
else
    echo "  ❌ Port 3001 (Frontend) is not listening"
fi

if netstat -tuln | grep ":3002 " > /dev/null; then
    echo "  ✅ Port 3002 (WebSocket) is listening"
else
    echo "  ❌ Port 3002 (WebSocket) is not listening"
fi

# Recent logs
echo ""
echo "Recent Logs:"
tail -5 logs/combined.log 2>/dev/null || echo "  No logs found"
EOF

chmod +x monitor.sh

# Create backup script
log "Creating backup script..."
cat > backup.sh << 'EOF'
#!/bin/bash

# Backup script for Kent Traders Admin Dashboard

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "Creating backup in $BACKUP_DIR..."

# Backup configuration files
cp .env.production "$BACKUP_DIR/"
cp package.json "$BACKUP_DIR/"
cp next.config.js "$BACKUP_DIR/"

# Backup logs
if [ -d "logs" ]; then
    cp -r logs "$BACKUP_DIR/"
fi

# Backup build artifacts
if [ -d ".next" ]; then
    cp -r .next "$BACKUP_DIR/"
fi

# Create backup archive
tar -czf "${BACKUP_DIR}.tar.gz" -C "$(dirname "$BACKUP_DIR")" "$(basename "$BACKUP_DIR")"
rm -rf "$BACKUP_DIR"

echo "Backup created: ${BACKUP_DIR}.tar.gz"
EOF

chmod +x backup.sh

# Create deployment summary
log "Creating deployment summary..."
cat > DEPLOYMENT-SUMMARY.md << EOF
# Kent Traders Admin Dashboard - Production Deployment Summary

## Deployment Information
- **Date**: $(date)
- **Environment**: $DEPLOYMENT_ENV
- **Node.js Version**: $NODE_VERSION_CURRENT
- **Frontend Port**: $FRONTEND_PORT
- **WebSocket Port**: $WEBSOCKET_PORT
- **Redis Host**: $REDIS_HOST:$REDIS_PORT

## New Features Deployed

### 🔧 **Advanced Monitoring System**
- Real-time system metrics (CPU, Memory, Disk)
- Application performance monitoring
- Error tracking and alerting
- Health checks for all services
- Prometheus metrics integration
- Winston logging with file rotation

### 🔌 **Production WebSocket Server**
- Dedicated WebSocket server on port $WEBSOCKET_PORT
- Redis adapter for horizontal scaling
- JWT authentication
- Role-based room management
- Real-time notifications
- Graceful shutdown handling

### 👥 **OKTA Integration**
- Complete OKTA user synchronization
- User management with OKTA groups
- JWT token verification
- Role-based permissions
- User profile management
- Group management

### 📊 **Enhanced Analytics**
- Advanced charts with Recharts
- Real-time data visualization
- Performance metrics
- Error rate tracking
- Database operation monitoring

### 📧 **Email Automation**
- Complete email system
- Template management
- Automated workflows
- SMTP integration

### 🔔 **Real-time Notifications**
- Socket.IO integration
- Role-based notifications
- System alerts
- User-specific notifications

## Services Created

### Systemd Services
- \`kent-traders-admin.service\` - Main application
- \`kent-traders-websocket.service\` - WebSocket server

### Scripts
- \`start-production.sh\` - Production startup script
- \`health-check.sh\` - Health check script
- \`monitor.sh\` - System monitoring script
- \`backup.sh\` - Backup script

## Configuration Files
- \`.env.production\` - Production environment variables
- Systemd service files
- Health check endpoints

## Monitoring Endpoints
- \`http://localhost:3001/monitoring-dashboard\` - Monitoring dashboard
- \`http://localhost:3002/health\` - WebSocket health check
- \`http://localhost:3001/api/monitoring/metrics\` - Metrics API

## Next Steps
1. Start the services: \`sudo systemctl start kent-traders-admin kent-traders-websocket\`
2. Enable auto-start: \`sudo systemctl enable kent-traders-admin kent-traders-websocket\`
3. Check status: \`sudo systemctl status kent-traders-admin kent-traders-websocket\`
4. Monitor logs: \`journalctl -u kent-traders-admin -f\`
5. Run health check: \`./health-check.sh\`

## Security Notes
- All sensitive data is stored in environment variables
- JWT tokens are used for authentication
- Redis is used for session management
- All API endpoints are protected
- Health checks are implemented

## Performance Optimizations
- Redis caching for WebSocket scaling
- Winston logging with rotation
- Prometheus metrics collection
- System resource monitoring
- Error tracking and alerting

EOF

# Final deployment steps
log "Deployment completed successfully!"
echo ""
echo -e "${GREEN}🎉 Kent Traders Admin Dashboard has been deployed with all new features!${NC}"
echo ""
echo "Next steps:"
echo "1. Start services: sudo systemctl start kent-traders-admin kent-traders-websocket"
echo "2. Enable auto-start: sudo systemctl enable kent-traders-admin kent-traders-websocket"
echo "3. Check status: sudo systemctl status kent-traders-admin kent-traders-websocket"
echo "4. Monitor logs: journalctl -u kent-traders-admin -f"
echo "5. Run health check: ./health-check.sh"
echo "6. View monitoring dashboard: http://localhost:3001/monitoring-dashboard"
echo ""
echo "For more information, see DEPLOYMENT-SUMMARY.md" 