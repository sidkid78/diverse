'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/client/StatusBadge';
import { EventChip } from '@/components/client/EventChip';
import { Agent, EventLog, MODEL_OPTIONS } from '@/types';
import { formatTimestamp } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { 
  Bot, 
  Settings, 
  Pause, 
  Play,
  AlertTriangle
} from 'lucide-react';

interface AgentSwimlaneProps {
  agent: Agent;
  events: EventLog[];
  isSelected: boolean;
  onSelect: () => void;
  onSteer: () => void;
  isPaused: boolean;
  onResume?: () => void;
}

export function AgentSwimlane({ 
  agent, 
  events, 
  isSelected, 
  onSelect, 
  onSteer, 
  isPaused,
  onResume
}: AgentSwimlaneProps) {
  const modelInfo = MODEL_OPTIONS[agent.model_preference!];
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return 'border-l-blue-500 bg-blue-50/50';
      case 'SUCCESS':
        return 'border-l-green-500 bg-green-50/50';
      case 'FAILED':
        return 'border-l-red-500 bg-red-50/50';
      case 'PENDING':
        return 'border-l-yellow-500 bg-yellow-50/50';
      default:
        return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  return (
    <Card 
      className={cn(
        'border-l-4 transition-all cursor-pointer',
        getAgentStatusColor(agent.status),
        isSelected && 'ring-2 ring-primary ring-offset-2',
        isPaused && 'opacity-60'
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        {/* Agent Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-primary" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{agent.name}</span>
                <StatusBadge status={agent.status} className="text-xs" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{modelInfo.icon} {modelInfo.label}</span>
                <span>•</span>
                <span>{agent.specialization?.join(', ')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {agent.status === 'RUNNING' && !isPaused && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onSteer();
                }}
                className="text-xs"
              >
                <Settings className="w-3 h-3 mr-1" />
                Steer
              </Button>
            )}
            
            {isPaused && onResume && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onResume();
                }}
                className="text-xs"
              >
                <Play className="w-3 h-3 mr-1" />
                Resume
              </Button>
            )}
            
            {isPaused && (
              <Badge variant="warning" className="text-xs">
                <Pause className="w-2 h-2 mr-1" />
                Paused
              </Badge>
            )}
          </div>
        </div>

        {/* Event Timeline */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Activity Timeline ({events.length} events)
          </div>
          
          {sortedEvents.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {sortedEvents.slice(-10).map((event, index) => ( // Show last 10 events
                <div key={`${event.event_id}-${event.timestamp}-${index}`} className="flex-shrink-0">
                  <EventChip 
                    event={event}
                    onClick={() => onSelect()}
                    className="text-xs"
                  />
                </div>
              ))}
              
              {sortedEvents.length > 10 && (
                <div className="flex-shrink-0 flex items-center px-2 py-1 text-xs text-muted-foreground">
                  +{sortedEvents.length - 10} more
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-xs text-muted-foreground">
              {agent.status === 'PENDING' ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  Waiting to start...
                </div>
              ) : agent.status === 'FAILED' ? (
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <AlertTriangle className="w-3 h-3" />
                  Agent encountered an error
                </div>
              ) : (
                'No activity yet'
              )}
            </div>
          )}
        </div>

        {/* Agent Stats */}
        {events.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="font-medium">
                  {events.filter(e => e.event_type === 'TOOL_CALL').length}
                </div>
                <div className="text-muted-foreground">Tool Calls</div>
              </div>
              <div>
                <div className="font-medium">
                  {events.filter(e => e.event_type === 'MODEL_CALL').length}
                </div>
                <div className="text-muted-foreground">AI Calls</div>
              </div>
              <div>
                <div className="font-medium">
                  {events.length > 0 ? formatTimestamp(events[events.length - 1].timestamp) : '-'}
                </div>
                <div className="text-muted-foreground">Last Activity</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
