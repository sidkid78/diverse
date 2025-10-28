import React from 'react';
import { MissionControlInterface } from '@/components/client/MissionControlInterface';

export default function NewPlanPage() {
  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Mission Control</h1>
        <p className="text-muted-foreground">
          Plan your mission, configure your agents, and deploy your autonomous workforce.
        </p>
      </div>
      
      <MissionControlInterface />
    </div>
  );
}
