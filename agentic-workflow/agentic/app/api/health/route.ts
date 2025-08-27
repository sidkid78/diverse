import { NextResponse } from 'next/server';

export async function GET() {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      api: 'operational',
      database: 'operational', // Mock - would check real DB in production
      streaming: 'operational',
      agents: 'operational'
    },
    metrics: {
      uptime: Math.floor(Math.random() * 86400), // Mock uptime in seconds
      active_tasks: Math.floor(Math.random() * 10),
      active_agents: Math.floor(Math.random() * 20),
      total_plans: 12,
      requests_per_minute: Math.floor(Math.random() * 100)
    }
  };

  return NextResponse.json(healthData);
}
