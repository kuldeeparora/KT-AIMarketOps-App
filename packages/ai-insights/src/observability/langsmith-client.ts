// packages/ai-insights/src/observability/langsmith-client.ts
import { Client } from "langsmith";

export class EnhancedLangSmithClient {
  private client: Client;
  private projectName: string;

  constructor(projectName: string) {
    this.projectName = projectName;
    this.client = new Client({
      apiUrl: process.env.LANGSMITH_ENDPOINT || process.env.LANGCHAIN_ENDPOINT,
      apiKey: process.env.LANGSMITH_API_KEY || process.env.LANGCHAIN_API_KEY
    });
  }

  async trackInteraction(data: {
    type: string;
    input: string;
    response: any;
    metadata?: Record<string, any>;
  }) {
    try {
      // Check if LangSmith is properly configured
      if (!process.env.LANGSMITH_API_KEY) {
        console.log('⚠️  LangSmith API key not configured - skipping tracking');
        return;
      }

      await this.client.createRun({
        name: data.type,
        run_type: "chain",
        inputs: { input: data.input },
        outputs: { response: data.response },
        metadata: data.metadata || {},
        project_name: this.projectName
      });
    } catch (error) {
      console.error('LangSmith tracking error:', error);
    }
  }

  async trackModelPerformance(modelName: string, metrics: {
    accuracy: number;
    latency: number;
    cost: number;
  }) {
    try {
      await this.client.createRun({
        name: 'model_performance',
        inputs: { model: modelName },
        outputs: metrics,
        project_name: this.projectName
      });
    } catch (error) {
      console.error('Model performance tracking error:', error);
    }
  }
}