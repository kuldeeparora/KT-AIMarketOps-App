import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test Groq connectivity
    const groqTest = await testGroq();
    
    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      providers: ['Groq', 'Pinecone', 'LangSmith'],
      groq: groqTest
    });

  } catch (error) {
    console.error('AI Test Error:', error);
    return res.status(500).json({
      error: 'AI test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function testGroq() {
  try {
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const response = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Respond with "OK" if working' }],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 5,
    });
    
    return { 
      status: 'success', 
      response: response.choices[0]?.message?.content 
    };
  } catch (error) {
    return { 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
