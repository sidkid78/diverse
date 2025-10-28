'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TaskVariant } from '@/types';
import { formatCost, formatDuration } from '@/lib/utils';
import { 
  Clock, 
  DollarSign, 
  FileText, 
  TestTube,
  CheckCircle,
  XCircle,
  Code,
  Trophy,
  BarChart3
} from 'lucide-react';

interface ComparisonMatrixProps {
  variants: TaskVariant[];
}

interface MetricRowProps {
  label: string;
  icon: React.ReactNode;
  values: (string | number)[];
  bestIndex?: number;
  format?: (value: unknown) => React.ReactNode;
  type?: 'text' | 'number' | 'percentage' | 'currency' | 'duration';
}

function MetricRow({ label, icon, values, bestIndex, format, type = 'text' }: MetricRowProps) {
  const formatValue = (value: unknown): React.ReactNode => {
    if (format) return format(value);
    
    switch (type) {
      case 'currency':
        return formatCost(value as number);
      case 'duration':
        return formatDuration(value as number);
      case 'percentage':
        return `${value}%`;
      case 'number':
        return (value as number).toString();
      default:
        return value as React.ReactNode;
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4 border-b hover:bg-accent/30 transition-colors">
      <div className="flex items-center gap-2 font-medium">
        {icon}
        {label}
      </div>
      {values.map((value, index) => (
        <div 
          key={index} 
          className={`text-center p-2 rounded ${
            bestIndex === index ? 'bg-green-100 text-green-800 font-semibold' : ''
          }`}
        >
          {formatValue(value)}
        </div>
      ))}
    </div>
  );
}

export function ComparisonMatrix({ variants }: ComparisonMatrixProps) {
  if (variants.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-medium mb-2">No variants to compare</h3>
            <p className="text-sm text-muted-foreground">
              Generate multiple solutions to see the comparison matrix.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate best values for highlighting
  const getBestIndex = (values: number[], isLowerBetter = false) => {
    if (values.length === 0) return -1;
    const bestValue = isLowerBetter ? Math.min(...values) : Math.max(...values);
    return values.findIndex(v => v === bestValue);
  };

  const durations = variants.map(v => v.metrics.elapsed_time);
  const costs = variants.map(v => v.metrics.estimated_cost);
  const filesChanged = variants.map(v => v.metrics.files_touched);
  const testsPassedRates = variants.map(v => 
    (v.metrics.tests_passed || 0) / Math.max((v.metrics.tests_passed || 0) + (v.metrics.tests_failed || 0), 1) * 100
  );
  const totalChanges = variants.map(v => 
    v.files_changed.reduce((acc, file) => acc + file.additions + file.deletions, 0)
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Side-by-Side Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {/* Header Row */}
          <div className="grid grid-cols-4 gap-4 p-4 border-b bg-muted/50 font-semibold">
            <div>Metric</div>
            {variants.map((variant, index) => (
              <div key={variant.task_id} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Badge variant="outline">#{index + 1}</Badge>
                  {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                </div>
                <div className="text-sm font-medium truncate" title={variant.summary}>
                  {variant.summary}
                </div>
              </div>
            ))}
          </div>

          {/* Performance Metrics */}
          <div className="space-y-0">
            <MetricRow
              label="Duration"
              icon={<Clock className="w-4 h-4 text-blue-500" />}
              values={durations}
              bestIndex={getBestIndex(durations, true)} // Lower is better
              type="duration"
            />

            <MetricRow
              label="Cost"
              icon={<DollarSign className="w-4 h-4 text-green-500" />}
              values={costs}
              bestIndex={getBestIndex(costs, true)} // Lower is better
              type="currency"
            />

            <MetricRow
              label="Files Modified"
              icon={<FileText className="w-4 h-4 text-purple-500" />}
              values={filesChanged}
              type="number"
            />

            <MetricRow
              label="Test Success Rate"
              icon={<TestTube className="w-4 h-4 text-emerald-500" />}
              values={testsPassedRates}
              bestIndex={getBestIndex(testsPassedRates)} // Higher is better
              format={(value) => `${Math.round(value as number)}%`}
            />

            <MetricRow
              label="Total Code Changes"
              icon={<Code className="w-4 h-4 text-orange-500" />}
              values={totalChanges}
              type="number"
            />
          </div>

          {/* Test Details */}
          <div className="border-t bg-muted/20">
            <div className="grid grid-cols-4 gap-4 p-4 font-medium">
              <div>Test Results</div>
              {variants.map((variant) => (
                <div key={variant.task_id} className="text-center space-y-1">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      {variant.metrics.tests_passed}
                    </span>
                    {variant.metrics.tests_failed && variant.metrics.tests_failed > 0 && (
                      <span className="flex items-center gap-1 text-red-600">
                        <XCircle className="w-3 h-3" />
                        {variant.metrics.tests_failed}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* File Changes Summary */}
          <div className="border-t bg-muted/20">
            <div className="grid grid-cols-4 gap-4 p-4 font-medium">
              <div>Files Changed</div>
              {variants.map((variant) => (
                <div key={variant.task_id} className="text-center">
                  <div className="space-y-1">
                    {variant.files_changed.slice(0, 3).map((file, index) => (
                      <div key={index} className="text-xs font-mono truncate" title={file.file_path}>
                        {file.file_path.split('/').pop()}
                      </div>
                    ))}
                    {variant.files_changed.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{variant.files_changed.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Approach Summary */}
          <div className="border-t bg-muted/20">
            <div className="grid grid-cols-4 gap-4 p-4">
              <div className="font-medium">Approach</div>
              {variants.map((variant) => (
                <div key={variant.task_id} className="text-sm text-muted-foreground">
                  {variant.approach_description.substring(0, 100)}...
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t bg-muted/50">
            <div className="grid grid-cols-4 gap-4 p-4">
              <div className="font-medium">Actions</div>
              {variants.map((variant) => (
                <div key={variant.task_id} className="space-y-2">
                  <Button size="sm" className="w-full">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Revise
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
