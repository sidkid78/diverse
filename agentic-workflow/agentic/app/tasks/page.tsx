import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/client/StatusBadge';
import { formatDuration, formatCost } from '@/lib/utils';
import { 
  Eye, 
  Play, 
  Pause, 
  Square, 
  Users, 
  Clock,
  DollarSign,
  FileText,
  Plus,
  Trophy
} from 'lucide-react';

// Mock data for active tasks
const mockTasks = [
  {
    task_id: 'task-1',
    plan_id: 'plan-1',
    title: 'Authentication Refactor',
    description: 'Refactor user authentication flow to use JWT instead of session cookies',
    status: 'IN_PROGRESS' as const,
    agents: [
      { agent_id: 'agent-1', name: 'Code-Analyzer', status: 'RUNNING' as const },
      { agent_id: 'agent-2', name: 'Test-Writer', status: 'PENDING' as const }
    ],
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    metrics: {
      elapsed_time: 3600, // 1 hour in seconds
      estimated_cost: 1250, // in cents
      files_touched: 8,
      tests_passed: 12,
      tests_failed: 0
    }
  },
  {
    task_id: 'task-2',
    plan_id: 'plan-2',
    title: 'API Documentation Update',
    description: 'Generate comprehensive API documentation for all endpoints',
    status: 'COMPLETED' as const,
    agents: [
      { agent_id: 'agent-3', name: 'Doc-Generator', status: 'SUCCESS' as const }
    ],
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    metrics: {
      elapsed_time: 1800, // 30 minutes
      estimated_cost: 450,
      files_touched: 15,
      tests_passed: 8,
      tests_failed: 0
    }
  },
  {
    task_id: 'task-3',
    plan_id: 'plan-3',
    title: 'Database Migration',
    description: 'Migrate user table schema to support new authentication system',
    status: 'PENDING' as const,
    agents: [
      { agent_id: 'agent-4', name: 'DB-Migrator', status: 'PENDING' as const }
    ],
    created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    metrics: {
      elapsed_time: 0,
      estimated_cost: 0,
      files_touched: 0,
      tests_passed: 0,
      tests_failed: 0
    }
  }
];

export default function TasksPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Operations</h1>
          <p className="text-muted-foreground">
            Monitor active missions and agent performance in real-time
          </p>
        </div>
        <Button asChild>
          <Link href="/plans/new">
            <Plus className="w-4 h-4 mr-2" />
            New Mission
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {mockTasks.filter(t => t.status === 'IN_PROGRESS').length}
                </div>
                <p className="text-sm text-muted-foreground">Active Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {mockTasks.reduce((acc, task) => acc + task.agents.filter(a => a.status === 'RUNNING').length, 0)}
                </div>
                <p className="text-sm text-muted-foreground">Running Agents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatCost(mockTasks.reduce((acc, task) => acc + task.metrics.estimated_cost, 0))}
                </div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {mockTasks.reduce((acc, task) => acc + task.metrics.files_touched, 0)}
                </div>
                <p className="text-sm text-muted-foreground">Files Modified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Tasks */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Active Missions</h2>
          <Badge variant="info">{mockTasks.length} total</Badge>
        </div>

        <div className="grid gap-6">
          {mockTasks.map((task) => (
            <Card key={task.task_id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <StatusBadge status={task.status} />
                    </div>
                    <CardDescription>{task.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === 'IN_PROGRESS' && (
                      <>
                        <Button size="sm" variant="outline">
                          <Pause className="w-3 h-3 mr-1" />
                          Pause
                        </Button>
                        <Button size="sm" variant="outline">
                          <Square className="w-3 h-3 mr-1" />
                          Stop
                        </Button>
                      </>
                    )}
                    <Button size="sm" asChild>
                      <Link href={`/tasks/${task.task_id}`}>
                        <Eye className="w-3 h-3 mr-1" />
                        Monitor
                      </Link>
                    </Button>
                    {(task.status === 'COMPLETED' || task.status === 'FAILED') && (
                      <Button size="sm" variant="default" className="bg-yellow-600 hover:bg-yellow-700" asChild>
                        <Link href={`/tasks/${task.task_id}/results`}>
                          <Trophy className="w-3 h-3 mr-1" />
                          Results
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Agents */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Agents</div>
                    <div className="space-y-1">
                      {task.agents.map((agent) => (
                        <div key={agent.agent_id} className="flex items-center gap-2">
                          <StatusBadge status={agent.status} className="text-xs" />
                          <span className="text-sm">{agent.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Duration
                    </div>
                    <div className="text-sm font-medium">
                      {task.metrics.elapsed_time > 0 ? formatDuration(task.metrics.elapsed_time) : 'Not started'}
                    </div>
                  </div>

                  {/* Cost */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Cost
                    </div>
                    <div className="text-sm font-medium">
                      {formatCost(task.metrics.estimated_cost)}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Progress</div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        {task.metrics.files_touched} files • {task.metrics.tests_passed} tests passed
                      </div>
                      {task.metrics.tests_failed > 0 && (
                        <div className="text-xs text-red-600">
                          {task.metrics.tests_failed} tests failed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockTasks.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-medium mb-2">No active missions</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start a new mission to see real-time agent activity here.
              </p>
              <Button asChild>
                <Link href="/plans/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Mission
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
