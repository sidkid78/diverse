'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskVariant } from '@/types';
import { formatCost, formatDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { 
  CheckCircle, 
  Clock, 
  DollarSign, 
  FileText, 
  Trophy,
  MessageSquare,
  Code,
  TestTube,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus
} from 'lucide-react';

interface SolutionVariantProps {
  variant: TaskVariant;
  rank: number;
  isBest: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onApprove: () => void;
  onRequestRevisions: () => void;
}

export function SolutionVariant({
  variant,
  rank,
  isBest,
  isSelected,
  onSelect,
  onApprove,
  onRequestRevisions
}: SolutionVariantProps) {
  const [expandedFile, setExpandedFile] = useState<string | null>(null);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 2: return 'bg-gray-100 text-gray-800 border-gray-300';
      case 3: return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case 'created': return 'text-green-600 bg-green-50';
      case 'modified': return 'text-blue-600 bg-blue-50';
      case 'deleted': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const successRate = variant.metrics.tests_passed / Math.max(variant.metrics.tests_passed + variant.metrics.tests_failed, 1) * 100;

  return (
    <Card 
      className={cn(
        'h-full flex flex-col cursor-pointer transition-all hover:shadow-lg',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        isBest && 'border-yellow-500 bg-yellow-50/50'
      )}
      onClick={onSelect}
    >
      <CardHeader className="flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={getRankColor(rank)}>
                #{rank}
              </Badge>
              {isBest && (
                <Badge className="bg-yellow-500 text-white">
                  <Trophy className="w-3 h-3 mr-1" />
                  Best
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">{variant.summary}</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {variant.approach_description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Metrics Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-blue-500" />
            <div>
              <div className="font-medium">{formatDuration(variant.metrics.elapsed_time)}</div>
              <div className="text-xs text-muted-foreground">Duration</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-green-500" />
            <div>
              <div className="font-medium">{formatCost(variant.metrics.estimated_cost)}</div>
              <div className="text-xs text-muted-foreground">Cost</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-purple-500" />
            <div>
              <div className="font-medium">{variant.metrics.files_touched}</div>
              <div className="text-xs text-muted-foreground">Files</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <TestTube className="w-4 h-4 text-emerald-500" />
            <div>
              <div className="font-medium">{successRate.toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">Tests Pass</div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Test Results</div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-3 h-3" />
              {variant.metrics.tests_passed} passed
            </div>
            {variant.metrics.tests_failed > 0 && (
              <div className="flex items-center gap-1 text-red-600">
                <span className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="w-1 h-1 bg-white rounded-full"></span>
                </span>
                {variant.metrics.tests_failed} failed
              </div>
            )}
          </div>
        </div>

        {/* File Changes */}
        <div className="flex-1 space-y-2">
          <div className="text-sm font-medium">Code Changes</div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {variant.files_changed.map((file, index) => (
              <div key={index} className="border rounded-lg">
                <div 
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedFile(expandedFile === file.file_path ? null : file.file_path);
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Code className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm font-mono truncate">{file.file_path}</span>
                    <Badge className={cn('text-xs', getChangeTypeColor(file.change_type))}>
                      {file.change_type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-green-600 flex items-center gap-1">
                        <Plus className="w-2 h-2" />
                        {file.additions}
                      </span>
                      <span className="text-red-600 flex items-center gap-1">
                        <Minus className="w-2 h-2" />
                        {file.deletions}
                      </span>
                    </div>
                    {expandedFile === file.file_path ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
                
                {expandedFile === file.file_path && (
                  <div className="border-t bg-muted/30 p-3">
                    <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-32 overflow-y-auto">
                      <code>{file.diff}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 pt-4 border-t space-y-2">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onApprove();
            }}
            className="w-full"
            size="sm"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve & Merge
          </Button>
          
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.stopPropagation();
              onRequestRevisions();
            }}
            className="w-full"
            size="sm"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Request Revisions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
