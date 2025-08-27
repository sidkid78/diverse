'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/client/StatusBadge';
import { AgentSwimlane } from '@/components/client/AgentSwimlane';
import { AgentInspector } from '@/components/client/AgentInspector';
import { useLiveOpsStore } from '@/lib/store';
import { formatDuration, formatCost } from '@/lib/utils';
import { 
  ArrowLeft, 
  Pause, 
  Play, 
  Square, 
  Activity,
  Clock,
  DollarSign,
  FileText,
  Users,
  Settings,
  Trophy
} from 'lucide-react';
import Link from 'next/link';

interface LiveOpsMonitorProps {
  taskId: string;
}

// Mock data for development
const mockTask = {
  task_id: 'task-1',
  plan_id: 'plan-1',
  title: 'Authentication Refactor',
  description: 'Refactor user authentication flow to use JWT instead of session cookies',
  status: 'IN_PROGRESS' as const,
  agents: [
    {
      agent_id: 'agent-1',
      name: 'Code-Analyzer',
      status: 'RUNNING' as const,
      model_preference: 'gemini-2.5-flash' as const,
      specialization: ['analysis', 'refactoring'],
      task_id: 'task-1',
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      agent_id: 'agent-2',
      name: 'Test-Writer',
      status: 'PENDING' as const,
      model_preference: 'gemini-2.0-pro' as const,
      specialization: ['testing', 'unit-tests'],
      task_id: 'task-1',
      created_at: new Date(Date.now() - 3000000).toISOString()
    }
  ],
  created_at: new Date(Date.now() - 3600000).toISOString(),
  updated_at: new Date().toISOString(),
  metrics: {
    elapsed_time: 3600,
    estimated_cost: 1250,
    files_touched: 8,
    tests_passed: 12,
    tests_failed: 0
  }
};

const mockEvents = [
  {
    event_id: 'event-1',
    agent_id: 'agent-1',
    task_id: 'task-1',
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
    event_type: 'TOOL_CALL' as const,
    payload: { tool_name: 'read', file_path: 'src/auth/controller.ts' }
  },
  {
    event_id: 'event-2',
    agent_id: 'agent-1',
    task_id: 'task-1',
    timestamp: new Date(Date.now() - 240000).toISOString(), // 4 min ago
    event_type: 'MODEL_CALL' as const,
    payload: { model: 'gemini-2.5-flash' }
  },
  {
    event_id: 'event-3',
    agent_id: 'agent-1',
    task_id: 'task-1',
    timestamp: new Date(Date.now() - 180000).toISOString(), // 3 min ago
    event_type: 'TOOL_CALL' as const,
    payload: { tool_name: 'edit', file_path: 'src/auth/controller.ts' }
  },
  {
    event_id: 'event-4',
    agent_id: 'agent-1',
    task_id: 'task-1',
    timestamp: new Date(Date.now() - 120000).toISOString(), // 2 min ago
    event_type: 'STATUS_CHANGE' as const,
    payload: { old_status: 'RUNNING', new_status: 'RUNNING' }
  }
];

export function LiveOpsMonitor({ taskId }: LiveOpsMonitorProps) {
  const {
    eventStream,
    selectedAgent,
    isPaused,
    setTask,
    addEventLog,
    setSelectedAgent,
    togglePause
  } = useLiveOpsStore();

  const [isConnected, setIsConnected] = useState(false);

  // Initialize with mock data
  useEffect(() => {
    setTask(mockTask);
    mockEvents.forEach(event => addEventLog(event));
    setIsConnected(true);
  }, [setTask, addEventLog]);

  // Simulate real-time events (in production, this would be SSE)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const newEvent = {
        event_id: `event-${Date.now()}`,
        agent_id: 'agent-1',
        task_id: taskId,
        timestamp: new Date().toISOString(),
        event_type: 'MODEL_CALL' as const,
        payload: { model: 'gemini-2.5-flash', action: 'thinking' }
      };
      addEventLog(newEvent);
    }, 10000); // Add new event every 10 seconds

    return () => clearInterval(interval);
  }, [isPaused, taskId, addEventLog]);

  const handlePauseTask = () => {
    togglePause();
  };

  const handleStopTask = () => {
    // In production, this would call the API to stop the task
    console.log('Stopping task:', taskId);
  };

  const handleSteerAgent = (agentId: string) => {
    const instruction = prompt('Enter steering instruction for the agent:');
    if (instruction) {
      console.log('Steering agent:', agentId, 'with instruction:', instruction);
      // In production, this would call the API
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tasks">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tasks
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{mockTask.title}</h1>
            <p className="text-muted-foreground">{mockTask.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
          <StatusBadge status={mockTask.status} />
        </div>
      </div>

      {/* Mission Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Mission Status
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePauseTask}
                disabled={mockTask.status !== 'IN_PROGRESS'}
              >
                {isPaused ? (
                  <>
                    <Play className="w-3 h-3 mr-1" />
                    Resume All
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 mr-1" />
                    Pause All
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleStopTask}
                disabled={mockTask.status !== 'IN_PROGRESS'}
                className="text-red-600 hover:text-red-700"
              >
                <Square className="w-3 h-3 mr-1" />
                Stop Mission
              </Button>
              <Button
                size="sm"
                variant="default"
                asChild
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Link href={`/tasks/${taskId}/results`}>
                  <Trophy className="w-3 h-3 mr-1" />
                  View Results
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <div className="font-medium">{formatDuration(mockTask.metrics.elapsed_time)}</div>
                <div className="text-sm text-muted-foreground">Elapsed Time</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-medium">{formatCost(mockTask.metrics.estimated_cost)}</div>
                <div className="text-sm text-muted-foreground">Estimated Cost</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium">
                  {mockTask.agents.filter(a => a.status === 'RUNNING').length}/{mockTask.agents.length}
                </div>
                <div className="text-sm text-muted-foreground">Active Agents</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-orange-500" />
              <div>
                <div className="font-medium">{mockTask.metrics.files_touched}</div>
                <div className="text-sm text-muted-foreground">Files Modified</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Swimlanes */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        <div className="col-span-8 space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Agent Swimlanes</h2>
            <Badge variant="info">{mockTask.agents.length} agents</Badge>
            {isPaused && (
              <Badge variant="warning" className="flex items-center gap-1">
                <Pause className="w-3 h-3" />
                Paused
              </Badge>
            )}
          </div>
          
          <div className="space-y-4 h-full overflow-y-auto">
            {mockTask.agents.map((agent) => (
              <AgentSwimlane
                key={agent.agent_id}
                agent={agent}
                events={eventStream.filter(e => e.agent_id === agent.agent_id)}
                isSelected={selectedAgent === agent.agent_id}
                onSelect={() => setSelectedAgent(agent.agent_id)}
                onSteer={() => handleSteerAgent(agent.agent_id)}
                isPaused={isPaused}
              />
            ))}
          </div>
        </div>

        {/* Agent Inspector */}
        <div className="col-span-4">
          {selectedAgent ? (
            <AgentInspector
              agent={mockTask.agents.find(a => a.agent_id === selectedAgent)!}
              events={eventStream.filter(e => e.agent_id === selectedAgent)}
              onClose={() => setSelectedAgent(undefined)}
            />
          ) : (
            <Card className="h-full">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="font-medium mb-2">Agent Inspector</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on an agent in the swimlanes to inspect its activity
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
