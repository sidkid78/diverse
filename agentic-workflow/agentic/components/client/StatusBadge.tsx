'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
      case 'COMPLETED':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'FAILED':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'RUNNING':
      case 'IN_PROGRESS':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'PENDING':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getVariant = (status: string) => {
    switch (status) {
      case 'SUCCESS':
      case 'COMPLETED':
        return 'success' as const;
      case 'FAILED':
        return 'destructive' as const;
      case 'RUNNING':
      case 'IN_PROGRESS':
        return 'info' as const;
      case 'PENDING':
        return 'warning' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <Badge 
      variant={getVariant(status)} 
      className={cn('font-medium', getStatusColor(status), className)}
    >
      {status}
    </Badge>
  );
}
