// admin-dashboard/pages/api/ai/chat.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const startTime = Date.now();
    const runId = uuidv4();

    // Simple AI response logic
    let response = '';
    
    // Basic context-aware responses
    if (message.toLowerCase().includes('inventory') || message.toLowerCase().includes('stock')) {
      response = `I can help you with inventory management. Based on your current page (${context?.currentPage || 'unknown'}), here are some suggestions:

1. Check current stock levels
2. Set up low stock alerts
3. Generate inventory reports
4. Update product quantities

Would you like me to help you with any of these tasks?`;
    } else if (message.toLowerCase().includes('sales') || message.toLowerCase().includes('revenue')) {
      response = `I can help you with sales analysis. Here are some key areas to focus on:

1. Sales performance metrics
2. Revenue trends
3. Customer analytics
4. Product performance

What specific sales data would you like to explore?`;
    } else if (message.toLowerCase().includes('customer') || message.toLowerCase().includes('client')) {
      response = `I can help you with customer management. Here are some useful features:

1. Customer profiles and history
2. Customer segmentation
3. Customer feedback analysis
4. Customer retention strategies

What aspect of customer management would you like to focus on?`;
    } else {
      response = `Hello! I'm your AI assistant for Kent Traders. I can help you with:

- Inventory management and stock control
- Sales analysis and reporting
- Customer relationship management
- Business insights and recommendations
- Data analysis and optimization

What would you like to know about today?`;
    }

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 500));

    const latency = Date.now() - startTime;

    // Log the interaction
    console.log(`AI Chat - Run ID: ${runId}, Latency: ${latency}ms, Message: ${message}`);

    return res.status(200).json({
      message: response,
      runId,
      latency,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({ 
      error: 'An error occurred while processing your request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}