'use client';

/**
 * AgentWorkforcePanel is a React component that manages and displays a list of agents
 * for a mission control workflow. It allows users to:
 * - View, add, and remove agents.
 * - Assign model preferences and specializations to each agent.
 * - Quickly deploy preset agent configurations.
 * - Edit agent specializations interactively.
 * 
 * The component uses a global mission control store for agent state management.
 * UI elements are composed using custom Button, Input, Card, Badge, and ModelSelector components.
 */
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModelSelector } from '@/components/client/ModelSelector';
import { useMissionControlStore } from '@/lib/store';
import { ModelPreference, MODEL_OPTIONS } from '@/types';
import { 
  Plus, 
  X, 
  Bot, 
  Users
} from 'lucide-react';

export function AgentWorkforcePanel() {
  const { agents, addAgent, updateAgent, removeAgent } = useMissionControlStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAgentData, setNewAgentData] = useState({
    name: '',
    model_preference: 'gemini-2.5-flash' as ModelPreference,
    specialization: [] as string[],
    status: 'PENDING' as const
  });

  const handleAddAgent = () => {
    if (!newAgentData.name.trim()) return;

    addAgent({
      name: newAgentData.name,
      model_preference: newAgentData.model_preference,
      specialization: newAgentData.specialization,
      status: 'PENDING',
      task_id: ''
    });

    setNewAgentData({
      name: '',
      model_preference: 'gemini-2.5-flash',
      specialization: [],
      status: 'PENDING'
    });
    setShowAddForm(false);
  };

  const handleAddSpecialization = (agentId: string, specialization: string) => {
    const agent = agents.find(a => a.agent_id === agentId);
    if (!agent || !specialization.trim()) return;

    const newSpecializations = [...(agent.specialization || []), specialization.trim()];
    updateAgent(agentId, { specialization: newSpecializations });
  };

  const handleRemoveSpecialization = (agentId: string, index: number) => {
    const agent = agents.find(a => a.agent_id === agentId);
    if (!agent) return;

    const newSpecializations = [...(agent.specialization || [])];
    newSpecializations.splice(index, 1);
    updateAgent(agentId, { specialization: newSpecializations });
  };

  const presetAgents = [
    {
      name: 'Code-Analyzer',
      model_preference: 'gemini-2.5-flash' as ModelPreference,
      specialization: ['analysis', 'refactoring', 'code-review'],
      description: 'Analyzes codebases and identifies patterns'
    },
    {
      name: 'Test-Writer',
      model_preference: 'gemini-2.5-flash-lite' as ModelPreference,
      specialization: ['testing', 'unit-tests', 'integration-tests'],
      description: 'Creates comprehensive test suites'
    },
    {
      name: 'Doc-Generator',
      model_preference: 'gemini-2.5-pro' as ModelPreference,
      specialization: ['documentation', 'api-docs', 'readme'],
      description: 'Generates and maintains documentation'
    },
    {
      name: 'Architect',
      model_preference: 'gemini-2.5-pro' as ModelPreference,
      specialization: ['architecture', 'system-design', 'patterns'],
      description: 'Designs system architecture and patterns'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Existing Agents */}
      <div className="space-y-3">
        {agents.map((agent) => (
          <Card key={agent.agent_id} className="relative group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <span className="font-medium">{agent.name}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeAgent(agent.agent_id!)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Model:</span>
                  <Badge variant="outline" className="text-xs">
                    {MODEL_OPTIONS[agent.model_preference!].icon} {MODEL_OPTIONS[agent.model_preference!].label}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground">Specializations:</span>
                  <div className="flex flex-wrap gap-1">
                    {agent.specialization?.map((spec, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs cursor-pointer"
                        onClick={() => handleRemoveSpecialization(agent.agent_id!, index)}
                      >
                        {spec}
                        <X className="w-2 h-2 ml-1" />
                      </Badge>
                    ))}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 px-2 text-xs"
                      onClick={() => {
                        const spec = prompt('Enter specialization:');
                        if (spec) handleAddSpecialization(agent.agent_id!, spec);
                      }}
                    >
                      <Plus className="w-2 h-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Agent */}
      {showAddForm ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Plus className="w-4 h-4" />
              New Agent
            </div>

            <div className="space-y-3">
              <Input
                placeholder="Agent name (e.g., Code-Analyzer)"
                value={newAgentData.name}
                onChange={(e) => setNewAgentData(prev => ({ ...prev, name: e.target.value }))}
              />

              <div className="space-y-2">
                <label className="text-xs font-medium">Model</label>
                <ModelSelector
                  value={newAgentData.model_preference}
                  onValueChange={(value) => setNewAgentData(prev => ({ ...prev, model_preference: value }))}
                />
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddAgent}>
                  Add Agent
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => setShowAddForm(true)}
            className="w-full border-dashed border-2 h-12"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Agent
          </Button>

          {/* Preset Agents */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Quick Deploy:</div>
            <div className="grid grid-cols-2 gap-2">
              {presetAgents.map((preset, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  className="h-auto p-2 text-left"
                  onClick={() => {
                    addAgent({
                      name: preset.name,
                      model_preference: preset.model_preference,
                      specialization: preset.specialization,
                      status: 'PENDING',
                      task_id: ''
                    });
                  }}
                >
                  <div className="space-y-1">
                    <div className="text-xs font-medium">{preset.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {preset.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {agents.length === 0 && !showAddForm && (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No agents configured</p>
          <p className="text-xs">Add agents to execute your mission</p>
        </div>
      )}
    </div>
  );
}
