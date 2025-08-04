// packages/ai-insights/src/workflows/inventory-workflow.ts
import { StateGraph, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { BaseMessage } from "@langchain/core/messages";

// Define state schema with Zod
const InventoryStateSchema = z.object({
  products: z.array(z.object({
    id: z.string(),
    name: z.string(),
    stock: z.number(),
    price: z.number(),
    trends: z.array(z.number()).optional()
  })),
  analysis: z.string().optional(),
  recommendations: z.array(z.string()).optional(),
  alerts: z.array(z.object({
    type: z.enum(['low_stock', 'price_anomaly', 'demand_spike']),
    productId: z.string(),
    message: z.string()
  })).optional(),
  messages: z.array(z.any()).optional()
});

type InventoryState = z.infer<typeof InventoryStateSchema>;

export class InventoryWorkflow {
  private workflow: StateGraph<InventoryState>;
  private llm: ChatOpenAI;

  constructor() {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4-turbo-preview",
      temperature: 0
    });

    this.workflow = new StateGraph<InventoryState>({
      channels: InventoryStateSchema.shape
    });

    this.setupNodes();
    this.setupEdges();
  }

  private setupNodes() {
    // Analyze inventory levels
    this.workflow.addNode("analyze_stock", async (state) => {
      const tool = new DynamicStructuredTool({
        name: "analyze_inventory",
        description: "Analyze inventory levels and trends",
        schema: z.object({
          analysis: z.string(),
          lowStockProducts: z.array(z.string())
        }),
        func: async ({ analysis, lowStockProducts }) => ({ analysis, lowStockProducts })
      });

      const response = await this.llm.invoke({
        messages: [{
          role: "system",
          content: "You are an inventory analyst. Analyze the inventory data and identify patterns, low stock items, and trends."
        }, {
          role: "user",
          content: JSON.stringify(state.products)
        }]
      });

      const analysis = response.content as string;
      
      return {
        ...state,
        analysis
      };
    });

    // Generate recommendations
    this.workflow.addNode("generate_recommendations", async (state) => {
      const response = await this.llm.invoke({
        messages: [{
          role: "system",
          content: "Generate actionable inventory recommendations based on the analysis"
        }, {
          role: "user",
          content: `Analysis: ${state.analysis}\nProducts: ${JSON.stringify(state.products)}`
        }]
      });

      const content = response.content as string;
      const recommendations = content.split('\n').filter(r => r.trim());

      return {
        ...state,
        recommendations
      };
    });

    // Create alerts
    this.workflow.addNode("create_alerts", async (state) => {
      const alerts = state.products
        .filter(p => p.stock < 10)
        .map(p => ({
          type: 'low_stock' as const,
          productId: p.id,
          message: `Low stock alert: ${p.name} has only ${p.stock} units left`
        }));

      // Check for price anomalies
      const priceAlerts = state.products
        .filter(p => {
          const avgPrice = state.products.reduce((sum, prod) => sum + prod.price, 0) / state.products.length;
          return Math.abs(p.price - avgPrice) > avgPrice * 0.5;
        })
        .map(p => ({
          type: 'price_anomaly' as const,
          productId: p.id,
          message: `Price anomaly detected: ${p.name} is priced significantly different from average`
        }));

      return { 
        ...state, 
        alerts: [...alerts, ...priceAlerts]
      };
    });
  }

  private setupEdges() {
    this.workflow.addEdge("analyze_stock", "generate_recommendations");
    this.workflow.addEdge("generate_recommendations", "create_alerts");
    this.workflow.addEdge("create_alerts", END);
    this.workflow.setEntryPoint("analyze_stock");
  }

  async run(products: any[]) {
    const app = this.workflow.compile();
    return await app.invoke({ 
      products,
      messages: []
    });
  }
}