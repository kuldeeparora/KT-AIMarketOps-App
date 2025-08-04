// Test environment variable loading
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

console.log('🔧 Testing Environment Variables...\n');

const envVars = [
  'PINECONE_API_KEY',
  'PINECONE_ENVIRONMENT',
  'OPENAI_API_KEY',
  'GROQ_API_KEY',
  'LANGSMITH_API_KEY'
];

envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set (${value.substring(0, 10)}...)`);
  } else {
    console.log(`❌ ${varName}: Not set`);
  }
});

console.log('\n📋 Environment Test Complete!'); 