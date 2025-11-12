// AI-powered plan generation utility
// ⚠️ DEPRECATED: This file contains mock data for testing purposes only.
// Use the real API endpoint: POST /api/plans/generate instead
// This uses real Gemini AI to analyze your repository and generate plans

interface GeneratedStep {
  instruction: string;
  suggested_agents: string[];
  context_files: string[];
}

// Common development task patterns and their associated steps
const taskPatterns = {
  refactor: [
    'Analyze the current codebase structure and identify areas for refactoring',
    'Create a backup of the existing code and set up a new branch',
    'Implement the refactored code with improved structure',
    'Update tests to work with the refactored code',
    'Verify that all functionality works as expected'
  ],
  api: [
    'Design the API endpoints and data models',
    'Set up the basic API structure and routing',
    'Implement authentication and authorization',
    'Create data validation and error handling',
    'Write comprehensive API tests'
  ],
  frontend: [
    'Create wireframes and design mockups',
    'Set up the component structure and routing',
    'Implement the user interface components',
    'Add state management and API integration',
    'Test user interactions and responsive design'
  ],
  testing: [
    'Analyze the codebase to identify test coverage gaps',
    'Set up the testing framework and configuration',
    'Write unit tests for core functionality',
    'Create integration tests for key workflows',
    'Set up automated testing in CI/CD pipeline'
  ],
  database: [
    'Design the database schema and relationships',
    'Set up database migrations and seed data',
    'Implement data access layer and models',
    'Create database indexes for performance',
    'Set up backup and recovery procedures'
  ],
  deployment: [
    'Set up the deployment environment and configuration',
    'Create Docker containers and orchestration files',
    'Configure CI/CD pipeline for automated deployment',
    'Set up monitoring and logging systems',
    'Test the deployment process and rollback procedures'
  ]
};

// Agent specialization mapping
const agentSpecializations = {
  'Code-Analyzer': ['analysis', 'refactoring', 'code-review'],
  'Frontend-Developer': ['ui', 'components', 'styling', 'user-experience'],
  'Backend-Engineer': ['api', 'database', 'server', 'authentication'],
  'Test-Writer': ['testing', 'unit-tests', 'integration-tests', 'qa'],
  'DevOps-Specialist': ['deployment', 'ci-cd', 'monitoring', 'infrastructure'],
  'Database-Expert': ['database', 'schema', 'optimization', 'migrations']
};

// Function to find the best agent for a given task based on specializations
function findBestAgentForTask(taskKeywords: string[]): string {
  let bestAgent = 'Code-Analyzer'; // default
  let maxMatches = 0;

  for (const [agentName, specializations] of Object.entries(agentSpecializations)) {
    const matches = taskKeywords.filter(keyword => 
      specializations.some(spec => keyword.includes(spec) || spec.includes(keyword))
    ).length;

    if (matches > maxMatches) {
      maxMatches = matches;
      bestAgent = agentName;
    }
  }

  return bestAgent;
}

// Function to get relevant agents based on goal keywords
function getRelevantAgents(goal: string): string[] {
  const goalKeywords = goal.toLowerCase().split(/\s+/);
  const relevantAgents: Set<string> = new Set();

  // Find agents whose specializations match the goal keywords
  for (const [agentName, specializations] of Object.entries(agentSpecializations)) {
    const hasMatch = specializations.some(spec => 
      goalKeywords.some(keyword => keyword.includes(spec) || spec.includes(keyword))
    );
    
    if (hasMatch) {
      relevantAgents.add(agentName);
    }
  }

  // If no specific matches, return a default set
  if (relevantAgents.size === 0) {
    return ['Code-Analyzer', 'Backend-Engineer', 'Test-Writer'];
  }

  return Array.from(relevantAgents);
}

export async function generatePlanSteps(missionGoal: string): Promise<GeneratedStep[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  const goal = missionGoal.toLowerCase();
  let steps: string[] = [];
  let suggestedAgentTypes: string[] = [];

  // Pattern matching to determine the type of task
  if (goal.includes('refactor') || goal.includes('restructure') || goal.includes('reorganize')) {
    steps = taskPatterns.refactor;
    suggestedAgentTypes = getRelevantAgents(goal);
  } else if (goal.includes('api') || goal.includes('endpoint') || goal.includes('rest') || goal.includes('graphql')) {
    steps = taskPatterns.api;
    suggestedAgentTypes = getRelevantAgents(goal);
  } else if (goal.includes('frontend') || goal.includes('ui') || goal.includes('interface') || goal.includes('component')) {
    steps = taskPatterns.frontend;
    suggestedAgentTypes = getRelevantAgents(goal);
  } else if (goal.includes('test') || goal.includes('testing') || goal.includes('coverage')) {
    steps = taskPatterns.testing;
    suggestedAgentTypes = getRelevantAgents(goal);
  } else if (goal.includes('database') || goal.includes('schema') || goal.includes('migration')) {
    steps = taskPatterns.database;
    suggestedAgentTypes = getRelevantAgents(goal);
  } else if (goal.includes('deploy') || goal.includes('ci/cd') || goal.includes('docker') || goal.includes('kubernetes')) {
    steps = taskPatterns.deployment;
    suggestedAgentTypes = getRelevantAgents(goal);
  } else {
    // Generic development workflow
    steps = [
      'Analyze the requirements and create a technical specification',
      'Break down the task into smaller, manageable components',
      'Implement the core functionality',
      'Add comprehensive tests and documentation',
      'Review and optimize the implementation'
    ];
    suggestedAgentTypes = getRelevantAgents(goal);
  }

  // Generate context files based on the goal
  const contextFiles = generateContextFiles(goal);

  // Convert to GeneratedStep format with intelligent agent assignment
  return steps.map((instruction, index) => {
    // Find the best agent for this specific instruction
    const instructionKeywords = instruction.toLowerCase().split(/\s+/);
    const bestAgent = findBestAgentForTask(instructionKeywords);
    
    // Ensure the best agent is in our suggested types, otherwise use round-robin
    const assignedAgent = suggestedAgentTypes.includes(bestAgent) 
      ? bestAgent 
      : suggestedAgentTypes[index % suggestedAgentTypes.length];

    return {
      instruction,
      suggested_agents: [assignedAgent],
      context_files: index === 0 ? contextFiles : [] // Only first step gets context files
    };
  });
}

function generateContextFiles(goal: string): string[] {
  const files: string[] = [];

  if (goal.includes('api') || goal.includes('backend')) {
    files.push('src/api/', 'docs/api-spec.md', 'src/models/');
  }
  
  if (goal.includes('frontend') || goal.includes('ui')) {
    files.push('src/components/', 'src/styles/', 'src/pages/');
  }
  
  if (goal.includes('database')) {
    files.push('src/models/', 'migrations/', 'src/database/');
  }
  
  if (goal.includes('test')) {
    files.push('tests/', 'src/__tests__/', 'jest.config.js');
  }
  
  if (goal.includes('deploy') || goal.includes('docker')) {
    files.push('Dockerfile', 'docker-compose.yml', '.github/workflows/');
  }

  // Always include common files
  files.push('README.md', 'package.json');

  return files.slice(0, 5); // Limit to 5 files
}

export default generatePlanSteps;
