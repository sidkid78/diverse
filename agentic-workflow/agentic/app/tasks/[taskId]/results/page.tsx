import React from 'react';
import { DebriefingRoom } from '@/components/client/DebriefingRoom';

interface ResultsPageProps {
  params: Promise<{ taskId: string }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { taskId } = await params;

  return (
    <div className="h-full">
      <DebriefingRoom taskId={taskId} />
    </div>
  );
}
