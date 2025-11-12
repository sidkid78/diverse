# GitHub Integration Setup

This guide will help you connect your Agentic Workflow to your GitHub repository.

## 📋 Prerequisites

- A GitHub account
- Repository: `sidkid78/test1`

## 🔑 Step 1: Create a Personal Access Token

1. Go to [GitHub Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Give it a descriptive name: `Agentic Workflow`
4. Set expiration (recommended: 90 days)
5. Select the following scopes:
   - ✅ **repo** (Full control of private repositories)
     - `repo:status`
     - `repo_deployment`
     - `public_repo`
     - `repo:invite`
     - `security_events`
6. Click **"Generate token"**
7. **Copy the token immediately** (you won't see it again!)

## 🔧 Step 2: Configure Environment Variables

Create a `.env.local` file in the `agentic` directory:

```bash
# agentic-workflow/agentic/.env.local
GITHUB_TOKEN=ghp_your_token_here_xxxxxxxxxxxxxx
```

Replace `ghp_your_token_here_xxxxxxxxxxxxxx` with your actual token.

## ✅ Step 3: Test the Connection

Run the test script to verify everything is working:

```bash
cd agentic-workflow/agentic
npx tsx scripts/test-github.ts
```

Expected output:
```
🔍 Testing GitHub Connection...
✅ GitHub token found
🔐 Validating token...
✅ Token is valid

📦 Testing repository: sidkid78/test1
📋 Fetching repository info...
✅ Repository: sidkid78/test1
   Description: ...
   Default branch: main
   Private: false

📁 Listing repository files...
✅ Found X files:
   - README.md
   - ...

✨ All tests passed! GitHub integration is working correctly.
```

## 🚀 Step 4: Use the API

### List Files in Repository

```bash
# Using curl
curl "http://localhost:3000/api/github/files?url=https://github.com/sidkid78/test1"
```

### Get Specific File Content

```bash
# Get README.md content
curl "http://localhost:3000/api/github/files?url=https://github.com/sidkid78/test1&path=README.md"
```

### From Your Application

```typescript
// List all files
const response = await fetch('/api/github/files?url=https://github.com/sidkid78/test1');
const data = await response.json();
console.log(data.files); // Array of file paths

// Get file content
const fileResponse = await fetch('/api/github/files?url=https://github.com/sidkid78/test1&path=src/index.ts');
const fileData = await fileResponse.json();
console.log(fileData.content); // File content as string
```

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use Classic tokens** - Fine-grained tokens may have issues with some operations
3. **Set token expiration** - Regularly rotate your tokens
4. **Limit scope** - Only grant necessary permissions
5. **Use environment variables** - Never hardcode tokens in your code

## 🐛 Troubleshooting

### "GITHUB_TOKEN not configured"
- Verify `.env.local` exists in the `agentic` directory
- Check the file name (must be `.env.local`, not `.env`)
- Restart your dev server after creating the file

### "Invalid GitHub token"
- Token may have expired
- Token may have been revoked
- Generate a new token with correct scopes

### "Repository not found" or "404"
- Check repository name: `sidkid78/test1`
- Verify token has access to the repository
- If private repo, ensure `repo` scope is enabled

### "Rate limit exceeded"
- GitHub has rate limits: 5,000 requests/hour for authenticated requests
- Wait an hour or use a different token

## 📚 Available GitHub Functions

See `lib/github.ts` for all available functions:

- `parseRepoUrl()` - Parse GitHub URLs
- `getRepository()` - Get repo metadata
- `getContents()` - Get directory contents
- `getFileContent()` - Read file content
- `listRepositoryFiles()` - List all files recursively
- `createOrUpdateFile()` - Create/update files
- `createBranch()` - Create new branches
- `createPullRequest()` - Create PRs
- `getRepositoryTree()` - Get full repo tree
- `validateToken()` - Check if token is valid
- `isGitHubConfigured()` - Check if token exists
- `getAuthenticatedUser()` - Get current user info

## 🔗 Your Repository

**Repository URL:** https://github.com/sidkid78/test1

Once configured, your agentic workflow can:
- ✅ Read all files in the repository
- ✅ Get file contents
- ✅ Create and update files
- ✅ Create branches
- ✅ Create pull requests
- ✅ List directory structure

## 🎯 Next Steps

1. Set up your GitHub token
2. Run the test script
3. Integrate GitHub operations into your agentic workflow
4. Consider adding webhook support for real-time updates

