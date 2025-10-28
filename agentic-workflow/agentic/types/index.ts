// Core data models for the agentic workflow platform
export interface Agent {
    agent_id: string;
    parent_agent_id?: string;
    task_id: string;
    status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
    model_preference: ModelPreference;
    name: string;
    specialization: string[];
    created_at: string;
    finished_at?: string;
  }
  
export interface AgentConfig {
    name: string;
    model: ModelPreference;
    specialization: string[];
    system_prompt: string;
  }

  export interface Plan {
    plan_id: string;
    user_id: string;
    title: string;
    description: string;
    steps: PlanStep[];
    created_at: string;
  }
  
  export interface PlanStep {
    step_id: string;
    instruction: string;
    assigned_agents: string[];
    context_files: string[];
    order: number;
  }
  
  export interface Task {
    task_id: string;
    plan_id: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    execution_environment_id?: string;
    agents: Agent[];
    created_at: string;
    updated_at: string;
    metrics?: TaskMetrics;
  }
  
  export interface TaskMetrics {
    elapsed_time: number;
    estimated_cost: number;
    files_touched: number;
    tests_passed?: number;
    tests_failed?: number;
  }
  
  export interface Context {
    context_id: string;
    agent_id: string;
    turn_index: number;
    role: 'user' | 'assistant' | 'tool';
    content: string;
    created_at: string;
  }
  
  export interface EventLog {
    event_id: string;
    agent_id: string;
    task_id: string;
    timestamp: string;
    event_type: 'MODEL_CALL' | 'TOOL_CALL' | 'AGENT_SPAWN' | 'PLAN_UPDATE' | 'STATUS_CHANGE' | 'ERROR';
    payload: Record<string, unknown>;
  }
  
  export interface AIDoc {
    doc_id: string;
    title: string;
    content: string;
    file_type: 'markdown' | 'pdf' | 'text' | 'image';
    tags: string[];
    created_at: string;
    updated_at: string;
  }
  
  export interface PlanTemplate {
    template_id: string;
    title: string;
    description: string;
    steps: Omit<PlanStep, 'step_id'>[];
    tags: string[];
    created_at: string;
    updated_at: string;
  }
  
  export interface ReusablePrompt {
    prompt_id: string;
    title: string;
    content: string;
    variables: string[];
    tags: string[];
    created_at: string;
    updated_at: string;
  }
  
  // UI State types
  export interface MissionControlState {
    goal: string;
    plan: PlanStep[];
    agents: Partial<Agent>[];
    selectedContext: string[];
    runMode: 'single' | 'best-of-n';
    variantCount: number;
  }
  
  export interface LiveOpsState {
    task: Task;
    eventStream: EventLog[];
    selectedAgent?: string;
    isPaused: boolean;
  }
  
  export interface DebriefingState {
    variants: TaskVariant[];
    selectedVariant?: string;
  }
  
  export interface TaskVariant {
    task_id: string;
    summary: string;
    metrics: TaskMetrics;
    files_changed: FileChange[];
    approach_description: string;
  }
  
  export interface FileChange {
    file_path: string;
    change_type: 'created' | 'modified' | 'deleted';
    additions: number;
    deletions: number;
    diff: string;
  }
  
  // API Response types
  export interface CreateTaskResponse {
    task_id: string;
    status: string;
    observability_stream_url: string;
  }
  
  export interface StreamEvent {
    event_id: string;
    agent_id: string;
    timestamp: string;
    event_type: string;
    payload: Record<string, unknown>;
  }
  
  // Model preferences with display info
  export const MODEL_OPTIONS = {
    'gemini-2.5-flash': {
      label: 'Gemini 2.5 Flash (Latest)',
      description: 'Newest model with multimodal capabilities',
      icon: '🚀',
      cost_tier: 'medium',
    },
    'gemini-2.5-pro': {
      label: 'Gemini 2.5 Pro (High-Intellect)',
      description: 'Maximum capability for complex reasoning',
      icon: '🧠',
      cost_tier: 'high',
    },
    'gemini-2.5-flash-lite': {
      label: 'Gemini 2.5 Flash Lite',
      description: 'Smallest, most cost effective model',
      icon: '💡',
      cost_tier: 'low',
    },
    'gemini-2.0-pro': {
      label: 'Gemini 2.0 Pro (Speed)',
      description: 'Balanced multimodal with 1M context',
      icon: '⚡',
      cost_tier: 'low',
    },
  } as const;
  
  export type ModelPreference = keyof typeof MODEL_OPTIONS;
  
export interface PlanEntity {
  plan_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  author: string;
  tags: string[];
  steps: PlanStep[];
  context_files: string[];
  ai_docs: AIDoc[];
  estimated_cost: number;
  estimated_duration: number;
  success_criteria: string[];
}