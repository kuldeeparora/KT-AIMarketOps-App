// packages/ai-insights/src/mcp/client.ts
import { MCPClient } from "@modelcontextprotocol/sdk/client";

export class MCPClientWrapper {
  private client: MCPClient;

  constructor() {
    this.client = new MCPClient({
      serverUri: process.env.MCP_SERVER_URI || 'ws://localhost:3002'
    });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('✅ MCP Client connected');
    } catch (error) {
      console.error('❌ MCP Client connection failed:', error);
    }
  }

  async callTool(toolName: string, params: any) {
    try {
      const result = await this.client.callTool({
        name: toolName,
        arguments: params
      });
      return result;
    } catch (error) {
      console.error(`Tool call failed for ${toolName}:`, error);
      throw error;
    }
  }

  async listTools() {
    try {
      const tools = await this.client.listTools();
      return tools;
    } catch (error) {
      console.error('Failed to list tools:', error);
      return [];
    }
  }
}