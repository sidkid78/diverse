/**
 * GitHub Files API
 * List and retrieve files from repository
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseRepoUrl, listRepositoryFiles, getFileContent } from '@/lib/github';

export const runtime = 'nodejs';

/**
 * GET /api/github/files?url=<repo_url>&path=<file_path>
 * List files or get file content
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const repoUrl = searchParams.get('url');
    const filePath = searchParams.get('path');

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

    // If path is provided, get file content
    if (filePath) {
      const content = await getFileContent(owner, repo, filePath);
      return NextResponse.json({
        path: filePath,
        content,
      });
    }

    // Otherwise, list all files
    const files = await listRepositoryFiles(owner, repo);

    // Filter out common directories to ignore
    const filteredFiles = files.filter(file => 
      !file.includes('node_modules/') &&
      !file.includes('.git/') &&
      !file.includes('dist/') &&
      !file.includes('build/') &&
      !file.includes('.next/') &&
      !file.includes('coverage/')
    );

    return NextResponse.json({
      files: filteredFiles,
      total: filteredFiles.length,
    });

  } catch (error) {
    console.error('Get files error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get files' },
      { status: 500 }
    );
  }
}

