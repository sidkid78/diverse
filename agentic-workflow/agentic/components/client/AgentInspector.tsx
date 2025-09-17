"use client";

/**
 * AgentInspector is a client-side React component that displays detailed information
 * and controls for a given agent, including its activity log, workspace files, context,
 * timeline, settings, and terminal output. It provides a tabbed interface for navigating
 * between these different aspects of the agent's state and behavior.
 *
 * Props:
 * - agent: The Agent object containing metadata and configuration.
 * - events: An array of EventLog objects representing the agent's recent activities.
 * - onClose: A callback function to close the inspector panel.
 *
 * Features:
 * - Activity: Shows a log of recent agent events, with expandable details.
 * - Workspace: Lists files in the agent's workspace (mocked for demonstration).
 * - Context: Displays current task context, configuration, and memory (mocked).
 * - Timeline: Visualizes a chronological sequence of key agent events (mocked).
 * - Settings: Allows adjustment of model and behavior settings (UI only).
 * - Terminal: Shows a history of terminal commands and outputs (mocked).
 */

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

  // Mock terminal commands for demonstration
  const mockTerminalCommands = [
    { command: 'npm test auth', output: '✓ All auth tests passing', timestamp: new Date(Date.now() - 300000) },
    { command: 'git status', output: 'On branch feature/jwt-auth\nModified: src/auth/controller.ts', timestamp: new Date(Date.now() - 600000) },
    { command: 'npm run lint', output: 'No linting errors found', timestamp: new Date(Date.now() - 900000) },
  ];

  // Mock timeline events for demonstration
  const mockTimelineEvents = [
    { time: '2 min ago', event: 'Started analyzing auth controller', type: 'info' },
    { time: '5 min ago', event: 'Identified session dependencies', type: 'success' },
    { time: '8 min ago', event: 'Created workspace files', type: 'info' },
    { time: '12 min ago', event: 'Agent initialized', type: 'success' },
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
          <TabsList className="grid w-full grid-cols-6">
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
            <TabsTrigger value="timeline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <Settings className="w-3 h-3 mr-1" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="terminal" className="text-xs">
              <Terminal className="w-3 h-3 mr-1" />
              Terminal
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
              {sortedEvents.slice(-10).map((event, idx) => (
                <div
                  key={`${event.event_id}-${idx}`}
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
                  
                  {selectedEvent?.event_id === event.event_id && selectedEvent && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="space-y-2">
                        <div className="text-xs font-medium">
                          {getEventDetails(event).title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getEventDetails(event).description as React.ReactNode}
                        </div>
                        <div className="text-xs bg-muted/50 rounded p-2 font-mono">
                          {getEventDetails(event).content as React.ReactNode}
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

          <TabsContent value="timeline" className="flex-1 mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Agent Timeline</h3>
              <Badge variant="outline" className="text-xs">
                {mockTimelineEvents.length} events
              </Badge>
            </div>

            <div className="space-y-3 h-full overflow-y-auto">
              {mockTimelineEvents.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    item.type === 'success' ? 'bg-green-500' : 
                    item.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.event}</span>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}

              {mockTimelineEvents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No timeline events recorded</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Agent Settings</h3>
              <Button size="sm" variant="outline" className="text-xs">
                Save Changes
              </Button>
            </div>

            <div className="space-y-4 h-full overflow-y-auto">
              {/* Model Configuration */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Model Configuration</h4>
                <div className="bg-muted/50 rounded p-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Temperature:</span>
                    <div className="flex items-center gap-2">
                      <input 
                        title="Temperature"
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        defaultValue="0.7" 
                        className="w-20 h-1"
                      />
                      <span className="text-xs font-mono w-8">0.7</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Max Tokens:</span>
                    <input 
                      title="Max Tokens"
                      type="number" 
                      defaultValue="2048" 
                      className="w-20 text-xs p-1 rounded border bg-background"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Top P:</span>
                    <div className="flex items-center gap-2">
                      <input 
                        title="Top P"
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        defaultValue="0.9" 
                        className="w-20 h-1"
                      />
                      <span className="text-xs font-mono w-8">0.9</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Behavior Settings */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Behavior Settings</h4>
                <div className="bg-muted/50 rounded p-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Auto-save workspace:</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" title="Auto-save workspace" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Verbose logging:</span>
                    <input type="checkbox" className="w-4 h-4" title="Verbose logging" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Auto-retry on error:</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" title="Auto-retry on error" />
                  </div>
                </div>
              </div>

              {/* Tool Permissions */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Tool Permissions</h4>
                <div className="bg-muted/50 rounded p-3 space-y-2">
                  {['File System', 'Terminal', 'Network', 'Database'].map((tool) => (
                    <div key={tool} className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{tool}:</span>
                      <Badge variant={tool === 'Network' ? 'destructive' : 'secondary'} className="text-xs">
                        {tool === 'Network' ? 'Denied' : 'Allowed'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="terminal" className="flex-1 mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Terminal Output</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {mockTerminalCommands.length} commands
                </Badge>
                <Button size="sm" variant="outline" className="text-xs">
                  Clear
                </Button>
              </div>
            </div>

            <div className="bg-black rounded-lg p-3 h-full overflow-y-auto font-mono text-sm">
              <div className="space-y-3">
                {mockTerminalCommands.map((cmd, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-green-400">
                      <span className="text-blue-400">agent@workspace</span>
                      <span className="text-white">:</span>
                      <span className="text-blue-400">~</span>
                      <span className="text-white">$ </span>
                      <span className="text-white">{cmd.command}</span>
                    </div>
                    <div className="text-gray-300 pl-4">
                      {cmd.output}
                    </div>
                    <div className="text-gray-500 text-xs pl-4">
                      {formatTimestamp(cmd.timestamp.toISOString())}
                    </div>
                  </div>
                ))}
                
                {/* Current prompt */}
                <div className="text-green-400">
                  <span className="text-blue-400">agent@workspace</span>
                  <span className="text-white">:</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-white">$ </span>
                  <span className="animate-pulse">_</span>
                </div>
              </div>

              {mockTerminalCommands.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No terminal commands executed</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
