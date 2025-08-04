# 🖥️ SERVER FUNCTIONALITY ACCESS GUIDE

## 📋 **OVERVIEW OF SERVER COMPONENTS**

Your admin dashboard has extensive server-side functionality including monitoring, WebSocket services, authentication, and deployment scripts. Here's how to access and test everything:

---

## 🔧 **SERVER COMPONENTS**

### **1. WebSocket Server** (`server/websocket-server.js`)
**Purpose**: Real-time notifications and communication
**Status**: ✅ Available (5.0KB, 188 lines)

**How to Start:**
```bash
# In admin-dashboard directory
node server/websocket-server.js
```
**Access**: WebSocket server runs on port 3002

**Test the WebSocket:**
1. Start the server: `node server/websocket-server.js`
2. Open browser console on `http://localhost:3001`
3. Test connection: `new WebSocket('ws://localhost:3002')`
4. Watch for real-time notifications

---

### **2. Monitoring System** (`server/monitoring-system.js`)
**Purpose**: System health monitoring and metrics collection
**Status**: ✅ Available (8.9KB, 356 lines)

**How to Start:**
```bash
# In admin-dashboard directory
node server/monitoring-system.js
```

**Features:**
- System health monitoring
- Performance metrics
- Resource usage tracking
- Alert generation
- Log collection

**Test Monitoring:**
1. Start monitoring: `node server/monitoring-system.js`
2. Check metrics: `curl http://localhost:3001/api/monitoring/metrics`
3. Check logs: `curl http://localhost:3001/api/monitoring/logs`
4. Check alerts: `curl http://localhost:3001/api/monitoring/alerts`

---

### **3. Okta Service** (`server/okta-service.js`)
**Purpose**: Authentication and user management
**Status**: ✅ Available (10KB, 360 lines)

**How to Start:**
```bash
# In admin-dashboard directory
node server/okta-service.js
```

**Features:**
- User authentication
- Role-based access control
- Single sign-on (SSO)
- User profile management
- Security policies

**Test Okta Integration:**
1. Start service: `node server/okta-service.js`
2. Access API: `curl http://localhost:3001/api/okta-integration`
3. Test authentication flows

---

## 🌐 **API ENDPOINTS**

### **Monitoring APIs** (`pages/api/monitoring/`)

#### **1. Metrics API** (`monitoring/metrics.js`)
**URL**: `http://localhost:3001/api/monitoring/metrics`
**Purpose**: System performance metrics
**Features**:
- CPU usage
- Memory usage
- Disk space
- Network statistics
- Application metrics

**Test:**
```bash
curl http://localhost:3001/api/monitoring/metrics
```

#### **2. Logs API** (`monitoring/logs.js`)
**URL**: `http://localhost:3001/api/monitoring/logs`
**Purpose**: Application logs and debugging
**Features**:
- Error logs
- Access logs
- Performance logs
- Debug information

**Test:**
```bash
curl http://localhost:3001/api/monitoring/logs
```

#### **3. Alerts API** (`monitoring/alerts.js`)
**URL**: `http://localhost:3001/api/monitoring/alerts`
**Purpose**: System alerts and notifications
**Features**:
- Critical alerts
- Warning notifications
- System status
- Performance alerts

**Test:**
```bash
curl http://localhost:3001/api/monitoring/alerts
```

### **Okta Integration API** (`pages/api/okta-integration.js`)
**URL**: `http://localhost:3001/api/okta-integration`
**Purpose**: Authentication and user management
**Features**:
- User authentication
- Token validation
- User profile data
- Role management

**Test:**
```bash
curl http://localhost:3001/api/okta-integration
```

---

## 📊 **MONITORING DASHBOARD**

### **Monitoring Dashboard** (`pages/monitoring-dashboard.jsx`)
**URL**: `http://localhost:3001/monitoring-dashboard`
**Purpose**: Visual monitoring interface

**Features:**
- Real-time system metrics
- Performance charts
- Alert management
- Log viewer
- Health status

**How to Access:**
1. Start the main app: `npm run dev`
2. Navigate to: `http://localhost:3001/monitoring-dashboard`
3. View real-time monitoring data

---

## 🔧 **DEPLOYMENT SCRIPTS**

### **1. Deploy Production** (`scripts/deploy-production.sh`)
**Purpose**: Production deployment automation
**Status**: ✅ Available (12KB, 476 lines)

**How to Run:**
```bash
# Make executable
chmod +x scripts/deploy-production.sh

# Run deployment
./scripts/deploy-production.sh
```

**Features:**
- Automated deployment
- Environment configuration
- Database migrations
- Health checks
- Rollback capabilities

### **2. Cost Sync Script** (`scripts/cost-sync-script.js`)
**Purpose**: Cost synchronization and management
**Status**: ✅ Available (2.9KB, 215 lines)

**How to Run:**
```bash
# Run cost sync
node scripts/cost-sync-script.js
```

**Features:**
- Cost tracking
- Budget management
- Expense synchronization
- Financial reporting

---

## 🧪 **TESTING PROCEDURES**

### **1. Test WebSocket Server**
```bash
# Terminal 1: Start WebSocket server
node server/websocket-server.js

# Terminal 2: Test connection
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==" http://localhost:3002
```

### **2. Test Monitoring System**
```bash
# Terminal 1: Start monitoring
node server/monitoring-system.js

# Terminal 2: Test APIs
curl http://localhost:3001/api/monitoring/metrics
curl http://localhost:3001/api/monitoring/logs
curl http://localhost:3001/api/monitoring/alerts
```

### **3. Test Okta Service**
```bash
# Terminal 1: Start Okta service
node server/okta-service.js

# Terminal 2: Test integration
curl http://localhost:3001/api/okta-integration
```

### **4. Test Deployment**
```bash
# Test deployment script
./scripts/deploy-production.sh --dry-run

# Test cost sync
node scripts/cost-sync-script.js
```

---

## 🎯 **COMPREHENSIVE TESTING CHECKLIST**

### **✅ Server Components**
- [ ] **WebSocket Server**: `node server/websocket-server.js`
- [ ] **Monitoring System**: `node server/monitoring-system.js`
- [ ] **Okta Service**: `node server/okta-service.js`

### **✅ API Endpoints**
- [ ] **Metrics API**: `curl http://localhost:3001/api/monitoring/metrics`
- [ ] **Logs API**: `curl http://localhost:3001/api/monitoring/logs`
- [ ] **Alerts API**: `curl http://localhost:3001/api/monitoring/alerts`
- [ ] **Okta API**: `curl http://localhost:3001/api/okta-integration`

### **✅ Web Interfaces**
- [ ] **Monitoring Dashboard**: `http://localhost:3001/monitoring-dashboard`
- [ ] **WebSocket Connection**: Browser console test
- [ ] **Real-time Updates**: Notification system

### **✅ Scripts**
- [ ] **Deploy Production**: `./scripts/deploy-production.sh`
- [ ] **Cost Sync**: `node scripts/cost-sync-script.js`

---

## 🚀 **STARTUP SEQUENCE**

### **Complete System Startup:**
```bash
# Terminal 1: Main application
npm run dev

# Terminal 2: WebSocket server
node server/websocket-server.js

# Terminal 3: Monitoring system
node server/monitoring-system.js

# Terminal 4: Okta service
node server/okta-service.js
```

### **Test All Services:**
```bash
# Test main app
curl http://localhost:3001

# Test WebSocket
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" http://localhost:3002

# Test monitoring APIs
curl http://localhost:3001/api/monitoring/metrics
curl http://localhost:3001/api/monitoring/logs
curl http://localhost:3001/api/monitoring/alerts

# Test Okta
curl http://localhost:3001/api/okta-integration
```

---

## 📊 **MONITORING DASHBOARD FEATURES**

### **Access Monitoring Dashboard:**
1. **URL**: `http://localhost:3001/monitoring-dashboard`
2. **Features**:
   - Real-time system metrics
   - Performance charts
   - Alert management
   - Log viewer
   - Health status indicators

### **Dashboard Sections:**
- **System Health**: Overall system status
- **Performance Metrics**: CPU, memory, disk usage
- **Alerts**: Active alerts and notifications
- **Logs**: Real-time log viewing
- **Network**: Network performance metrics

---

## 🔐 **AUTHENTICATION TESTING**

### **Okta Integration Test:**
1. **Start Okta service**: `node server/okta-service.js`
2. **Access API**: `http://localhost:3001/api/okta-integration`
3. **Test authentication flows**
4. **Verify user management**

### **Role-Based Access:**
1. **Switch roles** in the sidebar
2. **Test permission restrictions**
3. **Verify access control**

---

## 🎉 **SUCCESS INDICATORS**

**All server functionality is working when:**
- ✅ WebSocket server connects successfully
- ✅ Monitoring APIs return data
- ✅ Okta service responds
- ✅ Deployment scripts run without errors
- ✅ Monitoring dashboard displays data
- ✅ Real-time notifications work
- ✅ All APIs return proper responses

**Your server infrastructure is fully functional!** 🚀

---

## 🛠️ **TROUBLESHOOTING**

### **If WebSocket doesn't connect:**
```bash
# Check if port 3002 is available
lsof -ti:3002 | xargs kill -9
node server/websocket-server.js
```

### **If monitoring APIs fail:**
```bash
# Restart monitoring system
node server/monitoring-system.js
```

### **If Okta service fails:**
```bash
# Check Okta configuration
node server/okta-service.js
```

**All server functionality is now accessible and ready to test!** 🎯 