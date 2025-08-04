import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatOpenAI } from "@langchain/openai";

async function setupAIInfrastructure() {
  console.log('🚀 Setting up AI Infrastructure...\n');

  // Check environment variables first
  console.log('🔧 Checking environment variables...');
  const requiredEnvVars = [
    'OPENAI_API_KEY',
    'PINECONE_API_KEY',
    'PINECONE_ENVIRONMENT',
    'GROQ_API_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('⚠️  Missing environment variables:', missingVars.join(', '));
    console.log('\n📋 Please set up your environment variables:');
    console.log('1. Create a .env.local file in the admin-dashboard directory');
    console.log('2. Add the following variables:');
    console.log('');
    console.log('# OpenAI Configuration');
    console.log('OPENAI_API_KEY=your_openai_api_key_here');
    console.log('');
    console.log('# Groq Configuration');
    console.log('GROQ_API_KEY=your_groq_api_key_here');
    console.log('');
    console.log('# Pinecone Configuration');
    console.log('PINECONE_API_KEY=your_pinecone_api_key_here');
    console.log('PINECONE_ENVIRONMENT=your_pinecone_environment_here');
    console.log('');
    console.log('# Get your API keys from:');
    console.log('# OpenAI: https://platform.openai.com/api-keys');
    console.log('# Groq: https://console.groq.com/keys');
    console.log('# Pinecone: https://app.pinecone.io/');
    console.log('');
    console.log('3. Restart the setup after adding the environment variables');
    console.log('');
    console.log('🔄 Running in demo mode with mock data...');
    
    // Run in demo mode
    await runDemoMode();
    return;
  }

  async function runDemoMode() {
    console.log('\n🎭 Running AI Infrastructure Setup in Demo Mode...');
    
    // 1. Test basic functionality without external APIs
    console.log('📊 Testing basic AI components...');
    
    // Test text splitter
    console.log('✂️  Testing text splitter...');
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ["\n\n", "\n", " ", ""]
    });

    try {
      const chunks = await splitter.splitText('This is a test document for chunking. '.repeat(50));
      console.log('✅ Text splitter working, chunks created:', chunks.length);
    } catch (error) {
      console.log('❌ Text splitter failed:', (error as Error).message);
    }

    // Create sample data structure
    console.log('\n📝 Creating sample data structure...');
    const sampleDocuments = [
      {
        id: 'doc1',
        content: 'Kent Traders is a leading UK-based trading company specializing in electronics and consumer goods.',
        metadata: {
          source: 'company_info',
          type: 'documentation',
          timestamp: new Date().toISOString()
        }
      },
      {
        id: 'doc2',
        content: 'Our inventory management system helps optimize stock levels and reduce costs.',
        metadata: {
          source: 'system_info',
          type: 'documentation',
          timestamp: new Date().toISOString()
        }
      }
    ];

    console.log('✅ Sample data structure created');
    console.log('✅ Demo mode setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Add your API keys to .env.local');
    console.log('2. Run: npm run ai:setup (again)');
    console.log('3. Test: npm run test:ai-complete');
  }

  try {
    // 1. Setup Pinecone
    console.log('📊 Setting up Pinecone...');
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    try {
      await pinecone.createIndex({
        name: 'kent-traders-knowledge',
        dimension: 1536,
        metric: 'cosine',
        spec: {
          pod: {
            environment: process.env.PINECONE_ENVIRONMENT!,
            podType: 'p1.x1'
          }
        }
      });
      console.log('✅ Pinecone index created');
    } catch (error) {
      console.log('ℹ️  Pinecone index might already exist:', (error as Error).message);
    }

    // 2. Test OpenAI connection
    console.log('\n🤖 Testing OpenAI connection...');
    const llm = new ChatOpenAI({
      modelName: "gpt-4-turbo-preview",
      temperature: 0
    });

    try {
      const response = await llm.invoke([
        { role: 'user', content: 'Hello, this is a test message.' }
      ]);
      console.log('✅ OpenAI connection successful');
    } catch (error) {
      console.log('❌ OpenAI connection failed:', (error as Error).message);
    }

    // 3. Test embeddings
    console.log('\n🔍 Testing embeddings...');
    const embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-large"
    });

    try {
      const embedding = await embeddings.embedQuery('test embedding');
      console.log('✅ Embeddings working, dimension:', embedding.length);
    } catch (error) {
      console.log('❌ Embeddings failed:', (error as Error).message);
    }

    // 4. Test text splitter
    console.log('\n✂️  Testing text splitter...');
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ["\n\n", "\n", " ", ""]
    });

    try {
      const chunks = await splitter.splitText('This is a test document for chunking. '.repeat(50));
      console.log('✅ Text splitter working, chunks created:', chunks.length);
    } catch (error) {
      console.log('❌ Text splitter failed:', (error as Error).message);
    }

    // 5. Create sample data
    console.log('\n📝 Creating sample data...');
    const sampleDocuments = [
      {
        id: 'doc1',
        content: 'Kent Traders is a leading UK-based trading company specializing in electronics and consumer goods.',
        metadata: {
          source: 'company_info',
          type: 'documentation',
          timestamp: new Date().toISOString()
        }
      },
      {
        id: 'doc2',
        content: 'Our inventory management system helps optimize stock levels and reduce costs.',
        metadata: {
          source: 'system_info',
          type: 'documentation',
          timestamp: new Date().toISOString()
        }
      }
    ];

    console.log('✅ Sample data created');

    // 6. Test environment variables
    console.log('\n🔧 Checking environment variables...');
    const requiredEnvVars = [
      'OPENAI_API_KEY',
      'PINECONE_API_KEY',
      'PINECONE_ENVIRONMENT',
      'GROQ_API_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log('⚠️  Missing environment variables:', missingVars.join(', '));
    } else {
      console.log('✅ All required environment variables are set');
    }

    console.log('\n🎉 AI Infrastructure setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run ai:mcp');
    console.log('2. Run: npm run ai:agent');
    console.log('3. Test: npm run test:ai-complete');

  } catch (error) {
    console.error('❌ AI Infrastructure setup failed:', error);
    process.exit(1);
  }
}

setupAIInfrastructure().catch(console.error); 