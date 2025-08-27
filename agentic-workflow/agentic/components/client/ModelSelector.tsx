'use client';

import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MODEL_OPTIONS, ModelPreference } from '@/types';

interface ModelSelectorProps {
  value: ModelPreference;
  onValueChange: (value: ModelPreference) => void;
  className?: string;
}

export function ModelSelector({ value, onValueChange, className }: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(MODEL_OPTIONS).map(([key, option]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{option.icon}</span>
              <div className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </div>
              <Badge 
                variant={
                  option.cost_tier === 'low' ? 'success' : 
                  option.cost_tier === 'medium' ? 'warning' : 
                  'destructive'
                }
                className="ml-auto"
              >
                {option.cost_tier}
              </Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
