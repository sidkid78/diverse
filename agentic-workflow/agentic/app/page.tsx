import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Command, 
  Eye, 
  Users, 
  Archive, 
  Plus,
  Activity,
  Clock,
  DollarSign,
  Zap
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Agentic Workflow Platform</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Orchestrate AI agents to execute complex engineering tasks. 
          Plan, deploy, and monitor your autonomous workforce.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/plans/new">
              <Plus className="w-5 h-5 mr-2" />
              Start New Mission
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/tasks">
              <Eye className="w-5 h-5 mr-2" />
              View Active Tasks
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +2 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              Across 3 missions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12.50</div>
            <p className="text-xs text-muted-foreground">
              -23% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Speed</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2min</div>
            <p className="text-xs text-muted-foreground">
              Per task completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/plans/new">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Command className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Mission Control</CardTitle>
                  <CardDescription>Plan and dispatch agents</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create structured plans, configure your agent workforce, and launch missions with full observability.
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/tasks">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Live Ops</CardTitle>
                  <CardDescription>Monitor active missions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Real-time observability dashboard with agent swimlanes, event streams, and intervention controls.
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/agents">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Agent Fleet</CardTitle>
                  <CardDescription>Manage your workforce</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and manage your AI agents, their specializations, and performance metrics.
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/settings">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Archive className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Armory</CardTitle>
                  <CardDescription>Plans, docs, and prompts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage reusable plan templates, AI documentation, and prompt libraries.
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/usage">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Usage Analytics</CardTitle>
                  <CardDescription>Cost and performance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track costs, performance metrics, and optimize your agentic workflows.
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="border-dashed border-2 flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">More features coming soon</p>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest updates from your active missions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <Badge variant="info">RUNNING</Badge>
              <div className="flex-1">
                <p className="font-medium">Authentication Refactor</p>
                <p className="text-sm text-muted-foreground">Agent "Code-Analyzer" analyzing session logic</p>
              </div>
              <span className="text-sm text-muted-foreground">2 min ago</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <Badge variant="success">COMPLETED</Badge>
              <div className="flex-1">
                <p className="font-medium">API Documentation Update</p>
                <p className="text-sm text-muted-foreground">Successfully updated 12 endpoint docs</p>
              </div>
              <span className="text-sm text-muted-foreground">15 min ago</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <Badge variant="warning">PENDING</Badge>
              <div className="flex-1">
                <p className="font-medium">Database Migration</p>
                <p className="text-sm text-muted-foreground">Waiting for approval to proceed</p>
              </div>
              <span className="text-sm text-muted-foreground">1 hour ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
