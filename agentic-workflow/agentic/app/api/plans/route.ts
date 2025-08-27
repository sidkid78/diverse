import { NextRequest, NextResponse } from 'next/server';

// Mock plans database
const mockPlans = [
  {
    plan_id: 'plan-1',
    name: 'JWT Authentication Migration',
    description: 'Migrate from session-based to JWT authentication',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    author: 'Sarah Chen',
    tags: ['authentication', 'jwt', 'migration', 'security'],
    steps: [
      {
        step_id: 'step-1',
        title: 'Analysis Phase',
        description: 'Analyze current session-based authentication implementation',
        estimated_duration: 1800,
        agent_requirements: ['analysis', 'security-review']
      },
      {
        step_id: 'step-2',
        title: 'JWT Implementation',
        description: 'Implement JWT token generation and validation',
        estimated_duration: 3600,
        agent_requirements: ['backend-development', 'security']
      },
      {
        step_id: 'step-3',
        title: 'Middleware Update',
        description: 'Update authentication middleware to use JWT',
        estimated_duration: 2400,
        agent_requirements: ['backend-development']
      },
      {
        step_id: 'step-4',
        title: 'Testing & Validation',
        description: 'Comprehensive testing of new authentication flow',
        estimated_duration: 1800,
        agent_requirements: ['testing', 'qa']
      }
    ],
    context_files: [
      { file_path: 'src/auth/', description: 'Current authentication logic' },
      { file_path: 'src/middleware/', description: 'Authentication middleware' },
      { file_path: 'tests/auth/', description: 'Existing auth tests' }
    ],
    ai_docs: [
      { doc_id: 'jwt-best-practices', title: 'JWT Security Best Practices' },
      { doc_id: 'auth-patterns', title: 'Authentication Patterns Guide' }
    ],
    estimated_cost: 2500,
    estimated_duration: 9600,
    success_criteria: [
      'All existing tests pass',
      'New JWT tests achieve 100% coverage',
      'Performance impact < 10%',
      'Security audit passes'
    ]
  },
  {
    plan_id: 'plan-2',
    name: 'API Documentation Generation',
    description: 'Auto-generate comprehensive API documentation',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    author: 'Alex Rodriguez',
    tags: ['documentation', 'api', 'openapi', 'swagger'],
    steps: [
      {
        step_id: 'step-1',
        title: 'Code Analysis',
        description: 'Analyze existing API endpoints and schemas',
        estimated_duration: 1200,
        agent_requirements: ['analysis', 'api-documentation']
      },
      {
        step_id: 'step-2',
        title: 'OpenAPI Generation',
        description: 'Generate OpenAPI/Swagger specifications',
        estimated_duration: 2400,
        agent_requirements: ['documentation', 'api-design']
      },
      {
        step_id: 'step-3',
        title: 'Documentation Site',
        description: 'Create interactive documentation website',
        estimated_duration: 1800,
        agent_requirements: ['frontend-development', 'documentation']
      }
    ],
    context_files: [
      { file_path: 'src/api/', description: 'API route handlers' },
      { file_path: 'src/types/', description: 'TypeScript type definitions' }
    ],
    ai_docs: [
      { doc_id: 'api-doc-standards', title: 'API Documentation Standards' },
      { doc_id: 'openapi-guide', title: 'OpenAPI Specification Guide' }
    ],
    estimated_cost: 1200,
    estimated_duration: 5400,
    success_criteria: [
      'All endpoints documented',
      'Interactive examples working',
      'Documentation site deployed',
      'Team approval received'
    ]
  }
];

// GET /api/plans - List all plans
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const tags = searchParams.get('tags')?.split(',');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredPlans = [...mockPlans];

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPlans = filteredPlans.filter(plan =>
        plan.name.toLowerCase().includes(searchLower) ||
        plan.description.toLowerCase().includes(searchLower) ||
        plan.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by tags
    if (tags && tags.length > 0) {
      filteredPlans = filteredPlans.filter(plan =>
        tags.some(tag => plan.tags.includes(tag))
      );
    }

    // Apply pagination
    const paginatedPlans = filteredPlans.slice(offset, offset + limit);

    return NextResponse.json({
      plans: paginatedPlans,
      total: filteredPlans.length,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}

// POST /api/plans - Create a new plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      steps, 
      context_files, 
      ai_docs, 
      tags,
      author 
    } = body;

    // Validate required fields
    if (!name || !description || !steps || !Array.isArray(steps)) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, steps' },
        { status: 400 }
      );
    }

    // Calculate estimates
    const estimated_duration = steps.reduce((sum: number, step: any) => 
      sum + (step.estimated_duration || 0), 0);
    const estimated_cost = Math.floor(estimated_duration * 0.25); // $0.25 per second estimate

    // Create new plan
    const newPlan = {
      plan_id: `plan-${Date.now()}`,
      name,
      description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: author || 'Anonymous',
      tags: tags || [],
      steps: steps.map((step: any, index: number) => ({
        step_id: `step-${index + 1}`,
        ...step
      })),
      context_files: context_files || [],
      ai_docs: ai_docs || [],
      estimated_cost,
      estimated_duration,
      success_criteria: body.success_criteria || []
    };

    // Add to mock database
    mockPlans.push(newPlan);

    return NextResponse.json({
      plan: newPlan,
      message: 'Plan created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    );
  }
}
