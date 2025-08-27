'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/client/StatusBadge';
import { EventChip } from '@/components/client/EventChip';
import { Agent, EventLog, MODEL_OPTIONS } from '@/types';
import { formatTimestamp } from '@/lib/utils';
import { 
  X, 
  Bot, 
  FileText, 
  MessageSquare, 
  Activity,
  Clock,
  Settings,
  Code,
  Terminal
} from 'lucide-react';

interface AgentInspectorProps {
  agent: Agent;
  events: EventLog[];
  onClose: () => void;
}

export function AgentInspector({ agent, events, onClose }: AgentInspectorProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventLog | null>(null);
  const modelInfo = MODEL_OPTIONS[agent.model_preference!];
  
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Mock workspace files for demonstration
  const mockWorkspaceFiles = [
    'src/auth/controller.ts',
    'src/auth/middleware.ts',
    'src/auth/service.ts',
    'tests/auth.test.ts',
    'temp/analysis.md'
  ];

  const getEventDetails = (event: EventLog) => {
    switch (event.event_type) {
      case 'TOOL_CALL':
        return {
          title: `Tool: ${event.payload.tool_name}`,
          description: event.payload.file_path || event.payload.args || 'No details',
          content: JSON.stringify(event.payload, null, 2)
        };
      case 'MODEL_CALL':
        return {
          title: 'AI Model Call',
          description: `Called ${event.payload.model || 'AI model'}`,
          content: event.payload.prompt || 'Thinking...'
        };
      case 'STATUS_CHANGE':
        return {
          title: 'Status Update',
          description: `${event.payload.old_status} → ${event.payload.new_status}`,
          content: event.payload.reason || 'Status changed'
        };
      case 'ERROR':
        return {
          title: 'Error',
          description: event.payload.message || 'An error occurred',
          content: event.payload.stack || event.payload.details || 'No error details available'
        };
      default:
        return {
          title: event.event_type,
          description: 'Event occurred',
          content: JSON.stringify(event.payload, null, 2)
        };
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-primary" />
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span>{modelInfo.icon} {modelInfo.label}</span>
                <StatusBadge status={agent.status} />
              </CardDescription>
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0">
        <Tabs defaultValue="activity" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity" className="text-xs">
              <Activity className="w-3 h-3 mr-1" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="workspace" className="text-xs">
              <FileText className="w-3 h-3 mr-1" />
              Workspace
            </TabsTrigger>
            <TabsTrigger value="context" className="text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />
              Context
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="flex-1 mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Event Log</h3>
              <Badge variant="outline" className="text-xs">
                {events.length} events
              </Badge>
            </div>

            <div className="space-y-2 h-full overflow-y-auto">
              {sortedEvents.map((event) => (
                <div
                  key={event.event_id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedEvent?.event_id === event.event_id
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-accent/50'
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <EventChip event={event} className="text-xs" />
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                  
                  {selectedEvent?.event_id === event.event_id && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="space-y-2">
                        <div className="text-xs font-medium">
                          {getEventDetails(event).title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getEventDetails(event).description}
                        </div>
                        <div className="text-xs bg-muted/50 rounded p-2 font-mono">
                          {getEventDetails(event).content}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {events.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No activity recorded yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="workspace" className="flex-1 mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Agent Workspace</h3>
              <Badge variant="outline" className="text-xs">
                {mockWorkspaceFiles.length} files
              </Badge>
            </div>

            <div className="space-y-2 h-full overflow-y-auto">
              {mockWorkspaceFiles.map((filePath, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded hover:bg-accent/50 cursor-pointer"
                >
                  <Code className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-mono">{filePath}</span>
                  <div className="ml-auto flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs">
                      Modified
                    </Badge>
                  </div>
                </div>
              ))}

              {mockWorkspaceFiles.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No files in workspace</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="context" className="flex-1 mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Current Task Context</h3>
              <Badge variant="outline" className="text-xs">
                Active
              </Badge>
            </div>

            <div className="space-y-4 h-full overflow-y-auto">
              {/* Agent Configuration */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Configuration</h4>
                <div className="bg-muted/50 rounded p-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Model:</span>
                    <span className="font-mono">{agent.model_preference}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Specializations:</span>
                    <span className="font-mono">{agent.specialization?.join(', ')}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-mono">{formatTimestamp(agent.created_at!)}</span>
                  </div>
                </div>
              </div>

              {/* Current Instructions */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Current Instructions</h4>
                <div className="bg-muted/50 rounded p-3 text-xs font-mono">
                  Analyze the existing authentication controller and identify all session-related logic that needs to be refactored for JWT implementation.
                </div>
              </div>

              {/* Memory/Context */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Memory Context</h4>
                <div className="bg-muted/50 rounded p-3 text-xs">
                  <div className="space-y-1">
                    <div>• Identified 3 session-related endpoints</div>
                    <div>• Found middleware dependency on express-session</div>
                    <div>• Located user authentication logic in controller</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
