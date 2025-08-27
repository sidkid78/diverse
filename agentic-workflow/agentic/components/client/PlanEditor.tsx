'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMissionControlStore } from '@/lib/store';
import { PlanStep } from '@/types';
import { 
  Plus, 
  GripVertical, 
  X, 
  Edit3, 
  Users,
  FileText
} from 'lucide-react';

export function PlanEditor() {
  const {
    plan,
    agents,
    addPlanStep,
    updatePlanStep,
    removePlanStep,
    reorderPlanSteps
  } = useMissionControlStore();

  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [newStepData, setNewStepData] = useState({
    instruction: '',
    assigned_agents: [] as string[],
    context_files: [] as string[]
  });

  const handleAddStep = () => {
    if (!newStepData.instruction.trim()) return;

    addPlanStep({
      instruction: newStepData.instruction,
      assigned_agents: newStepData.assigned_agents,
      context_files: newStepData.context_files
    });

    setNewStepData({
      instruction: '',
      assigned_agents: [],
      context_files: []
    });
  };

  const handleUpdateStep = (stepId: string, updates: Partial<PlanStep>) => {
    updatePlanStep(stepId, updates);
    setEditingStep(null);
  };

  const handleDragStart = (e: React.DragEvent, stepId: string) => {
    e.dataTransfer.setData('text/plain', stepId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStepId: string) => {
    e.preventDefault();
    const draggedStepId = e.dataTransfer.getData('text/plain');
    
    if (draggedStepId === targetStepId) return;

    const draggedIndex = plan.findIndex(s => s.step_id === draggedStepId);
    const targetIndex = plan.findIndex(s => s.step_id === targetStepId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOrder = [...plan];
    const [draggedStep] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedStep);

    reorderPlanSteps(newOrder.map(s => s.step_id));
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {/* Existing Plan Steps */}
      <div className="space-y-3">
        {plan.map((step, index) => (
          <Card
            key={step.step_id}
            className="relative group hover:shadow-md transition-shadow"
            draggable
            onDragStart={(e) => handleDragStart(e, step.step_id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, step.step_id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                </div>

                <div className="flex-1 space-y-2">
                  {editingStep === step.step_id ? (
                    <div className="space-y-3">
                      <Textarea
                        defaultValue={step.instruction}
                        placeholder="Enter step instruction..."
                        className="resize-none"
                        onBlur={(e) => handleUpdateStep(step.step_id, { instruction: e.target.value })}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => setEditingStep(null)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingStep(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium leading-relaxed">
                        {step.instruction}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {step.assigned_agents.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {step.assigned_agents.length} agent(s)
                            </span>
                          </div>
                        )}
                        
                        {step.context_files.length > 0 && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {step.context_files.length} file(s)
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingStep(step.step_id)}
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removePlanStep(step.step_id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Step */}
      <Card className="border-dashed border-2">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Plus className="w-4 h-4" />
              Add Plan Step
            </div>
            
            <Textarea
              placeholder="Enter step instruction (e.g., 'Analyze the existing auth controller and identify all session-related logic')"
              value={newStepData.instruction}
              onChange={(e) => setNewStepData(prev => ({ ...prev, instruction: e.target.value }))}
              className="resize-none"
              rows={2}
            />

            {newStepData.instruction.trim() && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddStep}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Step
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setNewStepData({ instruction: '', assigned_agents: [], context_files: [] })}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {plan.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="font-medium mb-2">No plan steps yet</h3>
          <p className="text-sm">
            Start by adding your first step above, or use AI Draft to generate a plan automatically.
          </p>
        </div>
      )}
    </div>
  );
}
