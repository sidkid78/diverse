'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  MessageSquare, 
  BookOpen,
  Star,
  Clock,
  User,
  Edit,
  Copy,
  Trash2,
  Eye,
  Download
} from 'lucide-react';
import { formatTimestamp } from '@/lib/utils';

interface AssetLibraryProps {
  searchQuery: string;
  filterBy: 'all' | 'plans' | 'prompts' | 'docs';
  sortBy: 'recent' | 'name' | 'usage';
  viewMode: 'grid' | 'list';
  onEditAsset: (asset: any) => void;
}

// Mock data for assets
const mockAssets = [
  {
    id: 'plan-1',
    type: 'plan',
    name: 'JWT Authentication Refactor',
    description: 'Complete refactor from session-based to JWT authentication with refresh tokens',
    content: `# JWT Authentication Refactor Plan

## Objective
Replace session-based authentication with JWT tokens for better scalability and stateless architecture.

## Steps
1. **Analysis Phase**
   - Review current session implementation
   - Identify all authentication touchpoints
   - Document current user flow

2. **Implementation Phase**
   - Create JWT service class
   - Implement token generation/validation
   - Update middleware
   - Add refresh token logic

3. **Testing Phase**
   - Unit tests for JWT service
   - Integration tests for auth flow
   - Security testing

## Success Criteria
- All tests pass
- No breaking changes to user experience
- Improved performance metrics`,
    tags: ['authentication', 'jwt', 'refactor', 'security'],
    author: 'Sarah Chen',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    usageCount: 15,
    starred: true,
    category: 'Backend'
  },
  {
    id: 'prompt-1',
    type: 'prompt',
    name: 'Code Review Assistant',
    description: 'Comprehensive code review prompt for identifying bugs, security issues, and improvements',
    content: `You are an expert code reviewer with 10+ years of experience. Review the provided code and provide feedback in the following format:

## 🐛 Bugs & Issues
- List any bugs or logical errors
- Highlight potential runtime issues
- Note edge cases not handled

## 🔒 Security Concerns
- Identify security vulnerabilities
- Check for input validation issues
- Review authentication/authorization

## ⚡ Performance & Optimization
- Suggest performance improvements
- Identify inefficient algorithms
- Recommend caching strategies

## 🧹 Code Quality
- Comment on readability and maintainability
- Suggest refactoring opportunities
- Check adherence to best practices

## ✅ Positive Aspects
- Highlight well-written code
- Acknowledge good practices
- Praise elegant solutions

Keep feedback constructive and specific. Provide code examples where helpful.`,
    tags: ['code-review', 'quality', 'security', 'performance'],
    author: 'Alex Rodriguez',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    usageCount: 42,
    starred: true,
    category: 'Development'
  },
  {
    id: 'doc-1',
    type: 'doc',
    name: 'React Best Practices',
    description: 'Comprehensive guide to React development standards and patterns',
    content: `# React Development Best Practices

## Component Architecture
- Use functional components with hooks
- Keep components small and focused
- Implement proper prop validation
- Use TypeScript for type safety

## State Management
- Use local state for component-specific data
- Implement Context for shared state
- Consider Zustand for complex state
- Avoid prop drilling

## Performance
- Use React.memo for expensive components
- Implement useMemo and useCallback appropriately
- Lazy load components with React.Suspense
- Optimize bundle size

## Code Organization
- Follow consistent file naming conventions
- Group related components in folders
- Separate business logic from UI components
- Use custom hooks for reusable logic

## Testing
- Write unit tests for components
- Use React Testing Library
- Test user interactions, not implementation
- Maintain high test coverage`,
    tags: ['react', 'best-practices', 'frontend', 'typescript'],
    author: 'Maria Garcia',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    usageCount: 28,
    starred: false,
    category: 'Frontend'
  },
  {
    id: 'prompt-2',
    type: 'prompt',
    name: 'API Documentation Generator',
    description: 'Generate comprehensive API documentation from code',
    content: `Generate comprehensive API documentation for the provided code. Include:

## Endpoint Overview
- HTTP method and URL
- Brief description of functionality
- Authentication requirements

## Request Format
\`\`\`json
{
  "parameter": "type and description",
  "required": true/false
}
\`\`\`

## Response Format
### Success (200)
\`\`\`json
{
  "data": "response structure",
  "message": "success message"
}
\`\`\`

### Error Responses
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## Code Examples
### cURL
\`\`\`bash
curl -X POST \\
  https://api.example.com/endpoint \\
  -H 'Authorization: Bearer token' \\
  -d '{"key": "value"}'
\`\`\`

### JavaScript
\`\`\`javascript
const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
\`\`\`

Make the documentation clear, complete, and developer-friendly.`,
    tags: ['api', 'documentation', 'openapi', 'swagger'],
    author: 'David Kim',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    usageCount: 19,
    starred: false,
    category: 'Documentation'
  },
  {
    id: 'plan-2',
    type: 'plan',
    name: 'Database Migration Strategy',
    description: 'Safe database schema migration with zero downtime',
    content: `# Database Migration Strategy

## Pre-Migration Checklist
- [ ] Backup current database
- [ ] Test migration on staging
- [ ] Prepare rollback plan
- [ ] Schedule maintenance window
- [ ] Notify stakeholders

## Migration Steps
1. **Preparation**
   - Create migration scripts
   - Validate data integrity
   - Set up monitoring

2. **Execution**
   - Run backward-compatible changes first
   - Deploy application updates
   - Execute breaking changes
   - Verify data consistency

3. **Validation**
   - Run automated tests
   - Check application functionality
   - Monitor performance metrics
   - Validate data integrity

## Rollback Procedure
1. Stop application traffic
2. Restore from backup
3. Revert application code
4. Validate system functionality

## Success Metrics
- Zero data loss
- < 5 minutes downtime
- All tests passing
- Performance within 10% of baseline`,
    tags: ['database', 'migration', 'devops', 'postgresql'],
    author: 'Jennifer Liu',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    usageCount: 8,
    starred: true,
    category: 'Database'
  },
  {
    id: 'doc-2',
    type: 'doc',
    name: 'Security Checklist',
    description: 'Essential security practices for web applications',
    content: `# Web Application Security Checklist

## Authentication & Authorization
- [ ] Implement strong password policies
- [ ] Use multi-factor authentication
- [ ] Secure session management
- [ ] Proper JWT implementation
- [ ] Role-based access control

## Input Validation
- [ ] Validate all user inputs
- [ ] Sanitize data before processing
- [ ] Use parameterized queries
- [ ] Implement rate limiting
- [ ] Validate file uploads

## Data Protection
- [ ] Encrypt sensitive data at rest
- [ ] Use HTTPS for all communications
- [ ] Implement proper key management
- [ ] Secure API endpoints
- [ ] Regular security audits

## Infrastructure Security
- [ ] Keep dependencies updated
- [ ] Secure server configuration
- [ ] Regular security patches
- [ ] Monitor for vulnerabilities
- [ ] Implement logging and monitoring

## Compliance
- [ ] GDPR compliance (if applicable)
- [ ] Data retention policies
- [ ] Privacy policy updates
- [ ] Security incident response plan`,
    tags: ['security', 'checklist', 'compliance', 'best-practices'],
    author: 'Michael Brown',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    usageCount: 35,
    starred: true,
    category: 'Security'
  }
];

export function AssetLibrary({ searchQuery, filterBy, sortBy, viewMode, onEditAsset }: AssetLibraryProps) {
  // Filter assets based on search and filter criteria
  let filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = searchQuery === '' || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterBy === 'all' || 
      (filterBy === 'plans' && asset.type === 'plan') ||
      (filterBy === 'prompts' && asset.type === 'prompt') ||
      (filterBy === 'docs' && asset.type === 'doc');
    
    return matchesSearch && matchesFilter;
  });

  // Sort assets
  filteredAssets.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'usage':
        return b.usageCount - a.usageCount;
      case 'recent':
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'plan': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'prompt': return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'doc': return <BookOpen className="w-4 h-4 text-purple-500" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'plan': return 'bg-blue-100 text-blue-800';
      case 'prompt': return 'bg-green-100 text-green-800';
      case 'doc': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDuplicate = (asset: any) => {
    console.log('Duplicating asset:', asset.name);
    alert(`📋 "${asset.name}" duplicated successfully!`);
  };

  const handleDelete = (asset: any) => {
    if (confirm(`Are you sure you want to delete "${asset.name}"?`)) {
      console.log('Deleting asset:', asset.name);
      alert(`🗑️ "${asset.name}" deleted successfully!`);
    }
  };

  const handleDownload = (asset: any) => {
    console.log('Downloading asset:', asset.name);
    alert(`📥 "${asset.name}" downloaded successfully!`);
  };

  if (filteredAssets.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <div className="text-center">
            <Archive className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-medium mb-2">No assets found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Try adjusting your search terms' : 'Create your first asset to get started'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getAssetIcon(asset.type)}
                      <Badge className={getAssetTypeColor(asset.type)}>
                        {asset.type}
                      </Badge>
                      {asset.starred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                    </div>
                    <CardTitle className="text-lg">{asset.name}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {asset.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {asset.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {asset.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{asset.tags.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {asset.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(asset.updatedAt)}
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Used {asset.usageCount} times
                </div>
                
                <div className="flex items-center gap-1">
                  <Button size="sm" onClick={() => onEditAsset(asset)}>
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDuplicate(asset)}>
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDownload(asset)}>
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(asset)} className="text-red-600">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {getAssetIcon(asset.type)}
                      {asset.starred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{asset.name}</h3>
                        <Badge className={getAssetTypeColor(asset.type)}>
                          {asset.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{asset.description}</p>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {asset.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(asset.updatedAt)}
                      </div>
                      <div>{asset.usageCount} uses</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button size="sm" onClick={() => onEditAsset(asset)}>
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDuplicate(asset)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDownload(asset)}>
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(asset)} className="text-red-600">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
