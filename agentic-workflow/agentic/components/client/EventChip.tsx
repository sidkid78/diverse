'use client';

import React from 'react';
import { getEventColor, formatTimestamp } from '@/lib/utils';
import { EventLog } from '@/types';
import { cn } from '@/lib/utils';

interface EventChipProps {
  event: EventLog;
  onClick?: () => void;
  className?: string;
}

export function EventChip({ event, onClick, className }: EventChipProps) {
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'TOOL_CALL':
        return '🔧';
      case 'MODEL_CALL':
        return '🤖';
      case 'AGENT_SPAWN':
        return '🚀';
      case 'ERROR':
        return '❌';
      case 'STATUS_CHANGE':
        return '📊';
      case 'PLAN_UPDATE':
        return '📝';
      default:
        return '📋';
    }
  };

  const getEventDescription = (event: EventLog): string => {
    switch (event.event_type) {
      case 'TOOL_CALL':
        return `${event.payload.tool_name}(${event.payload.file_path || event.payload.args || ''})`;
      case 'MODEL_CALL':
        return 'Thinking...';
      case 'AGENT_SPAWN':
        return `Spawned ${event.payload.agent_name}`;
      case 'ERROR':
        return event.payload.message as string || 'Error occurred';
      case 'STATUS_CHANGE':
        return `Status: ${event.payload.new_status}`;
      case 'PLAN_UPDATE':
        return 'Plan updated';
      default:
        return event.event_type;
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50',
        getEventColor(event.event_type),
        className
      )}
      onClick={onClick}
    >
      <span className="text-sm">{getEventIcon(event.event_type)}</span>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium truncate">
          {getEventDescription(event)}
        </span>
        <span className="text-xs opacity-70">
          {formatTimestamp(event.timestamp)}
        </span>
      </div>
    </div>
  );
}
