import * as fs from 'fs';
import * as path from 'path';

async function setupEnvironment() {
  console.log('🔧 Setting up Environment Variables...\n');

  const envPath = path.join(process.cwd(), '.env.local');
  const envTemplate = `# AI Configuration
# Get your API keys from:
# OpenAI: https://platform.openai.com/api-keys
# Groq: https://console.groq.com/keys
# Pinecone: https://app.pinecone.io/
# LangSmith: https://smith.langchain.com/

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Groq Configuration
GROQ_API_KEY=your_groq_api_key_here

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here

# LangSmith Configuration
LANGCHAIN_API_KEY=your_langsmith_api_key_here
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com

# MCP Server Configuration
MCP_SERVER_URI=ws://localhost:3002

# AI Model Configuration
DEFAULT_LLM_MODEL=gpt-4-turbo-preview
EMBEDDING_MODEL=text-embedding-3-large
GROQ_MODEL=llama-3.3-70b-versatile

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_AI_ENABLED=true
`;

  try {
    // Check if .env.local already exists
    if (fs.existsSync(envPath)) {
      console.log('⚠️  .env.local already exists');
      console.log('📝 Current content:');
      console.log(fs.readFileSync(envPath, 'utf8'));
      console.log('\n💡 To update, edit the file manually or delete it and run this script again');
    } else {
      // Create .env.local file
      fs.writeFileSync(envPath, envTemplate);
      console.log('✅ Created .env.local file');
      console.log('📝 Please edit the file and add your actual API keys');
      console.log('\n🔐 Note: This file is ignored by git for security reasons');
      console.log('   This prevents your API keys from being accidentally committed');
    }

    console.log('\n📋 Next steps:');
    console.log('1. Edit .env.local and add your API keys');
    console.log('2. Run: npm run ai:setup');
    console.log('3. Test: npm run test:ai-complete');

  } catch (error) {
    console.error('❌ Failed to create .env.local:', error);
  }
}

setupEnvironment().catch(console.error); 