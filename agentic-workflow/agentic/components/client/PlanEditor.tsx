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
  FileText,
  Check
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
  const [editingStepData, setEditingStepData] = useState<{
    instruction: string;
    assigned_agents: string[];
    context_files: string[];
  } | null>(null);
  const [newContextFile, setNewContextFile] = useState('');
  const [editingContextFile, setEditingContextFile] = useState('');

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
    setEditingStepData(null);
  };

  const handleStartEditing = (step: PlanStep) => {
    setEditingStep(step.step_id);
    setEditingStepData({
      instruction: step.instruction,
      assigned_agents: [...step.assigned_agents],
      context_files: [...step.context_files]
    });
  };

  const handleCancelEditing = () => {
    setEditingStep(null);
    setEditingStepData(null);
  };

  const handleSaveEditing = (stepId: string) => {
    if (editingStepData) {
      handleUpdateStep(stepId, editingStepData);
    }
  };

  const toggleAgentAssignment = (agentId: string, isEditing: boolean = false) => {
    if (isEditing && editingStepData) {
      const isAssigned = editingStepData.assigned_agents.includes(agentId);
      setEditingStepData(prev => prev ? {
        ...prev,
        assigned_agents: isAssigned 
          ? prev.assigned_agents.filter(id => id !== agentId)
          : [...prev.assigned_agents, agentId]
      } : null);
    } else {
      const isAssigned = newStepData.assigned_agents.includes(agentId);
      setNewStepData(prev => ({
        ...prev,
        assigned_agents: isAssigned 
          ? prev.assigned_agents.filter(id => id !== agentId)
          : [...prev.assigned_agents, agentId]
      }));
    }
  };

  const addContextFile = (file: string, isEditing: boolean = false) => {
    if (!file.trim()) return;
    
    if (isEditing && editingStepData) {
      if (!editingStepData.context_files.includes(file)) {
        setEditingStepData(prev => prev ? {
          ...prev,
          context_files: [...prev.context_files, file]
        } : null);
      }
      setEditingContextFile('');
    } else {
      if (!newStepData.context_files.includes(file)) {
        setNewStepData(prev => ({
          ...prev,
          context_files: [...prev.context_files, file]
        }));
      }
      setNewContextFile('');
    }
  };

  const removeContextFile = (file: string, isEditing: boolean = false) => {
    if (isEditing && editingStepData) {
      setEditingStepData(prev => prev ? {
        ...prev,
        context_files: prev.context_files.filter(f => f !== file)
      } : null);
    } else {
      setNewStepData(prev => ({
        ...prev,
        context_files: prev.context_files.filter(f => f !== file)
      }));
    }
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
                  {editingStep === step.step_id && editingStepData ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editingStepData.instruction}
                        onChange={(e) => setEditingStepData(prev => prev ? { ...prev, instruction: e.target.value } : null)}
                        placeholder="Enter step instruction..."
                        className="resize-none"
                        rows={2}
                      />
                      
                      {/* Agent Assignment */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Assigned Agents</label>
                        <div className="flex flex-wrap gap-2">
                          {agents.map(agent => (
                            <Button
                              key={agent.agent_id}
                              size="sm"
                              variant={editingStepData.assigned_agents.includes(agent.agent_id ?? '') ? "default" : "outline"}
                              onClick={() => toggleAgentAssignment(agent.agent_id ?? '', true)}
                              className="h-7 text-xs"
                            >
                              {editingStepData.assigned_agents.includes(agent.agent_id ?? '') && (
                                <Check className="w-3 h-3 mr-1" />
                              )}
                              {agent.name}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Context Files */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Context Files</label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add context file path..."
                            value={editingContextFile}
                            onChange={(e) => setEditingContextFile(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                addContextFile(editingContextFile, true);
                              }
                            }}
                            className="text-xs"
                          />
                          <Button
                            size="sm"
                            onClick={() => addContextFile(editingContextFile, true)}
                            disabled={!editingContextFile.trim()}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        {editingStepData.context_files.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {editingStepData.context_files.map(file => (
                              <Badge key={file} variant="secondary" className="text-xs">
                                {file}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeContextFile(file, true)}
                                  className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                                >
                                  <X className="w-2 h-2" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveEditing(step.step_id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEditing}
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
                              {step.assigned_agents.map(agentId => {
                                const agent = agents.find(a => a.agent_id === agentId);
                                return agent?.name || agentId;
                              }).join(', ')}
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
                    onClick={() => handleStartEditing(step)}
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

            {/* Agent Assignment for New Step */}
            {newStepData.instruction.trim() && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Assign Agents (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {agents.map(agent => (
                      <Button
                        key={agent.agent_id}
                        size="sm"
                        variant={newStepData.assigned_agents.includes(agent.agent_id ?? '') ? "default" : "outline"}
                        onClick={() => toggleAgentAssignment(agent.agent_id ?? '')}
                        className="h-7 text-xs"
                      >
                        {newStepData.assigned_agents.includes(agent.agent_id ?? '') && (
                          <Check className="w-3 h-3 mr-1" />
                        )}
                        {agent.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Context Files for New Step */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Context Files (Optional)</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add context file path..."
                      value={newContextFile}
                      onChange={(e) => setNewContextFile(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addContextFile(newContextFile);
                        }
                      }}
                      className="text-xs"
                    />
                    <Button
                      size="sm"
                      onClick={() => addContextFile(newContextFile)}
                      disabled={!newContextFile.trim()}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  {newStepData.context_files.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {newStepData.context_files.map(file => (
                        <Badge key={file} variant="secondary" className="text-xs">
                          {file}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeContextFile(file)}
                            className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                          >
                            <X className="w-2 h-2" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

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
