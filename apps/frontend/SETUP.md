# 🚀 Kent Traders Dashboard Setup Guide

## Prerequisites

### 1. Install Node.js and npm
```bash
# Check if Node.js is installed
node --version
npm --version

# If not installed, download from: https://nodejs.org/
# Or use Homebrew (macOS):
brew install node

# Or use nvm (recommended):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### 2. Install Dependencies
```bash
# Navigate to dashboard directory
cd admin-dashboard

# Install dependencies
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the `admin-dashboard` directory:
```bash
# API Configuration
NEXT_PUBLIC_API_BASE=http://localhost:3000/api

# AI Configuration (Optional - for AI Copilot)
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your-anthropic-api-key-here
AI_PROVIDER=openai

# Database Configuration (if using)
DATABASE_URL=your-database-url
```

### 4. Start the Backend Server

In the main project directory:
```bash
# Install backend dependencies
npm install

# Start the backend server
node app.js
```

The backend will run on `http://localhost:3000`

### 5. Start the Dashboard

In the `admin-dashboard` directory:
```bash
# Development mode
npm run dev

# Or build and start production
npm run build
npm start
```

The dashboard will run on `http://localhost:3001`

## Features Available

### ✅ Working Features
- **Dashboard Overview**: Real-time stats and quick actions
- **Plugin Management**: View, enable/disable, install plugins
- **Analytics**: Live charts and performance metrics
- **Accounting**: Create invoices, estimates, bank sync
- **AI Copilot**: Chat and content generation (with API keys)

### 🔧 Configuration Options

#### AI Copilot Setup
1. Get API keys from:
   - OpenAI: https://platform.openai.com/api-keys
   - Anthropic: https://console.anthropic.com/
2. Add to `.env.local`
3. Restart the dashboard

#### Custom API Endpoints
The dashboard connects to these backend endpoints:
- `GET /api/plugins` - List plugins
- `GET /api/analytics` - Get analytics data
- `POST /api/accounting/invoice` - Create invoice
- `POST /api/ai-copilot` - AI chat
- `POST /api/ai-copilot/generate` - Content generation

## Troubleshooting

### Common Issues

1. **"npm: command not found"**
   - Install Node.js from https://nodejs.org/

2. **Port already in use**
   - Change port in `package.json` or kill existing process
   - `lsof -ti:3000 | xargs kill -9`

3. **API connection errors**
   - Ensure backend server is running
   - Check `NEXT_PUBLIC_API_BASE` in `.env.local`

4. **AI Copilot not working**
   - Verify API keys are set in `.env.local`
   - Check network connectivity to OpenAI/Anthropic

### Performance Tips

1. **Development Mode**
   - Use `npm run dev` for hot reloading
   - Changes reflect immediately

2. **Production Mode**
   - Use `npm run build && npm start` for better performance
   - Optimized bundle size

3. **Browser Caching**
   - Clear browser cache if UI doesn't update
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

## Next Steps

1. **Customize the Dashboard**
   - Modify colors in `tailwind.config.js`
   - Add new pages in `pages/` directory
   - Create new components in `components/` directory

2. **Add Real Data**
   - Connect to your Shopify store
   - Integrate with your accounting system
   - Add your own plugins

3. **Deploy to Production**
   - Use Vercel: `vercel --prod`
   - Or deploy to your own server

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure backend server is running
4. Check API endpoints are accessible

---

**🎉 Your Kent Traders dashboard is now ready to use!** 