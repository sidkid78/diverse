'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
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
      className={cn('font-medium', className)}
    >
      {status}
    </Badge>
  );
}
