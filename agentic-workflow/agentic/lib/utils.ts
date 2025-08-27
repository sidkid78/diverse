import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export function formatCost(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString();
}

export function getEventColor(eventType: string): string {
  const colors = {
    TOOL_CALL: 'bg-blue-100 text-blue-800 border-blue-200',
    MODEL_CALL: 'bg-green-100 text-green-800 border-green-200',
    AGENT_SPAWN: 'bg-purple-100 text-purple-800 border-purple-200',
    ERROR: 'bg-red-100 text-red-800 border-red-200',
    STATUS_CHANGE: 'bg-gray-100 text-gray-800 border-gray-200',
    PLAN_UPDATE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };
  return colors[eventType as keyof typeof colors] || colors.STATUS_CHANGE;
}

export function getStatusColor(status: string): string {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    RUNNING: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    SUCCESS: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
