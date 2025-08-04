// Simple AI Test
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

async function testAI() {
  console.log('🧪 Testing AI Service Setup...\n');

  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`  OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✅ Set (' + process.env.OPENAI_API_KEY.substring(0, 10) + '...)' : '❌ Missing'}`);
  console.log(`  GROQ_API_KEY: ${process.env.GROQ_API_KEY ? '✅ Set (' + process.env.GROQ_API_KEY.substring(0, 10) + '...)' : '❌ Missing'}`);
  console.log('');

  // Test Groq
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith('gsk_')) {
    console.log('🦙 Testing Groq API...');
    try {
      const Groq = require('groq-sdk');
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      
      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: 'Say hello and confirm you are working' }],
        model: 'llama-3.1-70b-versatile',
        max_tokens: 50,
      });
      
      console.log('✅ Groq works!', response.choices[0]?.message?.content);
    } catch (error) {
      console.log('❌ Groq Error:', error.message);
    }
    console.log('');
  }

  // Test OpenAI
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
    console.log('🤖 Testing OpenAI API...');
    try {
      const { ChatOpenAI } = require('@langchain/openai');
      const openai = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-4o-mini',
        temperature: 0.7,
      });
      
      const response = await openai.invoke([
        { role: 'user', content: 'Say hello and confirm you are working' }
      ]);
      
      console.log('✅ OpenAI works!', String(response.content).substring(0, 100));
    } catch (error) {
      console.log('❌ OpenAI Error:', error.message);
    }
    console.log('');
  }

  console.log('🎉 AI Setup Test Complete!');
}

testAI().catch(console.error);
