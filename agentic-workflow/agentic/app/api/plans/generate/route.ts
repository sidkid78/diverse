/**
 * AI Plan Generation API
 * Generate execution plans using Gemini AI
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';
import { parseRepoUrl, listRepositoryFiles } from '@/lib/github';
import type { ModelPreference } from '@/types';

export const runtime = 'nodejs';

// Type for AI-generated plan steps
interface GeneratedPlanStep {
  step_description: string;
  agent_name: string;
  agent_specialization: string[];
  model_preference: ModelPreference;
  estimated_duration: number;
  dependencies: number[];
}

/**
 * POST /api/plans/generate
 * Generate a plan using AI
 * 
 * Body:
 * - mission_statement: string - What to accomplish
 * - repo_url: string - Repository URL
 * - context_files?: string[] - Files to analyze
 * - model_preference?: ModelPreference - AI model to use
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mission_statement, repo_url, context_files, model_preference } = body;

    // Validate request
    if (!mission_statement) {
      return NextResponse.json(
        { error: 'mission_statement is required' },
        { status: 400 }
      );
    }

    if (!repo_url) {
      return NextResponse.json(
        { error: 'repo_url is required' },
        { status: 400 }
      );
    }

    // Parse repository info
    const repoInfo = parseRepoUrl(repo_url);
    if (!repoInfo) {
      return NextResponse.json(
        { error: 'Invalid repository URL' },
        { status: 400 }
      );
    }

    const { owner, repo } = repoInfo;

    // Get available files if not provided
    let availableFiles = context_files || [];
    if (!availableFiles.length) {
      try {
        const allFiles = await listRepositoryFiles(owner, repo);
        // Filter to relevant files
        availableFiles = allFiles.filter(file => 
          !file.includes('node_modules') &&
          !file.includes('.git/') &&
          (file.endsWith('.ts') || file.endsWith('.tsx') || 
           file.endsWith('.js') || file.endsWith('.jsx') ||
           file.endsWith('.py') || file.endsWith('.md'))
        ).slice(0, 50); // Limit to 50 files
      } catch (error) {
        console.error('Error listing files:', error);
        availableFiles = [];
      }
    }

    // Build prompt for plan generation
    const systemInstruction = `You are a senior software architect and technical project planner.
Your task is to analyze a software development mission and create a detailed, executable plan.

The plan should be broken down into logical steps, where each step will be executed by a specialized AI agent.
Consider the repository structure, codebase context, and best practices for the technology stack.

You must respond with a JSON array of plan steps. Each step must have:
- step_description: Clear description of what needs to be done
- agent_name: Descriptive name for the agent (e.g., "Code-Analyzer", "Test-Writer")
- agent_specialization: Array of specializations (e.g., ["testing", "refactoring"])
- model_preference: One of "gemini-2.5-pro", "gemini-2.5-flash", or "gemini-2.0-pro"
- estimated_duration: Estimated time in minutes
- dependencies: Array of step indices this step depends on

Respond ONLY with the JSON array, no other text.`;

    const prompt = `Mission: ${mission_statement}

Repository: ${repo_url}
Available files: ${availableFiles.length} files
${availableFiles.length > 0 ? `Sample files:\n${availableFiles.slice(0, 10).join('\n')}` : ''}

Please create a comprehensive execution plan with 3-8 steps.
Each step should be specific, actionable, and assigned to an appropriate specialized agent.

Choose model preferences wisely:
- gemini-2.5-pro: Complex reasoning, architecture decisions, critical refactoring
- gemini-2.5-flash: General implementation, documentation, standard tasks
- gemini-2.0-pro: Simple tasks, code formatting, basic operations

Return the plan as a JSON array.`;

    // Generate plan using AI
    const modelToUse = (model_preference || 'gemini-2.5-flash') as ModelPreference;
    const aiResponse = await generateContent(modelToUse, prompt, systemInstruction);

    // Parse AI response
    let plan: GeneratedPlanStep[];
    try {
      // Try to extract JSON from response (handle markdown code blocks)
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
                       aiResponse.match(/\[[\s\S]*\]/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiResponse;
      plan = JSON.parse(jsonText);

      if (!Array.isArray(plan)) {
        throw new Error('Response is not an array');
      }

      // Validate plan structure
      plan = plan.map((step, index) => ({
        step_description: step.step_description || 'Unnamed step',
        agent_name: step.agent_name || `Agent-${index + 1}`,
        agent_specialization: step.agent_specialization || [],
        model_preference: (step.model_preference || 'gemini-2.5-flash') as ModelPreference,
        estimated_duration: step.estimated_duration || 10,
        dependencies: step.dependencies || [],
      }));

    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('AI Response:', aiResponse);
      
      // Return a fallback plan
      plan = [
        {
          step_description: mission_statement,
          agent_name: 'Primary-Agent',
          agent_specialization: ['general'],
          model_preference: 'gemini-2.5-flash' as ModelPreference,
          estimated_duration: 30,
          dependencies: [],
        },
      ];
    }

    return NextResponse.json({
      plan,
      context_files: availableFiles,
      model_used: modelToUse,
    });

  } catch (error) {
    console.error('Generate plan error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate plan' },
      { status: 500 }
    );
  }
}

