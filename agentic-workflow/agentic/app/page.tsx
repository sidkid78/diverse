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
  Zap,
  Snowflake,
  Shield
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="w-10 h-10 text-primary ice-glow" />
          <h1 className="text-5xl font-bold winter-text tracking-wider">WINTER IS COMING</h1>
          <Snowflake className="w-10 h-10 text-primary ice-glow animate-spin-slow" />
        </div>
        <p className="text-2xl text-foreground mb-2 font-semibold tracking-wide">Agentic Workflow Platform</p>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Command your legion of AI agents from the frozen citadel.<br/>
          <span className="text-primary font-medium">The lone wolf dies, but the pack survives.</span>
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="btn-winter rounded-sm">
            <Link href="/plans/new">
              <Plus className="w-5 h-5 mr-2" />
              Deploy New Mission
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="btn-winter rounded-sm border-primary/30">
            <Link href="/tasks">
              <Eye className="w-5 h-5 mr-2" />
              Watch the Wall
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="frost-border rounded-sm hover:ice-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider">Active Tasks</CardTitle>
            <Activity className="h-5 w-5 text-primary animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold winter-text">3</div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              +2 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="frost-border rounded-sm hover:ice-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider">Running Agents</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold winter-text">7</div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Across 3 missions
            </p>
          </CardContent>
        </Card>

        <Card className="frost-border rounded-sm hover:ice-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider">Today&apos;s Cost</CardTitle>
            <DollarSign className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold winter-text">$12.50</div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              -23% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="frost-border rounded-sm hover:ice-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider">Avg. Speed</CardTitle>
            <Zap className="h-5 w-5 text-primary winter-storm" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold winter-text">4.2min</div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Per task completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="frost-border rounded-sm hover:ice-glow transition-all cursor-pointer group">
          <Link href="/plans/new">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center border border-primary/20 group-hover:ice-glow transition-all">
                  <Command className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg uppercase tracking-wide">Mission Control</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-wider">Plan and dispatch</CardDescription>
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

        <Card className="frost-border rounded-sm hover:ice-glow transition-all cursor-pointer group">
          <Link href="/tasks">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center border border-primary/20 group-hover:ice-glow transition-all">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg uppercase tracking-wide">The Wall</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-wider">Monitor missions</CardDescription>
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

        <Card className="frost-border rounded-sm hover:ice-glow transition-all cursor-pointer group">
          <Link href="/agents">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center border border-primary/20 group-hover:ice-glow transition-all">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg uppercase tracking-wide">Night&apos;s Watch</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-wider">Your agents</CardDescription>
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

        <Card className="frost-border rounded-sm hover:ice-glow transition-all cursor-pointer group">
          <Link href="/settings">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center border border-primary/20 group-hover:ice-glow transition-all">
                  <Archive className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg uppercase tracking-wide">The Armory</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-wider">Plans & templates</CardDescription>
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

        <Card className="frost-border rounded-sm hover:ice-glow transition-all cursor-pointer group">
          <Link href="/usage">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center border border-primary/20 group-hover:ice-glow transition-all">
                  <DollarSign className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg uppercase tracking-wide">The Ledger</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-wider">Cost & analytics</CardDescription>
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

        <Card className="border-dashed border-2 border-border/50 rounded-sm flex items-center justify-center min-h-[200px] hover:border-primary/30 transition-all">
          <div className="text-center">
            <Snowflake className="w-8 h-8 text-muted-foreground mx-auto mb-2 animate-spin-slow" />
            <p className="text-sm text-muted-foreground uppercase tracking-wider">More to come</p>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="frost-border rounded-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 uppercase tracking-wider">
            <Clock className="w-5 h-5 text-primary ice-pulse" />
            Recent Activity
          </CardTitle>
          <CardDescription className="text-xs uppercase tracking-wider">
            Latest updates from your active missions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-sm border border-border/30 hover:border-primary/30 transition-all">
              <Badge variant="info" className="rounded-sm">RUNNING</Badge>
              <div className="flex-1">
                <p className="font-medium tracking-wide">Authentication Refactor</p>
                <p className="text-sm text-muted-foreground">Agent &quot;Code-Analyzer&quot; analyzing session logic</p>
              </div>
              <span className="text-sm text-muted-foreground uppercase tracking-wider">2 min ago</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-sm border border-border/30 hover:border-primary/30 transition-all">
              <Badge variant="success" className="rounded-sm">COMPLETED</Badge>
              <div className="flex-1">
                <p className="font-medium tracking-wide">API Documentation Update</p>
                <p className="text-sm text-muted-foreground">Successfully updated 12 endpoint docs</p>
              </div>
              <span className="text-sm text-muted-foreground uppercase tracking-wider">15 min ago</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-sm border border-border/30 hover:border-primary/30 transition-all">
              <Badge variant="warning" className="rounded-sm">PENDING</Badge>
              <div className="flex-1">
                <p className="font-medium tracking-wide">Database Migration</p>
                <p className="text-sm text-muted-foreground">Waiting for approval to proceed</p>
              </div>
              <span className="text-sm text-muted-foreground uppercase tracking-wider">1 hour ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
