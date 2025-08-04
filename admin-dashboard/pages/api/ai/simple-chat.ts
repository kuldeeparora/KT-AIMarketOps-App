import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, useProvider } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Use Groq as primary AI provider
    const response = await chatWithGroq(message);

    return res.status(200).json({
      success: true,
      response,
      provider: 'groq',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({
      error: 'AI service error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function chatWithGroq(message: string) {
  const Groq = require('groq-sdk');
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const systemPrompt = `You are an AI assistant for Kent Traders, a UK-based trading company. 
  You help with inventory management, market analysis, and business operations. 
  Provide helpful, professional responses focused on business efficiency and growth.
  Keep responses concise and actionable.`;

  const response = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 500,
  });

  return response.choices[0]?.message?.content || 'No response generated';
}
