/**
 * Agent Orchestrator Service
 * Manages agent lifecycle, spawning, and coordination
 */

import { v4 as uuidv4 } from 'uuid';
import { generateContent, generateContentStream } from '../gemini';
import type { Agent, EventLog, ModelPreference } from '@/types';

export interface AgentConfig {
  name: string;
  specialization: string[];
  model_preference: ModelPreference;
  parent_agent_id?: string;
  task_id: string;
}

export class AgentOrchestrator {
  private agents: Map<string, Agent>;
  private eventCallbacks: ((event: EventLog) => void)[];

  constructor() {
    this.agents = new Map();
    this.eventCallbacks = [];
  }

  /**
   * Register an event callback
   */
  onEvent(callback: (event: EventLog) => void) {
    this.eventCallbacks.push(callback);
  }

  /**
   * Emit an event to all registered callbacks
   */
  private emitEvent(event: EventLog) {
    this.eventCallbacks.forEach((callback) => callback(event));
  }

  /**
   * Create a new agent
   */
  createAgent(config: AgentConfig): Agent {
    const agent: Agent = {
      agent_id: uuidv4(),
      parent_agent_id: config.parent_agent_id,
      task_id: config.task_id,
      status: 'PENDING',
      model_preference: config.model_preference,
      name: config.name,
      specialization: config.specialization,
      created_at: new Date().toISOString(),
    };

    this.agents.set(agent.agent_id, agent);

    this.emitEvent({
      event_id: uuidv4(),
      timestamp: new Date().toISOString(),
      agent_id: agent.agent_id,
      task_id: agent.task_id,
      event_type: 'AGENT_SPAWN',
      payload: {
        agent_name: agent.name,
        specialization: agent.specialization,
      },
    });

    return agent;
  }

  /**
   * Spawn a child agent
   */
  spawnChildAgent(
    parentAgentId: string,
    taskId: string,
    name: string,
    specialization: string[],
    modelPreference: ModelPreference
  ): Agent {
    const parentAgent = this.agents.get(parentAgentId);
    if (!parentAgent) {
      throw new Error(`Parent agent ${parentAgentId} not found`);
    }

    return this.createAgent({
      name,
      specialization,
      model_preference: modelPreference,
      parent_agent_id: parentAgentId,
      task_id: taskId,
    });
  }

  /**
   * Update agent status
   */
  updateAgentStatus(agentId: string, status: Agent['status'], finishedAt?: string) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    agent.status = status;
    if (finishedAt) {
      agent.finished_at = finishedAt;
    }

    this.emitEvent({
      event_id: uuidv4(),
      timestamp: new Date().toISOString(),
      agent_id: agentId,
      task_id: agent.task_id,
      event_type: 'STATUS_CHANGE',
      payload: {
        old_status: agent.status,
        new_status: status,
      },
    });
  }

  /**
   * Execute agent task
   */
  async executeAgent(
    agentId: string,
    prompt: string,
    systemInstruction?: string
  ): Promise<string> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    this.updateAgentStatus(agentId, 'RUNNING');

    this.emitEvent({
      event_id: uuidv4(),
      timestamp: new Date().toISOString(),
      agent_id: agentId,
      task_id: agent.task_id,
      event_type: 'MODEL_CALL',
      payload: {
        prompt,
      },
    });

    try {
      const result = await generateContent(agent.model_preference, prompt, systemInstruction);

      this.updateAgentStatus(agentId, 'SUCCESS', new Date().toISOString());

      this.emitEvent({
        event_id: uuidv4(),
        timestamp: new Date().toISOString(),
        agent_id: agentId,
        task_id: agent.task_id,
        event_type: 'STATUS_CHANGE',
        payload: {
          result_length: result.length,
        },
      });

      return result;
    } catch (error) {
      this.updateAgentStatus(agentId, 'FAILED', new Date().toISOString());

      this.emitEvent({
        event_id: uuidv4(),
        timestamp: new Date().toISOString(),
        agent_id: agentId,
        task_id: agent.task_id,
        event_type: 'ERROR',
        payload: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  /**
   * Execute agent task with streaming
   */
  async *executeAgentStream(
    agentId: string,
    prompt: string,
    systemInstruction?: string
  ): AsyncGenerator<string> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    this.updateAgentStatus(agentId, 'RUNNING');

    this.emitEvent({
      event_id: uuidv4(),
      timestamp: new Date().toISOString(),
      agent_id: agentId,
      task_id: agent.task_id,
      event_type: 'MODEL_CALL',
      payload: {
        prompt,
      },
    });

    try {
      for await (const chunk of generateContentStream(
        agent.model_preference,
        prompt,
        systemInstruction
      )) {
        yield chunk;
      }

      this.updateAgentStatus(agentId, 'SUCCESS', new Date().toISOString());

      this.emitEvent({
        event_id: uuidv4(),
        timestamp: new Date().toISOString(),
        agent_id: agentId,
        task_id: agent.task_id,
        event_type: 'STATUS_CHANGE',
        payload: {},
      });
    } catch (error) {
      this.updateAgentStatus(agentId, 'FAILED', new Date().toISOString());

      this.emitEvent({
        event_id: uuidv4(),
        timestamp: new Date().toISOString(),
        agent_id: agentId,
        task_id: agent.task_id,
        event_type: 'ERROR',
        payload: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get all agents for a task
   */
  getAgentsByTask(taskId: string): Agent[] {
    return Array.from(this.agents.values()).filter((agent) => agent.task_id === taskId);
  }

  /**
   * Get child agents
   */
  getChildAgents(parentAgentId: string): Agent[] {
    return Array.from(this.agents.values()).filter(
      (agent) => agent.parent_agent_id === parentAgentId
    );
  }

  /**
   * Clear all agents
   */
  clear() {
    this.agents.clear();
  }
}

// Singleton instance
export const agentOrchestrator = new AgentOrchestrator();

