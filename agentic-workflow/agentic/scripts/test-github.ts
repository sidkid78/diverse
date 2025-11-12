/**
 * GitHub Connection Test
 * Run with: npx tsx scripts/test-github.ts
 */

import { getRepository, listRepositoryFiles, isGitHubConfigured, validateToken } from '../lib/github';

async function testGitHubConnection() {
  console.log('🔍 Testing GitHub Connection...\n');

  // Check if token is configured
  if (!isGitHubConfigured()) {
    console.error('❌ GITHUB_TOKEN not configured!');
    console.log('\nPlease add GITHUB_TOKEN to your .env.local file');
    process.exit(1);
  }

  console.log('✅ GitHub token found');

  // Validate token
  console.log('🔐 Validating token...');
  const isValid = await validateToken();
  
  if (!isValid) {
    console.error('❌ Invalid GitHub token!');
    process.exit(1);
  }

  console.log('✅ Token is valid\n');

  // Test your repository
  const owner = 'sidkid78';
  const repo = 'test1';

  console.log(`📦 Testing repository: ${owner}/${repo}\n`);

  try {
    // Get repository info
    console.log('📋 Fetching repository info...');
    const repoInfo = await getRepository(owner, repo);
    console.log(`✅ Repository: ${repoInfo.full_name}`);
    console.log(`   Description: ${repoInfo.description || 'No description'}`);
    console.log(`   Default branch: ${repoInfo.default_branch}`);
    console.log(`   Private: ${repoInfo.private}`);
    console.log();

    // List files
    console.log('📁 Listing repository files...');
    const files = await listRepositoryFiles(owner, repo);
    console.log(`✅ Found ${files.length} files:\n`);
    
    files.slice(0, 10).forEach(file => console.log(`   - ${file}`));
    
    if (files.length > 10) {
      console.log(`   ... and ${files.length - 10} more files`);
    }

    console.log('\n✨ All tests passed! GitHub integration is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the test
testGitHubConnection().catch(console.error);

