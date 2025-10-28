import React from 'react';
import { LiveOpsMonitor } from '@/components/client/LiveOpsMonitor';

interface TaskPageProps {
  params: Promise<{ taskId: string }>;
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { taskId } = await params;

  return (
    <div className="h-full">
      <LiveOpsMonitor taskId={taskId} />
    </div>
  );
}
