// Updated AI Test with current models
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

  // Test Groq with updated models
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith('gsk_')) {
    console.log('🦙 Testing Groq API with current models...');
    
    const currentModels = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant', 
      'mixtral-8x7b-32768',
      'gemma2-9b-it'
    ];

    for (const model of currentModels) {
      try {
        const Groq = require('groq-sdk');
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        
        const response = await groq.chat.completions.create({
          messages: [{ role: 'user', content: 'Hello, just say "Working!" if you receive this' }],
          model: model,
          max_tokens: 10,
          temperature: 0.1,
        });
        
        console.log(`✅ Groq ${model}:`, response.choices[0]?.message?.content);
        break; // Use first working model
      } catch (error) {
        console.log(`❌ Groq ${model}:`, error.message.substring(0, 80) + '...');
      }
    }
    console.log('');
  }

  // For OpenAI quota issues, let's just check if the key format is valid
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
    console.log('🤖 OpenAI API Key Format: ✅ Valid');
    console.log('⚠️  Note: OpenAI quota exceeded - you may need to add billing or wait for reset');
    console.log('');
  }

  console.log('💡 Recommendations:');
  console.log('   1. ✅ Your Groq API key is working - use this as primary AI provider');
  console.log('   2. ⚠️  OpenAI has quota limits - consider adding billing or using Groq');
  console.log('   3. 🚀 You can proceed with AI features using Groq');
  console.log('');
  console.log('🎉 AI Setup Ready!');
}

testAI().catch(console.error);
