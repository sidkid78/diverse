'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanEditor } from '@/components/client/PlanEditor';
import { AgentWorkforcePanel } from '@/components/client/AgentWorkforcePanel';
import { ContextPanel } from '@/components/client/ContextPanel';
import { useMissionControlStore } from '@/lib/store';
import { apiClient } from '@/lib/apiClient';
import { 
  Play,  
  Settings, 
  FileText, 
  Users,
  Target,
  Sparkles
} from 'lucide-react';

export function MissionControlInterface() {
  const {
    goal,
    plan,
    agents,
    selectedContext,
    runMode,
    variantCount,
    updateGoal,
    addPlanStep,
    clearPlan,
    setRunMode,
    setVariantCount,
    reset
  } = useMissionControlStore();

  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecutePlan = async () => {
    if (!goal.trim() || plan.length === 0) {
      alert('Please provide a mission goal and at least one plan step.');
      return;
    }

    setIsExecuting(true);
    try {
      // Create the task with required fields for /api/tasks POST
      const response = await apiClient.createTask({
        title: goal,
        description: plan.map((s) => s.instruction).join(', '),
        agents,
        run_mode: 'single',
        parallel_runs: 1,
        estimated_cost: 0,
      });

      // Redirect to Live Ops view
      window.location.href = `/tasks/${response.task.task_id}`;
    } catch (error) {
      console.error('Failed to execute plan:', error);
      alert('Failed to execute plan. Please try again.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleDraftPlan = async () => {
    if (!goal.trim()) {
      alert('Please enter a mission goal first!');
      return;
    }

    setIsExecuting(true);
    
    try {
      // Generate AI-powered plan using real Gemini API
      const response = await apiClient.generatePlan({
        mission_statement: goal,
        repo_url: 'https://github.com/sidkid78/test1', // Use the connected GitHub repo
        model_preference: 'gemini-2.5-flash',
      });
      
      // Clear existing steps and add the generated ones
      clearPlan();
      response.plan.forEach((step, index) => {
        setTimeout(() => {
          addPlanStep({
            instruction: step.step_description,
            assigned_agents: [step.agent_name],
            context_files: index === 0 ? response.context_files.slice(0, 5) : []
          });
        }, index * 200); // Stagger the additions for a nice effect
      });
      
    } catch (error) {
      console.error('Failed to generate plan:', error);
      alert(`Failed to generate plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Left Panel - Mission Briefing */}
      <div className="col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Mission Goal
            </CardTitle>
            <CardDescription>
              Define your high-level objective
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., Refactor the user authentication flow to use JWT instead of session cookies"
              value={goal}
              onChange={(e) => updateGoal(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Execution Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="single"
                  checked={runMode === 'single'}
                  onChange={() => setRunMode('single')}
                  className="text-primary"
                />
                <span className="text-sm font-medium">Single Run</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="best-of-n"
                  checked={runMode === 'best-of-n'}
                  onChange={() => setRunMode('best-of-n')}
                  className="text-primary"
                />
                <span className="text-sm font-medium">Best of N</span>
              </label>
            </div>

            {runMode === 'best-of-n' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Variants</label>
                <Input
                  type="number"
                  min="2"
                  max="5"
                  value={variantCount}
                  onChange={(e) => setVariantCount(parseInt(e.target.value))}
                  className="w-20"
                />
                <p className="text-xs text-muted-foreground">
                  Generate multiple solutions to compare
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Context & Knowledge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContextPanel />
          </CardContent>
        </Card>
      </div>

      {/* Center Panel - Plan Editor */}
      <div className="col-span-6">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Mission Plan
                </CardTitle>
                <CardDescription>
                  Break down your mission into executable steps
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={handleDraftPlan}
                disabled={isExecuting || !goal.trim()}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {isExecuting ? 'Generating...' : 'AI Draft'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[calc(100%-120px)]">
            <PlanEditor />
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Agent Workforce */}
      <div className="col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Agent Workforce
            </CardTitle>
            <CardDescription>
              Configure your specialized agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AgentWorkforcePanel />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mission Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Plan Steps:</span>
                <div className="font-medium">{plan.length}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Agents:</span>
                <div className="font-medium">{agents.length}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Context Files:</span>
                <div className="font-medium">{selectedContext.length}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Run Mode:</span>
                <div className="font-medium capitalize">{runMode.replace('-', ' ')}</div>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <Button
                onClick={handleExecutePlan}
                disabled={isExecuting || !goal.trim() || plan.length === 0}
                className="w-full"
                size="lg"
              >
                {isExecuting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Execute Plan
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={reset}
                className="w-full"
              >
                Reset Mission
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
