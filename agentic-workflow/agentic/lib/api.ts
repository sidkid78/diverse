import { 
    Task, 
    Agent, 
    Plan, 
    CreateTaskResponse, 
    EventLog, 
    AIDoc, 
    PlanTemplate, 
    ReusablePrompt,
    TaskVariant 
  } from '@/types';
  
  // Safe base URL that defaults to Next.js API routes
  const getAPIBaseURL = (): string => {
    // In browser, always use relative paths to Next.js API routes
    if (typeof window !== 'undefined') {
      return '/api';
    }
    
    // On server, use environment variable or default to localhost
    return process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3000/api';
  };
  
  class APIClient {
    private buildURL(endpoint: string): string {
      const baseURL = getAPIBaseURL();
      
      // Ensure endpoint starts with /
      const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      
      // Build URL defensively
      try {
        if (baseURL.startsWith('http')) {
          return `${baseURL}${normalizedEndpoint}`;
        } else {
          // Relative URL for client-side requests
          return `${baseURL}${normalizedEndpoint}`;
        }
      } catch (error) {
        console.error('Failed to build API URL:', error);
        throw new Error(`Failed to build API URL: baseURL="${baseURL}", endpoint="${endpoint}"`);
      }
    }

    private async request<T>(
      endpoint: string, 
      options: RequestInit = {}
    ): Promise<T> {
      const url = this.buildURL(endpoint);
      
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        });
  
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText} (URL: ${url})`);
        }
  
        return response.json();
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error(`Network error: Failed to fetch from ${url}. Check if the API server is running and CORS is configured.`);
        }
        throw error;
      }
    }
  
    // Tasks
    async createTask(data: {
      plan_id: string;
      initial_context: string;
      model_preference: string;
      execution_environment?: {
        type: string;
        repo_url?: string;
        branch?: string;
      };
    }): Promise<CreateTaskResponse> {
      return this.request<CreateTaskResponse>('/v1/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  
    async getTask(taskId: string): Promise<Task> {
      return this.request<Task>(`/v1/tasks/${taskId}`);
    }
  
    async getTasks(): Promise<Task[]> {
      return this.request<Task[]>('/v1/tasks');
    }
  
    async pauseTask(taskId: string): Promise<void> {
      return this.request<void>(`/v1/tasks/${taskId}/pause`, {
        method: 'POST',
      });
    }
  
    async stopTask(taskId: string): Promise<void> {
      return this.request<void>(`/v1/tasks/${taskId}/stop`, {
        method: 'POST',
      });
    }
  
    // Agents
    async getAgent(agentId: string): Promise<Agent> {
      return this.request<Agent>(`/v1/agents/${agentId}`);
    }
  
    async getAgents(): Promise<Agent[]> {
      return this.request<Agent[]>('/v1/agents');
    }
  
    async steerAgent(agentId: string, instruction: string): Promise<void> {
      return this.request<void>(`/v1/agents/${agentId}/steer`, {
        method: 'POST',
        body: JSON.stringify({ next_instruction: instruction }),
      });
    }
  
    // Plans
    async createPlan(data: Omit<Plan, 'plan_id' | 'created_at'>): Promise<Plan> {
      return this.request<Plan>('/v1/plans', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  
    async getPlan(planId: string): Promise<Plan> {
      return this.request<Plan>(`/v1/plans/${planId}`);
    }
  
    async getPlans(): Promise<Plan[]> {
      return this.request<Plan[]>('/v1/plans');
    }
  
    async updatePlan(planId: string, data: Partial<Plan>): Promise<Plan> {
      return this.request<Plan>(`/v1/plans/${planId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    }
  
    async deletePlan(planId: string): Promise<void> {
      return this.request<void>(`/v1/plans/${planId}`, {
        method: 'DELETE',
      });
    }
  
    // Event Logs
    async getTaskEvents(taskId: string): Promise<EventLog[]> {
      return this.request<EventLog[]>(`/v1/tasks/${taskId}/events`);
    }
  
    // AI Docs
    async createAIDoc(data: Omit<AIDoc, 'doc_id' | 'created_at' | 'updated_at'>): Promise<AIDoc> {
      return this.request<AIDoc>('/v1/ai-docs', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  
    async getAIDocs(): Promise<AIDoc[]> {
      return this.request<AIDoc[]>('/v1/ai-docs');
    }
  
    async updateAIDoc(docId: string, data: Partial<AIDoc>): Promise<AIDoc> {
      return this.request<AIDoc>(`/v1/ai-docs/${docId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    }
  
    async deleteAIDoc(docId: string): Promise<void> {
      return this.request<void>(`/v1/ai-docs/${docId}`, {
        method: 'DELETE',
      });
    }
  
    // Plan Templates
    async createPlanTemplate(data: Omit<PlanTemplate, 'template_id' | 'created_at' | 'updated_at'>): Promise<PlanTemplate> {
      return this.request<PlanTemplate>('/v1/plan-templates', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  
    async getPlanTemplates(): Promise<PlanTemplate[]> {
      return this.request<PlanTemplate[]>('/v1/plan-templates');
    }
  
    // Reusable Prompts
    async createReusablePrompt(data: Omit<ReusablePrompt, 'prompt_id' | 'created_at' | 'updated_at'>): Promise<ReusablePrompt> {
      return this.request<ReusablePrompt>('/v1/reusable-prompts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  
    async getReusablePrompts(): Promise<ReusablePrompt[]> {
      return this.request<ReusablePrompt[]>('/v1/reusable-prompts');
    }
  
    // Task Variants (for Best of N)
    async getTaskVariants(taskId: string): Promise<TaskVariant[]> {
      return this.request<TaskVariant[]>(`/v1/tasks/${taskId}/variants`);
    }
  }
  
  export const apiClient = new APIClient();
  
  // Mock data for development
  export const mockData = {
    tasks: [
      {
        task_id: 'task-1',
        plan_id: 'plan-1',
        status: 'IN_PROGRESS' as const,
        agents: [
          {
            agent_id: 'agent-1',
            task_id: 'task-1',
            name: 'Code-Analyzer',
            status: 'RUNNING' as const,
            model_preference: 'gemini-2.5-flash' as const,
            specialization: ['analysis', 'refactoring'],
            created_at: new Date().toISOString(),
          }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metrics: {
          elapsed_time: 120,
          estimated_cost: 50,
          files_touched: 3,
        }
      }
    ],
    plans: [
      {
        plan_id: 'plan-1',
        user_id: 'user-1',
        title: 'Refactor Authentication System',
        description: 'Refactor the user authentication flow to use JWT instead of session cookies',
        steps: [
          {
            step_id: 'step-1',
            instruction: 'Analyze the existing auth controller and identify all session-related logic',
            assigned_agents: ['agent-1'],
            context_files: ['src/auth/controller.ts', 'src/middleware/session.ts'],
            order: 1,
          }
        ],
        created_at: new Date().toISOString(),
      }
    ],
    eventLogs: [
      {
        event_id: 'event-1',
        agent_id: 'agent-1',
        task_id: 'task-1',
        timestamp: new Date().toISOString(),
        event_type: 'TOOL_CALL' as const,
        payload: { tool_name: 'read', file_path: 'src/auth/controller.ts' }
      }
    ]
  };
  
  // Helper function to get initial data for agent page
  export async function getAgentInitialData(agentId: string) {
    try {
      const [agent, events] = await Promise.all([
        apiClient.getAgent(agentId),
        // For now, we'll use mock data
        Promise.resolve(mockData.eventLogs.filter(e => e.agent_id === agentId))
      ]);
      
      return { agent, events };
    } catch (error) {
      console.error('Failed to fetch agent data:', error);
      // Return mock data for development
      return {
        agent: mockData.tasks[0].agents[0],
        events: mockData.eventLogs
      };
    }
  }
  export default APIClient;