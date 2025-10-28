// API Client for the Agentic Workflow Platform

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export type RunMode = 'single' | 'best-of-n';

export interface PlanCreatePayload {
  name: string;
  description?: string;
  estimated_cost?: number;
}

export interface TaskCreatePayload {
  title: string;
  description?: string;
  agents?: unknown[];
  run_mode?: RunMode;
  parallel_runs?: number;
  estimated_cost?: number;
}

export interface ApiTask {
  task_id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  created_at: string;
  updated_at: string;
  agents: unknown[];
  run_mode: RunMode;
  parallel_runs: number;
  metrics: {
    elapsed_time: number;
    estimated_cost: number;
    files_touched: number;
    tests_passed: number;
    tests_failed: number;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Health Check
  async getHealth() {
    return this.request('/health');
  }

  // Tasks API
  async getTasks(params?: { status?: string; limit?: number; offset?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    
    const query = searchParams.toString();
    return this.request(`/tasks${query ? `?${query}` : ''}`);
  }

  async getTask(taskId: string) {
    return this.request(`/tasks/${taskId}`);
  }

  async createTask(taskData: TaskCreatePayload) {
    return this.request<{ task: ApiTask; message: string }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId: string, updateData: TaskCreatePayload) {
    return this.request<{ task: ApiTask }>('/tasks/' + taskId, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteTask(taskId: string) {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // Agent Control API
  async controlAgent(taskId: string, agentId: string, action: string, payload?: unknown) {
    return this.request(`/tasks/${taskId}/agents/${agentId}`, {
      method: 'POST',
      body: JSON.stringify({ action, payload }),
    });
  }

  async getAgent(taskId: string, agentId: string) {
    return this.request(`/tasks/${taskId}/agents/${agentId}`);
  }

  // Plans API
  async getPlans(params?: { search?: string; tags?: string[]; limit?: number; offset?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.tags) searchParams.append('tags', params.tags.join(','));
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    
    const query = searchParams.toString();
    return this.request(`/plans${query ? `?${query}` : ''}`);
  }

  async getPlan(planId: string) {
    return this.request(`/plans/${planId}`);
  }

  async createPlan(planData: PlanCreatePayload) {
    return this.request('/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  }

  async updatePlan(planId: string, updateData: PlanCreatePayload) {
    return this.request(`/plans/${planId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deletePlan(planId: string) {
    return this.request(`/plans/${planId}`, {
      method: 'DELETE',
    });
  }

  async executePlan(planId: string, executionData: { agents?: unknown[]; run_mode?: RunMode; parallel_runs?: number }) {
    return this.request<{ task: ApiTask; message: string }>(`/plans/${planId}/execute`, {
      method: 'POST',
      body: JSON.stringify(executionData),
    });
  }

  // Server-Sent Events for task streaming
  createTaskStream(taskId: string): EventSource {
    const url = `${this.baseUrl}/api/tasks/${taskId}/stream`;
    return new EventSource(url);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types for better TypeScript support
export interface TaskResponse {
  tasks: TaskCreatePayload[];
  total: number;
  limit: number;
  offset: number;
}

export interface PlanResponse {
  plans: PlanCreatePayload[];
  total: number;
  limit: number;
  offset: number;
}

export interface ApiError {
  error: string;
  message?: string;
}
