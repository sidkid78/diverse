/**
 * GitHub API Integration
 * Provides repository operations and file management
 */

import { Octokit } from '@octokit/rest';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  console.warn('⚠️ GITHUB_TOKEN not found. GitHub features will be disabled.');
}

const octokit = GITHUB_TOKEN
  ? new Octokit({
      auth: GITHUB_TOKEN,
    })
  : null;

/**
 * Parse GitHub repository URL
 */
export function parseRepoUrl(repoUrl: string): { owner: string; repo: string } | null {
  try {
    const url = new URL(repoUrl);
    const [, owner, repo] = url.pathname.split('/');
    if (!owner || !repo) return null;
    return { owner, repo: repo.replace('.git', '') };
  } catch {
    return null;
  }
}

/**
 * Get GitHub client
 */
export function getClient() {
  if (!octokit) {
    throw new Error('GitHub token not configured. Please set GITHUB_TOKEN environment variable.');
  }
  return octokit;
}

/**
 * Get repository information
 */
export async function getRepository(owner: string, repo: string) {
  const client = getClient();
  try {
    const { data } = await client.repos.get({ owner, repo });
    return data;
  } catch (error) {
    console.error('GitHub API error:', error);
    throw new Error(`Failed to get repository: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get repository contents
 */
export async function getContents(owner: string, repo: string, path = '') {
  const client = getClient();
  try {
    const { data } = await client.repos.getContent({
      owner,
      repo,
      path,
    });
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('GitHub API error:', error);
    throw new Error(`Failed to get contents: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get file content
 */
export async function getFileContent(owner: string, repo: string, path: string): Promise<string> {
  const client = getClient();
  try {
    const { data } = await client.repos.getContent({
      owner,
      repo,
      path,
    });

    if (Array.isArray(data) || data.type !== 'file') {
      throw new Error('Path is not a file');
    }

    if (!data.content) {
      throw new Error('File has no content');
    }

    return Buffer.from(data.content, 'base64').toString('utf-8');
  } catch (error) {
    console.error('GitHub API error:', error);
    throw new Error(`Failed to get file content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * List repository files recursively
 */
export async function listRepositoryFiles(
  owner: string,
  repo: string,
  path = '',
  fileList: string[] = []
): Promise<string[]> {
  const client = getClient();
  try {
    const { data } = await client.repos.getContent({
      owner,
      repo,
      path,
    });

    const items = Array.isArray(data) ? data : [data];

    for (const item of items) {
      if (item.type === 'file') {
        fileList.push(item.path);
      } else if (item.type === 'dir') {
        await listRepositoryFiles(owner, repo, item.path, fileList);
      }
    }

    return fileList;
  } catch (error) {
    console.error('GitHub API error:', error);
    throw new Error(`Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create or update file in repository
 */
export async function createOrUpdateFile(
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  sha?: string
) {
  const client = getClient();
  try {
    const { data } = await client.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      sha,
    });
    return data;
  } catch (error) {
    console.error('GitHub API error:', error);
    throw new Error(`Failed to create/update file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create a new branch
 */
export async function createBranch(owner: string, repo: string, branchName: string, fromBranch = 'main') {
  const client = getClient();
  try {
    // Get the SHA of the base branch
    const { data: refData } = await client.git.getRef({
      owner,
      repo,
      ref: `heads/${fromBranch}`,
    });

    // Create the new branch
    const { data } = await client.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: refData.object.sha,
    });

    return data;
  } catch (error) {
    console.error('GitHub API error:', error);
    throw new Error(`Failed to create branch: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create a pull request
 */
export async function createPullRequest(
  owner: string,
  repo: string,
  title: string,
  body: string,
  head: string,
  base = 'main'
) {
  const client = getClient();
  try {
    const { data } = await client.pulls.create({
      owner,
      repo,
      title,
      body,
      head,
      base,
    });
    return data;
  } catch (error) {
    console.error('GitHub API error:', error);
    throw new Error(`Failed to create pull request: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get repository tree
 */
export async function getRepositoryTree(owner: string, repo: string, branch = 'main') {
  const client = getClient();
  try {
    const { data } = await client.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: 'true',
    });
    return data.tree;
  } catch (error) {
    console.error('GitHub API error:', error);
    throw new Error(`Failed to get repository tree: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate GitHub token
 */
export async function validateToken(): Promise<boolean> {
  if (!octokit) return false;

  try {
    await octokit.users.getAuthenticated();
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if GitHub is configured
 */
export function isGitHubConfigured(): boolean {
  return !!GITHUB_TOKEN;
}

/**
 * Get authenticated user information
 */
export async function getAuthenticatedUser() {
  const client = getClient();
  try {
    const { data } = await client.users.getAuthenticated();
    return data;
  } catch (error) {
    console.error('GitHub API error:', error);
    throw new Error(`Failed to get user info: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
