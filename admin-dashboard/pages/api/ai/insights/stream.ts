// admin-dashboard/pages/api/ai/insights/stream.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connection', status: 'connected' })}\n\n`);

  // Simulate real-time insights
  const insightTypes = [
    {
      type: 'inventory',
      templates: [
        { title: 'Stock Level Update', description: 'Product {product} stock changed to {stock}', type: 'info' },
        { title: 'Low Stock Warning', description: '{product} has only {stock} units left', type: 'warning' },
        { title: 'Out of Stock Alert', description: '{product} is now out of stock', type: 'error' }
      ]
    },
    {
      type: 'sales',
      templates: [
        { title: 'New Order', description: 'Order #{order} received for ${amount}', type: 'success' },
        { title: 'Sales Milestone', description: 'Daily sales exceeded ${amount}', type: 'success' },
        { title: 'Conversion Rate Update', description: 'Conversion rate improved to {rate}%', type: 'info' }
      ]
    },
    {
      type: 'ai',
      templates: [
        { title: 'AI Prediction', description: '{prediction} for {product}', type: 'info' },
        { title: 'Optimization Complete', description: 'Saved ${amount} through AI optimization', type: 'success' },
        { title: 'Anomaly Detected', description: 'Unusual pattern detected in {area}', type: 'warning' }
      ]
    }
  ];

  const products = ['Laptop Pro X1', 'Wireless Mouse', 'USB-C Hub', 'Monitor Stand', 'Keyboard Elite'];
  
  // Send insights periodically
  const interval = setInterval(() => {
    const insightType = insightTypes[Math.floor(Math.random() * insightTypes.length)];
    const template = insightType.templates[Math.floor(Math.random() * insightType.templates.length)];
    
    const insight = {
      id: uuidv4(),
      title: template.title
        .replace('{product}', products[Math.floor(Math.random() * products.length)])
        .replace('{stock}', Math.floor(Math.random() * 50).toString())
        .replace('{order}', Math.floor(Math.random() * 10000).toString())
        .replace('{amount}', (Math.random() * 5000).toFixed(2))
        .replace('{rate}', (Math.random() * 5 + 2).toFixed(1))
        .replace('{prediction}', 'Demand increase expected')
        .replace('{area}', 'order processing'),
      description: template.description
        .replace('{product}', products[Math.floor(Math.random() * products.length)])
        .replace('{stock}', Math.floor(Math.random() * 50).toString())
        .replace('{order}', Math.floor(Math.random() * 10000).toString())
        .replace('{amount}', (Math.random() * 5000).toFixed(2))
        .replace('{rate}', (Math.random() * 5 + 2).toFixed(1))
        .replace('{prediction}', 'Demand increase expected')
        .replace('{area}', 'order processing'),
      type: template.type as 'success' | 'warning' | 'info' | 'error',
      timestamp: new Date(),
      value: Math.floor(Math.random() * 100)
    };

    res.write(`data: ${JSON.stringify(insight)}\n\n`);
  }, 3000 + Math.random() * 7000); // Random interval between 3-10 seconds

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
}