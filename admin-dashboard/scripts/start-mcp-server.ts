// MCP Server Implementation
import { AdvancedRAGSystem } from '../../packages/ai-insights/src/rag/advanced-rag';
import { AutonomousInventoryAgent } from '../../packages/ai-insights/src/agents/autonomous-inventory-agent';

console.log('🚀 Starting MCP Server...');

// Initialize AI components
const rag = new AdvancedRAGSystem();
const inventoryAgent = new AutonomousInventoryAgent();

// Simple HTTP server for MCP-like functionality
import * as http from 'http';

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { action, params } = JSON.parse(body);

        switch (action) {
          case 'search_knowledge':
            const results = await rag.hybridSearch(params.query);
            res.writeHead(200);
            res.end(JSON.stringify({
              success: true,
              results: results.length,
              data: results
            }));
            break;

          case 'analyze_inventory':
            const result = await inventoryAgent.run(params.objective);
            res.writeHead(200);
            res.end(JSON.stringify({
              success: true,
              output: result.output
            }));
            break;

          default:
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Unknown action' }));
        }
      } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'Kent Traders AI MCP Server',
      version: '1.0.0',
      available_actions: ['search_knowledge', 'analyze_inventory']
    }));
  }
});

server.listen(3002, () => {
  console.log('✅ MCP Server running on port 3002');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 MCP Server shutting down...');
  server.close();
  process.exit(0);
});
