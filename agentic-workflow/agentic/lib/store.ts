/**
 * Zustand-based state management stores for the Agentic Workflow application.
 *
 * This module defines and exports several global stores:
 * - useAuthStore: Handles authentication state (user info, login/logout).
 * - useUIStore: Manages UI state (theme, sidebar, active agents).
 * - useMissionControlStore: Manages mission planning, agents, and context.
 * - useLiveOpsStore: Handles live operations (task, event stream, agent selection, pause).
 * - useDebriefingStore: Manages debriefing state (task variants, selection).
 *
 * Each store provides state and actions for its domain, and some use persistence via zustand's middleware.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  MissionControlState, 
  LiveOpsState, 
  DebriefingState, 
  Agent, 
  Task, 
  EventLog,
  PlanStep,
  TaskVariant
} from '@/types';

/**
 * Authentication state and actions.
 */
interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  isAuthenticated: boolean;
  login: (user: { id: string; name: string; email: string }) => void;
  logout: () => void;
}

/**
 * UI state and actions.
 */
interface UIState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  activeAgents: Agent[];
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setActiveAgents: (agents: Agent[]) => void;
}

/**
 * Mission Control state and actions.
 */
interface MissionControlStore extends MissionControlState {
  updateGoal: (goal: string) => void;
  addPlanStep: (step: Omit<PlanStep, 'step_id' | 'order'>) => void;
  updatePlanStep: (stepId: string, updates: Partial<PlanStep>) => void;
  removePlanStep: (stepId: string) => void;
  reorderPlanSteps: (stepIds: string[]) => void;
  clearPlan: () => void;
  addAgent: (agent: Partial<Agent>) => void;
  updateAgent: (agentId: string, updates: Partial<Agent>) => void;
  removeAgent: (agentId: string) => void;
  setSelectedContext: (context: string[]) => void;
  setRunMode: (mode: 'single' | 'best-of-n') => void;
  setVariantCount: (count: number) => void;
  reset: () => void;
}

/**
 * Live Operations state and actions.
 */
interface LiveOpsStore extends LiveOpsState {
  setTask: (task: Task) => void;
  addEventLog: (event: EventLog) => void;
  setSelectedAgent: (agentId: string | undefined) => void;
  togglePause: () => void;
  reset: () => void;
}

/**
 * Debriefing state and actions.
 */
interface DebriefingStore extends DebriefingState {
  setVariants: (variants: TaskVariant[]) => void;
  setSelectedVariant: (variantId: string | undefined) => void;
  reset: () => void;
}

/**
 * Auth Store: Handles user authentication state.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

/**
 * UI Store: Manages UI preferences and state.
 */
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarCollapsed: false,
      activeAgents: [],
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setActiveAgents: (agents) => set({ activeAgents: agents }),
    }),
    {
      name: 'ui-storage',
    }
  )
);

/**
 * Mission Control Store: Handles mission planning, agents, and context.
 */
export const useMissionControlStore = create<MissionControlStore>((set, get) => ({
  goal: '',
  plan: [],
  agents: [],
  selectedContext: [],
  runMode: 'single',
  variantCount: 2,
  
  updateGoal: (goal) => set({ goal }),
  
  addPlanStep: (step) => {
    const { plan } = get();
    const newStep: PlanStep = {
      ...step,
      step_id: crypto.randomUUID(),
      order: plan.length + 1,
    };
    set({ plan: [...plan, newStep] });
  },
  
  updatePlanStep: (stepId, updates) => {
    const { plan } = get();
    set({
      plan: plan.map(step => 
        step.step_id === stepId ? { ...step, ...updates } : step
      )
    });
  },
  
  removePlanStep: (stepId) => {
    const { plan } = get();
    const filteredPlan = plan.filter(step => step.step_id !== stepId);
    // Reorder remaining steps
    const reorderedPlan = filteredPlan.map((step, index) => ({
      ...step,
      order: index + 1
    }));
    set({ plan: reorderedPlan });
  },
  
  reorderPlanSteps: (stepIds) => {
    const { plan } = get();
    const reorderedPlan = stepIds.map((stepId, index) => {
      const step = plan.find(s => s.step_id === stepId);
      return step ? { ...step, order: index + 1 } : null;
    }).filter(Boolean) as PlanStep[];
    set({ plan: reorderedPlan });
  },

  clearPlan: () => set({ plan: [] }),
  
  addAgent: (agent) => {
    const { agents } = get();
    const newAgent = {
      ...agent,
      agent_id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    } as Partial<Agent>;
    set({ agents: [...agents, newAgent] });
  },
  
  updateAgent: (agentId, updates) => {
    const { agents } = get();
    set({
      agents: agents.map(agent => 
        agent.agent_id === agentId ? { ...agent, ...updates } : agent
      )
    });
  },
  
  removeAgent: (agentId) => {
    const { agents } = get();
    set({ agents: agents.filter(agent => agent.agent_id !== agentId) });
  },
  
  setSelectedContext: (context) => set({ selectedContext: context }),
  setRunMode: (mode) => set({ runMode: mode }),
  setVariantCount: (count) => set({ variantCount: count }),
  
  reset: () => set({
    goal: '',
    plan: [],
    agents: [],
    selectedContext: [],
    runMode: 'single',
    variantCount: 2,
  }),
}));

/**
 * Live Ops Store: Handles live task execution and event stream.
 */
export const useLiveOpsStore = create<LiveOpsStore>((set, get) => ({
  task: {} as Task,
  eventStream: [],
  selectedAgent: undefined,
  isPaused: false,
  
  setTask: (task) => set({ task }),
  
  addEventLog: (event) => {
    const { eventStream } = get();
    set({ eventStream: [...eventStream, event] });
  },
  
  setSelectedAgent: (agentId) => set({ selectedAgent: agentId }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  
  reset: () => set({
    task: {} as Task,
    eventStream: [],
    selectedAgent: undefined,
    isPaused: false,
  }),
}));

/**
 * Debriefing Store: Handles task variant selection and debriefing state.
 */
export const useDebriefingStore = create<DebriefingStore>((set) => ({
  variants: [],
  selectedVariant: undefined,
  
  setVariants: (variants) => set({ variants }),
  setSelectedVariant: (variantId) => set({ selectedVariant: variantId }),
  
  reset: () => set({
    variants: [],
    selectedVariant: undefined,
  }),
}));
