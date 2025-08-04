# 🚀 AI Quick Start Guide

## ⚡ **5-Minute Setup (No API Keys Required)**

### **Step 1: Install AI Dependencies**
```bash
cd admin-dashboard
npm run ai:install-deps
```

### **Step 2: Test Basic Infrastructure**
```bash
npm run test:ai-basic
```

### **Step 3: Set Up Environment (Optional)**
```bash
npm run ai:setup-env
# Edit .env.local with your API keys
```

### **Step 4: Test Complete System**
```bash
npm run test:ai-complete
```

## 🔧 **Detailed Setup**

### **If You Get Module Errors:**

#### **Error: Cannot find module '@pinecone-database/pinecone'**
**Solution**: Install dependencies first
```bash
npm run ai:install-deps
```

#### **Error: Cannot find module '@kt/ai-insights'**
**Solution**: Build the package
```bash
cd ../packages/ai-insights
npm install
npm run build
cd ../../admin-dashboard
```

### **Complete Setup Process:**

```bash
# 1. Install all dependencies
npm run ai:install-deps

# 2. Test basic functionality
npm run test:ai-basic

# 3. Set up environment variables
npm run ai:setup-env

# 4. Add your API keys to .env.local
# (Edit the file with your actual keys)

# 5. Test with APIs
npm run ai:setup
npm run test:ai-complete

# 6. Start AI services
npm run ai:mcp
npm run ai:agent
```

## 🧪 **Testing Commands**

| Command | Purpose | Requirements |
|---------|---------|--------------|
| `npm run ai:install-deps` | Install all AI dependencies | None |
| `npm run test:ai-basic` | Test basic infrastructure | None |
| `npm run test:ai-complete` | Test complete system | API keys |
| `npm run ai:setup` | Setup AI infrastructure | API keys |

## 🔍 **Troubleshooting**

### **Common Issues:**

#### **1. Module Not Found Errors**
```bash
# Install dependencies
npm run ai:install-deps

# Or manually install
npm install
cd ../packages/ai-insights && npm install && npm run build
```

#### **2. API Key Errors**
```bash
# Set up environment
npm run ai:setup-env

# Edit .env.local with your keys
nano .env.local
```

#### **3. Build Errors**
```bash
# Clean and rebuild
rm -rf node_modules package-lock.json
npm install
npm run ai:install-deps
```

## 📊 **Success Indicators**

### ✅ **Basic Setup Complete**
- [ ] `npm run ai:install-deps` runs without errors
- [ ] `npm run test:ai-basic` passes
- [ ] No module not found errors

### ✅ **Full Setup Complete**
- [ ] `.env.local` file created with API keys
- [ ] `npm run test:ai-complete` passes
- [ ] AI services can start without errors

## 🚀 **Next Steps**

After successful setup:

1. **Start AI Services**
   ```bash
   npm run ai:mcp
   npm run ai:agent
   ```

2. **Deploy to Staging**
   ```bash
   npm run deploy:ai-staging
   ```

3. **Monitor Performance**
   - Check AI dashboard
   - Monitor response times
   - Review error logs

## 📚 **Additional Resources**

- [AI Setup Guide](./AI-SETUP-GUIDE.md)
- [Environment Setup](./ENVIRONMENT-SETUP.md)
- [AI Implementation Guide](./AI-IMPLEMENTATION-GUIDE.md)

---

**Last Updated**: 2024-01-14
**Version**: 1.0.0 