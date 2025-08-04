// Test AI Service
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

async function testAI() {
  console.log('🧪 Testing AI Service Setup...\n');

  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`  OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`  GROQ_API_KEY: ${process.env.GROQ_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log('');

  try {
    // Import and test the AI service
    const { aiService } = await import('./lib/ai-service');
    
    console.log('🔌 Available Providers:', aiService.getAvailableProviders());
    console.log('');

    // Test Groq if available
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith('gsk_')) {
      console.log('🦙 Testing Groq...');
      try {
        const groqResponse = await aiService.chatWithGroq('Say hello in a friendly way');
        console.log('✅ Groq Response:', groqResponse.substring(0, 100) + '...');
      } catch (error) {
        console.log('❌ Groq Error:', error.message);
      }
      console.log('');
    }

    // Test OpenAI if available
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
      console.log('🤖 Testing OpenAI...');
      try {
        const openaiResponse = await aiService.chatWithOpenAI('Say hello in a professional way');
        console.log('✅ OpenAI Response:', String(openaiResponse).substring(0, 100) + '...');
      } catch (error) {
        console.log('❌ OpenAI Error:', error.message);
      }
      console.log('');
    }

    // Test business insight
    console.log('💼 Testing Business Insight...');
    try {
      const insight = await aiService.getBusinessInsight('What are key inventory management best practices?');
      console.log('✅ Business Insight:', String(insight).substring(0, 150) + '...');
    } catch (error) {
      console.log('❌ Business Insight Error:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAI();
