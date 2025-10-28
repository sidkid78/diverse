/**
 * Plan Executor Service
 * Executes plans by coordinating agents and managing task flow
 */

import { v4 as uuidv4 } from 'uuid';
import { agentOrchestrator } from './AgentOrchestrator';
import { getFileContent, parseRepoUrl } from '../github';
import type { Task, EventLog, ModelPreference } from '@/types';

// Type for AI-generated plan steps
export interface GeneratedPlanStep {
  step_description: string;
  agent_name: string;
  agent_specialization: string[];
  model_preference: ModelPreference;
  estimated_duration: number;
  dependencies: number[];
}

export interface ExecutionContext {
  repo_url: string;
  context_files: string[];
  additional_instructions?: string;
}

export class PlanExecutor {
  private tasks: Map<string, Task>;
  private plans: Map<string, GeneratedPlanStep[]>; // Store plans by task_id
  private contexts: Map<string, ExecutionContext>; // Store contexts by task_id
  private eventCallbacks: ((event: EventLog) => void)[];

  constructor() {
    this.tasks = new Map();
    this.plans = new Map();
    this.contexts = new Map();
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
   * Create a new task from a plan
   */
  async createTask(plan: GeneratedPlanStep[], context: ExecutionContext): Promise<Task> {
    const taskId = uuidv4();
    const task: Task = {
      task_id: taskId,
      plan_id: `plan-${taskId}`, // Generate a plan ID based on task ID
      status: 'PENDING',
      agents: [], // Will be populated during execution
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.tasks.set(task.task_id, task);
    this.plans.set(task.task_id, plan);
    this.contexts.set(task.task_id, context);

    this.emitEvent({
      event_id: uuidv4(),
      timestamp: new Date().toISOString(),
      agent_id: '', // System event, no specific agent
      task_id: task.task_id,
      event_type: 'STATUS_CHANGE',
      payload: {
        plan_steps: plan.length,
        repo_url: context.repo_url,
      },
    });

    return task;
  }

  /**
   * Load context files from repository
   */
  private async loadContextFiles(repoUrl: string, contextFiles: string[]): Promise<string> {
    const repoInfo = parseRepoUrl(repoUrl);
    if (!repoInfo) {
      throw new Error('Invalid repository URL');
    }

    const { owner, repo } = repoInfo;
    const contextContent: string[] = [];

    for (const filePath of contextFiles) {
      try {
        const content = await getFileContent(owner, repo, filePath);
        contextContent.push(`\n--- File: ${filePath} ---\n${content}\n`);
      } catch (error) {
        console.error(`Failed to load context file ${filePath}:`, error);
        contextContent.push(`\n--- File: ${filePath} (Error loading) ---\n`);
      }
    }

    return contextContent.join('\n');
  }

  /**
   * Execute a single plan step
   */
  private async executePlanStep(
    taskId: string,
    step: GeneratedPlanStep,
    contextContent: string
  ): Promise<string> {
    // Create agent for this step
    const agent = agentOrchestrator.createAgent({
      name: step.agent_name,
      specialization: step.agent_specialization || [],
      model_preference: step.model_preference,
      task_id: taskId,
    });

    this.emitEvent({
      event_id: uuidv4(),
      timestamp: new Date().toISOString(),
      agent_id: agent.agent_id,
      task_id: taskId,
      event_type: 'PLAN_UPDATE',
      payload: {
        step_description: step.step_description,
      },
    });

    // Build prompt with context
    const systemInstruction = `You are ${step.agent_name}, a specialized AI agent.
Your role: ${step.step_description}
${step.agent_specialization ? `Specializations: ${step.agent_specialization.join(', ')}` : ''}

Repository Context:
${contextContent}

Please complete your assigned task thoughtfully and provide a detailed response.`;

    const prompt = `Task: ${step.step_description}

Please analyze the provided context and complete this task. Provide your solution with clear explanations.`;

    try {
      const result = await agentOrchestrator.executeAgent(agent.agent_id, prompt, systemInstruction);

      this.emitEvent({
        event_id: uuidv4(),
        timestamp: new Date().toISOString(),
        agent_id: agent.agent_id,
        task_id: taskId,
        event_type: 'PLAN_UPDATE',
        payload: {
          step_description: step.step_description,
          result_preview: result.substring(0, 200),
        },
      });

      return result;
    } catch (error) {
      this.emitEvent({
        event_id: uuidv4(),
        timestamp: new Date().toISOString(),
        agent_id: agent.agent_id,
        task_id: taskId,
        event_type: 'ERROR',
        payload: {
          step_description: step.step_description,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  /**
   * Execute a complete plan
   */
  async executePlan(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    const plan = this.plans.get(taskId);
    const context = this.contexts.get(taskId);

    if (!task || !plan || !context) {
      throw new Error(`Task ${taskId} not found or incomplete`);
    }

    task.status = 'IN_PROGRESS';
    task.updated_at = new Date().toISOString();

    try {
      // Load context files
      const contextContent = await this.loadContextFiles(context.repo_url, context.context_files);

      // Execute each plan step
      const results: { step: GeneratedPlanStep; result: string }[] = [];

      for (const step of plan) {
        const result = await this.executePlanStep(task.task_id, step, contextContent);
        results.push({ step, result });
      }

      task.status = 'COMPLETED';
      task.updated_at = new Date().toISOString();

      this.emitEvent({
        event_id: uuidv4(),
        timestamp: new Date().toISOString(),
        agent_id: '', // System event, no specific agent
        task_id: taskId,
        event_type: 'STATUS_CHANGE',
        payload: {
          steps_completed: results.length,
        },
      });
    } catch (error) {
      task.status = 'FAILED';
      task.updated_at = new Date().toISOString();

      this.emitEvent({
        event_id: uuidv4(),
        timestamp: new Date().toISOString(),
        agent_id: '', // System event, no specific agent
        task_id: taskId,
        event_type: 'ERROR',
        payload: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  /**
   * Get task by ID
   */
  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Update task status
   */
  updateTaskStatus(taskId: string, status: Task['status']) {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = status;
      task.updated_at = new Date().toISOString();
    }
  }

  /**
   * Clear all tasks
   */
  clear() {
    this.tasks.clear();
  }
}

// Singleton instance
export const planExecutor = new PlanExecutor();

