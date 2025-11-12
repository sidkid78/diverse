/**
 * Backend Services Index
 * Central export for all backend services
 */

export { AgentOrchestrator, agentOrchestrator } from './AgentOrchestrator';
export { PlanExecutor, planExecutor } from './PlanExecutor';
export { EventLogger, eventLogger } from './EventLogger';
export { default as agentToolsManager } from '@/lib/tools';

// Re-export types
export type { AgentConfig } from './AgentOrchestrator';
export type { ExecutionContext } from './PlanExecutor';

