// Module Factory - Centralized Component Management
import { z } from 'zod';

// Module registry schema
const ModuleRegistrySchema = z.object({
  name: z.string(),
  type: z.enum(['rag', 'agent', 'agi', 'consciousness', 'business']),
  status: z.enum(['active', 'inactive', 'error']),
  config: z.record(z.any()),
  lastUpdate: z.string()
});

export type ModuleRegistry = z.infer<typeof ModuleRegistrySchema>;

// Module interface
export interface IModule {
  name: string;
  type: string;
  init(): Promise<void>;
  run(input: any): Promise<any>;
  getStatus(): Promise<any>;
  isHealthy(): boolean;
}

// Module factory class
export class ModuleFactory {
  private modules: Map<string, IModule> = new Map();
  private registry: ModuleRegistry[] = [];

  // Register a module
  public registerModule(module: IModule): void {
    this.modules.set(module.name, module);
    
    const registryEntry: ModuleRegistry = {
      name: module.name,
      type: module.type as any,
      status: 'inactive', // Will be updated during initialization
      config: {},
      lastUpdate: new Date().toISOString()
    };
    
    this.registry.push(registryEntry);
  }

  // Get a module by name
  public getModule(name: string): IModule | undefined {
    return this.modules.get(name);
  }

  // Get all modules
  public getAllModules(): IModule[] {
    return Array.from(this.modules.values());
  }

  // Get modules by type
  public getModulesByType(type: string): IModule[] {
    return Array.from(this.modules.values()).filter(module => module.type === type);
  }

  // Initialize all modules
  public async initializeAll(): Promise<void> {
    const initPromises = Array.from(this.modules.values()).map(async (module) => {
      try {
        await module.init();
        this.updateRegistryStatus(module.name, 'active');
      } catch (error) {
        console.error(`Failed to initialize module ${module.name}:`, error);
        this.updateRegistryStatus(module.name, 'error');
      }
    });

    await Promise.allSettled(initPromises);
  }

  // Run a module
  public async runModule(name: string, input: any): Promise<any> {
    const module = this.getModule(name);
    if (!module) {
      throw new Error(`Module ${name} not found`);
    }

    try {
      const result = await module.run(input);
      this.updateRegistryStatus(name, 'active');
      return result;
    } catch (error) {
      this.updateRegistryStatus(name, 'error');
      throw error;
    }
  }

  // Get system status
  public async getSystemStatus(): Promise<any> {
    const moduleStatuses = await Promise.all(
      Array.from(this.modules.values()).map(async (module) => {
        try {
          const status = await module.getStatus();
          const healthy = typeof module.isHealthy === 'function' ? module.isHealthy() : true;
          
          return {
            name: module.name,
            type: module.type,
            status: status,
            healthy: healthy
          };
        } catch (error) {
          console.error(`Error getting status for module ${module.name}:`, error);
          return {
            name: module.name,
            type: module.type,
            status: { status: 'error', health: 0 },
            healthy: false
          };
        }
      })
    );

    const healthyModules = moduleStatuses.filter(m => m.healthy).length;
    const totalModules = moduleStatuses.length;
    const systemHealth = totalModules > 0 ? healthyModules / totalModules : 0;

    return {
      systemHealth,
      totalModules,
      healthyModules,
      modules: moduleStatuses,
      registry: this.registry
    };
  }

  // Update registry status
  private updateRegistryStatus(name: string, status: 'active' | 'inactive' | 'error'): void {
    const entry = this.registry.find(r => r.name === name);
    if (entry) {
      entry.status = status;
      entry.lastUpdate = new Date().toISOString();
    }
  }

  // Get registry
  public getRegistry(): ModuleRegistry[] {
    return [...this.registry];
  }

  // Clear all modules
  public clear(): void {
    this.modules.clear();
    this.registry = [];
  }
}

// Singleton instance
export const moduleFactory = new ModuleFactory(); 