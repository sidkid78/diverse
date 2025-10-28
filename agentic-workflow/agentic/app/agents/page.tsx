import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/client/StatusBadge';
import { 
  Users, 
  Plus, 
  Settings, 
  Activity,
  DollarSign,
  Brain
} from 'lucide-react';

// Mock agent data
const mockAgents = [
  {
    agent_id: 'agent-1',
    name: 'Code-Analyzer',
    status: 'RUNNING' as const,
    model_preference: 'gemini-2.5-flash',
    specialization: ['analysis', 'refactoring', 'code-review'],
    current_task: 'Analyzing authentication flow',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    metrics: {
      tasks_completed: 15,
      avg_completion_time: 1800,
      total_cost: 45.50,
      success_rate: 94
    }
  },
  {
    agent_id: 'agent-2',
    name: 'Test-Writer',
    status: 'SUCCESS' as const,
    model_preference: 'gemini-2.5-flash',
    specialization: ['testing', 'unit-tests', 'integration-tests'],
    current_task: null,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    metrics: {
      tasks_completed: 23,
      avg_completion_time: 1200,
      total_cost: 28.75,
      success_rate: 98
    }
  },
  {
    agent_id: 'agent-3',
    name: 'Doc-Generator',
    status: 'PENDING' as const,
    model_preference: 'gemini-2.5-pro',
    specialization: ['documentation', 'api-docs', 'readme'],
    current_task: 'Waiting for assignment',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    metrics: {
      tasks_completed: 8,
      avg_completion_time: 2400,
      total_cost: 67.20,
      success_rate: 100
    }
  }
];

export default function AgentsPage() {
  const getModelIcon = (model: string) => {
    if (model.includes('2.5-pro')) return '🧠';
    if (model.includes('2.5-flash')) return '🚀';
    return '⚡';
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-500" />
            Agent Workforce
          </h1>
          <p className="text-muted-foreground">Manage and monitor your AI agents</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Deploy New Agent
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAgents.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockAgents.filter(a => a.status === 'RUNNING').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAgents.reduce((sum, agent) => sum + agent.metrics.tasks_completed, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all agents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(mockAgents.reduce((sum, agent) => sum + agent.metrics.success_rate, 0) / mockAgents.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Quality score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCost(mockAgents.reduce((sum, agent) => sum + agent.metrics.total_cost, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              All-time spend
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agents List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockAgents.map((agent) => (
          <Card key={agent.agent_id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <StatusBadge status={agent.status} />
                  </div>
                  <CardDescription>
                    {agent.current_task || 'Idle'}
                  </CardDescription>
                </div>
                <div className="text-2xl">
                  {getModelIcon(agent.model_preference)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Model Info */}
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {agent.model_preference}
                </Badge>
              </div>

              {/* Specializations */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Specializations</div>
                <div className="flex flex-wrap gap-1">
                  {agent.specialization.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">{agent.metrics.tasks_completed}</div>
                  <div className="text-muted-foreground">Tasks</div>
                </div>
                <div>
                  <div className="font-medium">{agent.metrics.success_rate}%</div>
                  <div className="text-muted-foreground">Success</div>
                </div>
                <div>
                  <div className="font-medium">{formatDuration(agent.metrics.avg_completion_time)}</div>
                  <div className="text-muted-foreground">Avg Time</div>
                </div>
                <div>
                  <div className="font-medium">{formatCost(agent.metrics.total_cost)}</div>
                  <div className="text-muted-foreground">Total Cost</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  Configure
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  View Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
