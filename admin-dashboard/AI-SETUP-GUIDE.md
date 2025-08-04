# 🤖 AI Setup Guide for Kent Traders

## 🚀 Quick Start (No API Keys Required)

### Step 1: Test Basic Infrastructure
```bash
cd admin-dashboard
npm run test:ai-basic
```

This will test the basic AI infrastructure without requiring any API keys.

### Step 2: Set Up Environment Variables
```bash
npm run ai:setup-env
```

This creates a `.env.local` file with template variables.

### Step 3: Add Your API Keys
Edit the `.env.local` file and add your actual API keys:

```bash
# Get your API keys from:
# OpenAI: https://platform.openai.com/api-keys
# Groq: https://console.groq.com/keys
# Pinecone: https://app.pinecone.io/

OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
PINECONE_API_KEY=your_actual_pinecone_key
PINECONE_ENVIRONMENT=your_pinecone_environment
```

### Step 4: Run Full AI Setup
```bash
npm run ai:setup
```

### Step 5: Test Complete AI System
```bash
npm run test:ai-complete
```

## 🔧 Detailed Setup Instructions

### 1. Get API Keys

#### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key to your `.env.local` file

#### Groq API Key
1. Go to https://console.groq.com/keys
2. Create a new API key
3. Copy the key to your `.env.local` file

#### Pinecone API Key
1. Go to https://app.pinecone.io/
2. Create a new project
3. Get your API key and environment
4. Copy both to your `.env.local` file

### 2. Test Each Component

#### Basic Test (No APIs)
```bash
npm run test:ai-basic
```

#### RAG System Test
```bash
npm run test:ai-rag
```

#### AI Agents Test
```bash
npm run test:ai-agents
```

#### Complete System Test
```bash
npm run test:ai-complete
```

### 3. Start AI Services

#### Start MCP Server
```bash
npm run ai:mcp
```

#### Start Autonomous Agent
```bash
npm run ai:agent
```

#### Check Status
```bash
npm run ai:status
```

#### Stop Services
```bash
npm run ai:stop
```

## 🧪 Testing Commands

| Command | Purpose | Requirements |
|---------|---------|--------------|
| `npm run test:ai-basic` | Test basic infrastructure | None |
| `npm run test:ai-rag` | Test RAG system | Pinecone API |
| `npm run test:ai-agents` | Test AI agents | OpenAI API |
| `npm run test:ai-complete` | Test entire system | All APIs |

## 🔍 Troubleshooting

### Common Issues

#### 1. "Missing API Key" Error
**Solution**: Set up your environment variables
```bash
npm run ai:setup-env
# Then edit .env.local with your actual keys
```

#### 2. "Pinecone Configuration Error"
**Solution**: Check your Pinecone credentials
```bash
# Verify your .env.local has:
PINECONE_API_KEY=your_actual_key
PINECONE_ENVIRONMENT=your_environment
```

#### 3. "OpenAI API Error"
**Solution**: Check your OpenAI API key
```bash
# Verify your .env.local has:
OPENAI_API_KEY=your_openai_api_key_here
```

#### 4. "Module Not Found" Error
**Solution**: Install dependencies
```bash
npm install
```

### Debug Commands

#### Check Environment Variables
```bash
node -e "console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set')"
node -e "console.log('PINECONE_API_KEY:', process.env.PINECONE_API_KEY ? 'Set' : 'Not set')"
node -e "console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Set' : 'Not set')"
```

#### Test Individual Components
```bash
# Test text processing
npm run test:ai-basic

# Test with mock data
npm run ai:setup
```

## 📊 Success Indicators

### ✅ Basic Setup Complete
- [ ] `npm run test:ai-basic` passes
- [ ] `.env.local` file created
- [ ] All dependencies installed

### ✅ Full Setup Complete
- [ ] `npm run test:ai-complete` passes
- [ ] All API keys configured
- [ ] AI services running
- [ ] No error messages

### ✅ Production Ready
- [ ] All tests passing
- [ ] Performance metrics met
- [ ] Security measures in place
- [ ] Monitoring configured

## 🚀 Deployment

### Staging Deployment
```bash
npm run deploy:ai-staging
```

### Production Deployment
```bash
npm run deploy:production
```

## 📚 Additional Resources

- [AI Implementation Guide](./AI-IMPLEMENTATION-GUIDE.md)
- [API Documentation](./API-DOCUMENTATION.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)

## 🆘 Support

If you encounter issues:

1. **Check the troubleshooting section above**
2. **Run basic tests first**: `npm run test:ai-basic`
3. **Verify environment variables**: `npm run ai:setup-env`
4. **Check logs**: Look for error messages in the console
5. **Contact support**: ai-oncall@kenttraders.com

---

**Last Updated**: 2024-01-14
**Version**: 1.0.0 