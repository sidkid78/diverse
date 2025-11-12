/**
 * Fetch file from repository
 * Usage: npx tsx scripts/fetch-repo-file.ts <filename>
 */

import { getFileContent } from '../lib/github';

const owner = 'sidkid78';
const repo = 'test1';
const filename = process.argv[2] || 'info.md';

async function fetchFile() {
  try {
    console.log(`📥 Fetching ${filename} from ${owner}/${repo}...\n`);
    const content = await getFileContent(owner, repo, filename);
    console.log(content);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

fetchFile();

