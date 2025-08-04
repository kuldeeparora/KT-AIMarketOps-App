// packages/ai-insights/src/index.ts - Enhanced exports
export * from './rag';
export * from './agents';
export * from './workflows';
export * from './models';
export * from './observability';
export * from './types';
export * from './mcp';
export * from './agi';

// New exports for enhanced functionality
export { AdvancedRAGSystem } from './rag/advanced-rag';
export { AutonomousInventoryAgent } from './agents/autonomous-inventory-agent';
export { LangSmithClient } from './observability/langsmith-client';
export { MCPClient } from './mcp/client';

// AGI Exports
export { AGICore } from './agi/agi-core';
export { AGIBusinessAgent } from './agi/agi-business-agent';
export { AGIConsciousness } from './agi/agi-consciousness';

// Unified AI/AGI System
export { UnifiedAISystem } from './unified-ai-system';