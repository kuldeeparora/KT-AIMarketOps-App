// Base Module for AI/AGI Components - Scalable Architecture
import { z } from 'zod';

// Base status schema
export const BaseStatusSchema = z.object({
  status: z.enum(['operational', 'degraded', 'failed', 'fallback']),
  health: z.number().min(0).max(1),
  lastUpdate: z.string(),
  errors: z.array(z.string()).optional(),
  metrics: z.record(z.any()).optional()
});

export type BaseStatus = z.infer<typeof BaseStatusSchema>;

// Base configuration schema
export const BaseConfigSchema = z.object({
  enabled: z.boolean().default(true),
  timeout: z.number().min(1000).max(30000).default(10000),
  retries: z.number().min(0).max(5).default(3),
  fallbackMode: z.boolean().default(true),
  logging: z.boolean().default(true)
});

export type BaseConfig = z.infer<typeof BaseConfigSchema>;

export abstract class BaseModule {
  protected config: BaseConfig;
  protected isInitialized: boolean = false;
  protected fallbackMode: boolean = false;
  protected lastError: string | null = null;
  protected metrics: Record<string, any> = {};

  constructor(config: Partial<BaseConfig> = {}) {
    this.config = BaseConfigSchema.parse({
      enabled: true,
      timeout: 10000,
      retries: 3,
      fallbackMode: true,
      logging: true,
      ...config
    });
  }

  // Abstract methods that must be implemented by subclasses
  protected abstract initialize(): Promise<void>;
  protected abstract execute(input: any): Promise<any>;
  protected abstract getModuleName(): string;

  // Public interface methods
  public async init(): Promise<void> {
    try {
      if (this.config.logging) {
        console.log(`🔄 Initializing ${this.getModuleName()}...`);
      }

      await this.initialize();
      this.isInitialized = true;
      this.fallbackMode = false;

      if (this.config.logging) {
        console.log(`✅ ${this.getModuleName()} initialized successfully`);
      }
    } catch (error) {
      this.handleError('Initialization failed', error);
      this.fallbackMode = true;
    }
  }

  public async run(input: any): Promise<any> {
    try {
      if (!this.isInitialized) {
        await this.init();
      }

      if (this.fallbackMode) {
        return this.getFallbackResponse(input);
      }

      const result = await this.execute(input);
      this.updateMetrics('success', 1);
      return result;
    } catch (error) {
      this.handleError('Execution failed', error);
      return this.getFallbackResponse(input);
    }
  }

  public async getStatus(): Promise<BaseStatus> {
    const health = this.calculateHealth();
    const status = this.determineStatus();

    return {
      status,
      health,
      lastUpdate: new Date().toISOString(),
      errors: this.lastError ? [this.lastError] : [],
      metrics: this.metrics
    };
  }

  public isHealthy(): boolean {
    return this.isInitialized && !this.fallbackMode;
  }

  public getSystemStatus(): string {
    if (!this.isInitialized) return 'uninitialized';
    if (this.fallbackMode) return 'fallback';
    return 'operational';
  }

  // Protected utility methods
  protected async safeExecute<T>(fn: () => Promise<T>): Promise<T | null> {
    try {
      return await fn();
    } catch (error) {
      this.handleError('Safe execution failed', error);
      return null;
    }
  }

  protected handleError(context: string, error: any): void {
    const errorMessage = `${this.getModuleName()}: ${context} - ${error instanceof Error ? error.message : String(error)}`;
    this.lastError = errorMessage;
    
    if (this.config.logging) {
      console.error(`❌ ${errorMessage}`);
    }

    if (this.config.fallbackMode) {
      this.fallbackMode = true;
    }
  }

  protected updateMetrics(key: string, value: any): void {
    if (!this.metrics[key]) {
      this.metrics[key] = 0;
    }
    this.metrics[key] += value;
  }

  protected calculateHealth(): number {
    if (!this.isInitialized) return 0;
    if (this.fallbackMode) return 0.5;
    if (this.lastError) return 0.7;
    return 1.0;
  }

  protected determineStatus(): 'operational' | 'degraded' | 'failed' | 'fallback' {
    if (!this.isInitialized) return 'failed';
    if (this.fallbackMode) return 'fallback';
    if (this.lastError) return 'degraded';
    return 'operational';
  }

  // Abstract fallback method that must be implemented
  protected abstract getFallbackResponse(input: any): any;

  // Utility method for retry logic
  protected async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        return await Promise.race([
          fn(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), this.config.timeout)
          )
        ]);
      } catch (error) {
        lastError = error;
        if (attempt < this.config.retries) {
          await this.delay(attempt * 1000); // Exponential backoff
        }
      }
    }
    
    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
} 