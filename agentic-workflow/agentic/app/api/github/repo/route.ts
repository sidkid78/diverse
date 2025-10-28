/**
 * GitHub Repository API
 * Get repository information and contents
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseRepoUrl, getRepository } from '@/lib/github';

export const runtime = 'nodejs';

/**
 * GET /api/github/repo?url=<repo_url>
 * Get repository information
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const repoUrl = searchParams.get('url');

    if (!repoUrl) {
      return NextResponse.json(
        { error: 'url parameter is required' },
        { status: 400 }
      );
    }

    // Parse repository URL
    const repoInfo = parseRepoUrl(repoUrl);
    if (!repoInfo) {
      return NextResponse.json(
        { error: 'Invalid repository URL' },
        { status: 400 }
      );
    }

    const { owner, repo } = repoInfo;

    // Get repository information
    const repoData = await getRepository(owner, repo);

    return NextResponse.json({
      name: repoData.name,
      full_name: repoData.full_name,
      description: repoData.description,
      url: repoData.html_url,
      default_branch: repoData.default_branch,
      language: repoData.language,
      languages_url: repoData.languages_url,
      size: repoData.size,
      created_at: repoData.created_at,
      updated_at: repoData.updated_at,
      pushed_at: repoData.pushed_at,
    });

  } catch (error) {
    console.error('Get repository error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get repository' },
      { status: 500 }
    );
  }
}

