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

export function LiveOpsMonitor({ taskId }: LiveOpsMonitorProps) {
  const {
    task,
    eventStream,
    selectedAgent,
    isPaused,
    setTask,
    addEventLog,
    setSelectedAgent,
    togglePause
  } = useLiveOpsStore();

  const [isConnected, setIsConnected] = useState(false);

  // Initial fetch of task status
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/tasks/${taskId}/status`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        if (data?.task) setTask(data.task);
        if (Array.isArray(data?.events)) data.events.forEach((e: any) => addEventLog(e));
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [taskId, setTask, addEventLog]);

  // Live stream via SSE
  useEffect(() => {
    const es = new EventSource(`/api/tasks/${taskId}/stream`);
    es.onopen = () => setIsConnected(true);
    es.onerror = () => setIsConnected(false);
    es.onmessage = (ev) => {
      if (isPaused) return;
      try {
        const parsed = JSON.parse(ev.data);
        // Skip connect messages
        if (parsed?.type === 'connected') return;
        addEventLog(parsed);
      } catch {}
    };
    return () => es.close();
  }, [taskId, isPaused, addEventLog]);

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
            <h1 className="text-2xl font-bold">{task?.title || 'Task'}</h1>
            <p className="text-muted-foreground">{task?.description || 'No description'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
          <StatusBadge status={(task?.status as any) || 'PENDING'} />
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
                disabled={task?.status !== 'IN_PROGRESS'}
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
                disabled={task?.status !== 'IN_PROGRESS'}
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
                <div className="font-medium">{formatDuration(task?.metrics?.elapsed_time || 0)}</div>
                <div className="text-sm text-muted-foreground">Elapsed Time</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-medium">{formatCost(task?.metrics?.estimated_cost || 0)}</div>
                <div className="text-sm text-muted-foreground">Estimated Cost</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium">
                  {(task?.agents || []).filter(a => a.status === 'RUNNING').length}/{task?.agents?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Active Agents</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-orange-500" />
              <div>
                <div className="font-medium">{task?.metrics?.files_touched || 0}</div>
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
            <Badge variant="info">{task?.agents?.length || 0} agents</Badge>
            {isPaused && (
              <Badge variant="warning" className="flex items-center gap-1">
                <Pause className="w-3 h-3" />
                Paused
              </Badge>
            )}
          </div>
          
          <div className="space-y-4 h-full overflow-y-auto">
            {(task?.agents || []).map((agent) => (
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
              agent={(task?.agents || []).find(a => a.agent_id === selectedAgent)!}
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
