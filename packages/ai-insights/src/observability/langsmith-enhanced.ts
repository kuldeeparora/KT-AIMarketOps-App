// packages/ai-insights/src/observability/langsmith-enhanced.ts
import { Client as LangSmithClient } from "langsmith";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

const TraceSchema = z.object({
  runId: z.string(),
  projectName: z.string(),
  runType: z.enum(['llm', 'chain', 'tool', 'agent']),
  inputs: z.any(),
  outputs: z.any(),
  error: z.string().optional(),
  metadata: z.object({
    userId: z.string().optional(),
    sessionId: z.string().optional(),
    environment: z.string(),
    version: z.string()
  }),
  metrics: z.object({
    latency: z.number(),
    tokens: z.number().optional(),
    cost: z.number().optional()
  })
});

export class EnhancedLangSmithClient {
  private client: LangSmithClient;
  private projectName: string;
  private alerts: Map<string, any>;

  constructor(projectName: string) {
    this.client = new LangSmithClient({
      apiKey: process.env.LANGCHAIN_API_KEY
    });
    this.projectName = projectName;
    this.alerts = new Map();
    this.setupAlertRules();
  }

  private setupAlertRules() {
    // Define alert rules
    this.alerts.set('high_latency', {
      threshold: 5000,
      action: 'notify',
      severity: 'warning'
    });

    this.alerts.set('high_cost', {
      threshold: 0.50, // $0.50 per request
      action: 'notify',
      severity: 'critical'
    });

    this.alerts.set('error_rate', {
      threshold: 0.05, // 5% error rate
      action: 'escalate',
      severity: 'critical'
    });
  }

  async trackRun(trace: z.infer<typeof TraceSchema>) {
    const validatedTrace = TraceSchema.parse(trace);
    
    try {
      // Create run in LangSmith
      const run = await this.client.createRun({
        id: validatedTrace.runId,
        project_name: this.projectName,
        name: `${validatedTrace.runType}_${Date.now()}`,
        run_type: validatedTrace.runType,
        inputs: validatedTrace.inputs,
        outputs: validatedTrace.outputs,
        error: validatedTrace.error,
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + validatedTrace.metrics.latency).toISOString(),
        extra: {
          metadata: validatedTrace.metadata,
          metrics: validatedTrace.metrics
        }
      });

      // Check alerts
      await this.checkAlerts(validatedTrace);

      return run;
    } catch (error) {
      console.error('Failed to track run:', error);
      throw error;
    }
  }

  private async checkAlerts(trace: z.infer<typeof TraceSchema>) {
    // Check latency alert
    if (trace.metrics.latency > this.alerts.get('high_latency').threshold) {
      await this.createAlert({
        type: 'high_latency',
        runId: trace.runId,
        message: `High latency detected: ${trace.metrics.latency}ms`,
        severity: 'warning',
        value: trace.metrics.latency
      });
    }

    // Check cost alert
    if (trace.metrics.cost && trace.metrics.cost > this.alerts.get('high_cost').threshold) {
      await this.createAlert({
        type: 'high_cost',
        runId: trace.runId,
        message: `High cost detected: $${trace.metrics.cost}`,
        severity: 'critical',
        value: trace.metrics.cost
      });
    }
  }

  private async createAlert(alert: any) {
    console.warn(`ALERT [${alert.severity}]: ${alert.message}`);
    
    // In production, integrate with PagerDuty, Slack, etc.
    if (alert.severity === 'critical') {
      // Send to PagerDuty
      // await this.pagerDuty.createIncident(alert);
    }
    
    // Log to monitoring system
    await this.client.createFeedback({
      run_id: alert.runId,
      key: 'alert',
      score: alert.severity === 'critical' ? 0 : 0.5,
      value: alert.message,
      comment: JSON.stringify(alert)
    });
  }

  async createDataset(name: string, examples: any[]) {
    try {
      const dataset = await this.client.createDataset(name, {
        description: `Auto-generated dataset for ${this.projectName}`,
        data_type: 'kv'
      });

      for (const example of examples) {
        await this.client.createExample(
          example.inputs,
          example.outputs,
          {
            datasetId: dataset.id,
            metadata: example.metadata
          }
        );
      }

      return dataset;
    } catch (error) {
      console.error('Failed to create dataset:', error);
      throw error;
    }
  }

  async runEvaluation(datasetName: string, evaluator: any) {
    try {
      const runId = uuidv4();
      
      // Get dataset
      const datasets = await this.client.listDatasets({ name: datasetName });
      if (datasets.length === 0) {
        throw new Error(`Dataset ${datasetName} not found`);
      }

      const dataset = datasets[0];
      const examples = await this.client.listExamples({ datasetId: dataset.id });

      // Run evaluation on each example
      const results = await Promise.all(
        examples.map(async (example) => {
          const startTime = Date.now();
          
          try {
            const output = await evaluator(example.inputs);
            const score = await this.calculateScore(output, example.outputs);
            
            return {
              exampleId: example.id,
              inputs: example.inputs,
              expectedOutputs: example.outputs,
              actualOutputs: output,
              score,
              latency: Date.now() - startTime,
              success: true
            };
          } catch (error) {
            return {
              exampleId: example.id,
              inputs: example.inputs,
              error: error.message,
              latency: Date.now() - startTime,
              success: false
            };
          }
        })
      );

      // Create evaluation run
      await this.client.createRun({
        id: runId,
        project_name: `${this.projectName}-eval`,
        name: `evaluation_${datasetName}`,
        run_type: 'evaluation',
        inputs: { datasetName },
        outputs: {
          results,
          summary: this.summarizeResults(results)
        }
      });

      return results;
    } catch (error) {
      console.error('Failed to run evaluation:', error);
      throw error;
    }
  }

  private async calculateScore(actual: any, expected: any): Promise<number> {
    // Implement custom scoring logic
    // For now, simple equality check
    return JSON.stringify(actual) === JSON.stringify(expected) ? 1.0 : 0.0;
  }

  private summarizeResults(results: any[]) {
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    const avgScore = successful.reduce((sum, r) => sum + r.score, 0) / successful.length;
    const avgLatency = results.reduce((sum, r) => sum + r.latency, 0) / results.length;

    return {
      totalExamples: results.length,
      successful: successful.length,
      failed: failed.length,
      averageScore: avgScore,
      averageLatency: avgLatency,
      successRate: successful.length / results.length
    };
  }

  async getMetrics(timeRange: { start: Date; end: Date }) {
    // Get runs within time range
    const runs = await this.client.listRuns({
      project_name: this.projectName,
      start_time: timeRange.start.toISOString(),
      end_time: timeRange.end.toISOString()
    });

    // Calculate metrics
    const metrics = {
      totalRuns: runs.length,
      successfulRuns: runs.filter(r => !r.error).length,
      failedRuns: runs.filter(r => r.error).length,
      averageLatency: runs.reduce((sum, r) => sum + (r.latency || 0), 0) / runs.length,
      totalCost: runs.reduce((sum, r) => sum + (r.extra?.metrics?.cost || 0), 0),
      errorRate: runs.filter(r => r.error).length / runs.length,
      runsByType: this.groupRunsByType(runs)
    };

    return metrics;
  }

  private groupRunsByType(runs: any[]) {
    const groups: Record<string, number> = {};
    
    runs.forEach(run => {
      const type = run.run_type || 'unknown';
      groups[type] = (groups[type] || 0) + 1;
    });

    return groups;
  }
}