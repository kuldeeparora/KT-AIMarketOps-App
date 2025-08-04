# 🔐 Environment File Management Guide

## 🚨 Why .env.local is Blocked

The `.env.local` file is blocked from being created by the AI assistant for **security reasons**. This is intentional and protects your sensitive information.

### **Security Reasons:**
1. **API Key Protection**: Prevents accidental exposure of API keys
2. **Environment Isolation**: Different environments need different configurations
3. **Team Safety**: Prevents accidental sharing of credentials
4. **Compliance**: Security standards require environment files to be ignored

## ✅ **How to Create .env.local**

### **Method 1: Use the Setup Script (Recommended)**
```bash
cd admin-dashboard
npm run ai:setup-env
```

This will create the `.env.local` file with template variables.

### **Method 2: Create Manually**
```bash
cd admin-dashboard
touch .env.local
```

Then edit with your API keys:
```bash
# AI Configuration
OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
PINECONE_API_KEY=your_actual_pinecone_key
PINECONE_ENVIRONMENT=your_pinecone_environment
```

### **Method 3: Copy from Template**
```bash
cd admin-dashboard
cp .env.example .env.local  # if .env.example exists
```

## 🔧 **Environment File Structure**

### **Files Explained:**

| File | Purpose | Git Status | When to Use |
|------|---------|------------|-------------|
| `.env.local` | Your actual API keys | ❌ Ignored | Local development |
| `.env.example` | Template for team | ✅ Tracked | Team reference |
| `.env.production` | Production keys | ❌ Ignored | Production deployment |
| `.env.staging` | Staging keys | ❌ Ignored | Staging deployment |

### **Gitignore Rules:**
```gitignore
# Environment variables (always ignore - must be at top)
*.env
.env*
**/.env
**/.env.*
```

## 🚀 **Complete Setup Process**

### **Step 1: Create Environment File**
```bash
cd admin-dashboard
npm run ai:setup-env
```

### **Step 2: Add Your API Keys**
Edit `.env.local` with your actual keys:

```bash
# Get your API keys from:
# OpenAI: https://platform.openai.com/api-keys
# Groq: https://console.groq.com/keys
# Pinecone: https://app.pinecone.io/

OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
PINECONE_API_KEY=your-actual-pinecone-key
PINECONE_ENVIRONMENT=your-pinecone-environment
```

### **Step 3: Test Setup**
```bash
# Test basic infrastructure
npm run test:ai-basic

# Test with APIs
npm run ai:setup
npm run test:ai-complete
```

## 🔍 **Troubleshooting**

### **Common Issues:**

#### **1. "File Not Found" Error**
```bash
# Check if file exists
ls -la .env.local

# Create if missing
npm run ai:setup-env
```

#### **2. "API Key Not Set" Error**
```bash
# Check environment variables
node -e "console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set')"

# Verify .env.local content
cat .env.local
```

#### **3. "Permission Denied" Error**
```bash
# Check file permissions
ls -la .env.local

# Fix permissions if needed
chmod 600 .env.local
```

## 📋 **Best Practices**

### **✅ Security Best Practices:**
- Never commit `.env.local` to git
- Use different keys for different environments
- Rotate API keys regularly
- Use environment-specific files
- Keep keys secure and private

### **✅ Development Best Practices:**
- Use `.env.example` for team reference
- Document required environment variables
- Test with mock data when APIs unavailable
- Use environment validation scripts

### **✅ Team Collaboration:**
- Share `.env.example` with team
- Document API key requirements
- Use secure key sharing methods
- Set up CI/CD environment variables

## 🔐 **Security Checklist**

- [ ] `.env.local` is in `.gitignore`
- [ ] API keys are not in source code
- [ ] Different keys for dev/staging/prod
- [ ] Keys are rotated regularly
- [ ] Access is limited to team members
- [ ] Keys are stored securely

## 🆘 **Support**

If you need help with environment setup:

1. **Check the troubleshooting section above**
2. **Run the setup script**: `npm run ai:setup-env`
3. **Verify your API keys are correct**
4. **Test with basic setup**: `npm run test:ai-basic`
5. **Contact support**: ai-oncall@kenttraders.com

---

**Last Updated**: 2024-01-14
**Version**: 1.0.0 