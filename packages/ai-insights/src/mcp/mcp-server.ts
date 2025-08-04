// packages/ai-insights/src/mcp/mcp-server.ts
import { z } from "zod";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const ToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.record(z.any()),
  handler: z.function()
});

const ResourceSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.any(),
  metadata: z.record(z.any())
});

export class MCPServer {
  private server: Server;
  private tools: Map<string, z.infer<typeof ToolSchema>>;
  private resources: Map<string, z.infer<typeof ResourceSchema>>;

  constructor() {
    this.tools = new Map();
    this.resources = new Map();
    this.server = new Server({
      name: "kent-traders-mcp",
      version: "1.0.0"
    }, {
      capabilities: {
        tools: {},
        resources: {}
      }
    });
    
    this.setupHandlers();
    this.registerDefaultTools();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: Array.from(this.tools.values()).map(tool => ({
          name: tool.name,
          description: tool.description,
          inputSchema: {
            type: "object",
            properties: tool.parameters
          }
        }))
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const tool = this.tools.get(request.params.name);
      if (!tool) {
        throw new Error(`Tool ${request.params.name} not found`);
      }
      
      const result = await tool.handler(request.params.arguments);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result)
        }]
      };
    });

    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: Array.from(this.resources.values()).map(resource => ({
          uri: resource.id,
          name: resource.id,
          mimeType: "application/json",
          description: `${resource.type} resource`
        }))
      };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const resource = this.resources.get(request.params.uri);
      if (!resource) {
        throw new Error(`Resource ${request.params.uri} not found`);
      }
      
      return {
        contents: [{
          uri: request.params.uri,
          mimeType: "application/json",
          text: JSON.stringify(resource.data)
        }]
      };
    });
  }

  private registerDefaultTools() {
    // Inventory search tool
    this.registerTool({
      name: "search_inventory",
      description: "Search products in inventory",
      parameters: {
        query: { type: "string", description: "Search query" },
        filters: {
          type: "object",
          properties: {
            category: { type: "string" },
            minStock: { type: "number" },
            maxPrice: { type: "number" }
          }
        }
      },
      handler: async (params: any) => {
        // Implementation would connect to actual inventory system
        return {
          results: [],
          total: 0,
          query: params.query
        };
      }
    });

    // Order analytics tool
    this.registerTool({
      name: "analyze_orders",
      description: "Analyze order patterns and trends",
      parameters: {
        timeRange: {
          type: "string",
          enum: ["day", "week", "month", "year"]
        },
        metrics: {
          type: "array",
          items: {
            type: "string",
            enum: ["revenue", "volume", "average_value"]
          }
        }
      },
      handler: async (params: any) => {
        // Implementation would analyze actual order data
        return {
          timeRange: params.timeRange,
          metrics: params.metrics,
          analysis: {}
        };
      }
    });

    // Customer insights tool
    this.registerTool({
      name: "get_customer_insights",
      description: "Get insights about customer behavior and preferences",
      parameters: {
        customerId: { type: "string" },
        insightType: {
          type: "string",
          enum: ["purchase_history", "preferences", "churn_risk"]
        }
      },
      handler: async (params: any) => {
        // Implementation would analyze customer data
        return {
          customerId: params.customerId,
          insights: {}
        };
      }
    });
  }

  registerTool(tool: z.infer<typeof ToolSchema>) {
    this.tools.set(tool.name, tool);
  }

  registerResource(resource: z.infer<typeof ResourceSchema>) {
    this.resources.set(resource.id, resource);
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log("MCP Server started");
  }
}