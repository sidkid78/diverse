import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  DollarSign, 
  Clock, 
  Activity,
  TrendingUp,
  TrendingDown,
  Calendar,
  Zap
} from 'lucide-react';

// Mock usage data
const mockUsageData = {
  current_month: {
    total_cost: 234.67,
    total_tokens: 1250000,
    total_tasks: 45,
    total_time: 18000, // in seconds
    model_breakdown: {
      'gemini-2.5-pro': { cost: 145.20, tokens: 450000, tasks: 12 },
      'gemini-2.5-flash': { cost: 67.30, tokens: 580000, tasks: 25 },
      'gemini-2.0-pro': { cost: 22.17, tokens: 220000, tasks: 8 }
    }
  },
  daily_usage: [
    { date: '2024-01-01', cost: 12.45, tasks: 3, tokens: 45000 },
    { date: '2024-01-02', cost: 18.90, tasks: 4, tokens: 67000 },
    { date: '2024-01-03', cost: 25.60, tasks: 6, tokens: 89000 },
    { date: '2024-01-04', cost: 31.20, tasks: 5, tokens: 76000 },
    { date: '2024-01-05', cost: 28.75, tasks: 7, tokens: 95000 },
    { date: '2024-01-06', cost: 22.30, tasks: 4, tokens: 58000 },
    { date: '2024-01-07', cost: 19.85, tasks: 3, tokens: 52000 }
  ]
};

export default function UsagePage() {
  const formatCost = (cost: number) => `$${cost.toFixed(2)}`;
  const formatTokens = (tokens: number) => `${(tokens / 1000).toFixed(0)}K`;
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getModelIcon = (model: string) => {
    if (model.includes('2.5-pro')) return '🧠';
    if (model.includes('2.5-flash')) return '🚀';
    return '⚡';
  };

  const getModelColor = (model: string) => {
    if (model.includes('2.5-pro')) return 'bg-purple-100 text-purple-800';
    if (model.includes('2.5-flash')) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-green-500" />
            Usage & Analytics
          </h1>
          <p className="text-muted-foreground">Monitor costs, performance, and resource utilization</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            January 2024
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCost(mockUsageData.current_month.total_cost)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Used</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatTokens(mockUsageData.current_month.total_tokens)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +8% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {mockUsageData.current_month.total_tasks}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
              -3% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compute Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatDuration(mockUsageData.current_month.total_time)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +15% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="models" className="space-y-4">
        <TabsList>
          <TabsTrigger value="models">Model Breakdown</TabsTrigger>
          <TabsTrigger value="daily">Daily Usage</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage by Model</CardTitle>
              <CardDescription>Cost and performance breakdown by AI model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(mockUsageData.current_month.model_breakdown).map(([model, data]) => (
                  <div key={model} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getModelIcon(model)}</div>
                      <div>
                        <div className="font-medium">{model}</div>
                        <Badge className={getModelColor(model)}>
                          {data.tasks} tasks
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-lg font-bold">{formatCost(data.cost)}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatTokens(data.tokens)} tokens
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Usage Trend</CardTitle>
              <CardDescription>Cost and task volume over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockUsageData.daily_usage.map((day: { date: string; cost: number; tasks: number; tokens: number }) => (
                  <div key={day.date} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-2 bg-blue-500 rounded usage-bar"
                        style={{ '--bar-height': `${Math.max(20, (day.cost / 35) * 40)}px` } as React.CSSProperties}
                      ></div>
                      <div>
                        <div className="font-medium">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {day.tasks} tasks • {formatTokens(day.tokens)} tokens
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold">
                      {formatCost(day.cost)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Efficiency</CardTitle>
                <CardDescription>Average cost per task over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatCost(mockUsageData.current_month.total_cost / mockUsageData.current_month.total_tasks)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Average cost per task
                </div>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  Improved by 8% this month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Token Efficiency</CardTitle>
                <CardDescription>Tokens used per successful task</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatTokens(mockUsageData.current_month.total_tokens / mockUsageData.current_month.total_tasks)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Average tokens per task
                </div>
                <div className="flex items-center mt-2 text-xs text-blue-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Increased by 5% this month
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
