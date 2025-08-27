'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  X,
  Save,
  Eye,
  FileText,
  MessageSquare,
  BookOpen,
  Tag,
  User,
  Calendar,
  Star,
  Plus
} from 'lucide-react';

interface AssetEditorProps {
  asset: any;
  onClose: () => void;
  onSave: (asset: any) => void;
}

export function AssetEditor({ asset, onClose, onSave }: AssetEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    content: '',
    tags: [] as string[],
    category: '',
    starred: false,
    type: 'plan' as 'plan' | 'prompt' | 'doc'
  });
  const [newTag, setNewTag] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (asset && !asset.isNew) {
      setFormData({
        name: asset.name || '',
        description: asset.description || '',
        content: asset.content || '',
        tags: asset.tags || [],
        category: asset.category || '',
        starred: asset.starred || false,
        type: asset.type || 'plan'
      });
    } else if (asset?.isNew) {
      setFormData(prev => ({
        ...prev,
        type: asset.type || 'plan'
      }));
    }
  }, [asset]);

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      alert('Please fill in the name and content fields.');
      return;
    }

    const savedAsset = {
      ...asset,
      ...formData,
      id: asset?.id || `${formData.type}-${Date.now()}`,
      author: asset?.author || 'Current User',
      createdAt: asset?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: asset?.usageCount || 0
    };

    onSave(savedAsset);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'plan': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'prompt': return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'doc': return <BookOpen className="w-4 h-4 text-purple-500" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPlaceholderContent = (type: string) => {
    switch (type) {
      case 'plan':
        return `# Plan Template

## Objective
Describe the main goal of this plan...

## Steps
1. **Phase 1: Analysis**
   - Define requirements
   - Analyze current state
   
2. **Phase 2: Implementation**
   - Implement changes
   - Test thoroughly
   
3. **Phase 3: Validation**
   - Verify results
   - Document outcomes

## Success Criteria
- Define measurable success metrics
- Set acceptance criteria`;
      
      case 'prompt':
        return `You are an expert [ROLE] with [EXPERIENCE]. Your task is to [OBJECTIVE].

## Context
Provide relevant background information...

## Instructions
1. First, analyze the provided input
2. Then, apply your expertise to...
3. Finally, format your response as...

## Output Format
Structure your response with:
- Clear headings
- Bullet points for lists
- Code examples where applicable

## Quality Standards
- Be precise and actionable
- Include specific examples
- Maintain professional tone`;
      
      case 'doc':
        return `# Documentation Title

## Overview
Brief description of what this document covers...

## Key Concepts
- **Concept 1**: Definition and explanation
- **Concept 2**: Definition and explanation

## Best Practices
1. Practice 1 with rationale
2. Practice 2 with rationale

## Examples
\`\`\`
// Code example
example code here
\`\`\`

## Common Pitfalls
- Pitfall 1 and how to avoid it
- Pitfall 2 and how to avoid it

## Resources
- [Link 1](url)
- [Link 2](url)`;
      
      default:
        return 'Start writing your content here...';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getTypeIcon(formData.type)}
              <CardTitle>
                {asset?.isNew ? 'Create New' : 'Edit'} {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
              </CardTitle>
              {formData.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col min-h-0 space-y-4">
          {!previewMode ? (
            <>
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter asset name..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="e.g., Frontend, Backend, Security..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of this asset..."
                  rows={2}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-500"
                        aria-label={`Remove ${tag} tag`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1"
                  />
                  <Button onClick={handleAddTag} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Starred */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="starred"
                  checked={formData.starred}
                  onChange={(e) => handleInputChange('starred', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="starred" className="text-sm font-medium flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Star this asset
                </label>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col min-h-0 space-y-2">
                <label className="text-sm font-medium">Content *</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder={getPlaceholderContent(formData.type)}
                  className="flex-1 min-h-0 resize-none font-mono text-sm"
                />
              </div>
            </>
          ) : (
            /* Preview Mode */
            <div className="flex-1 min-h-0 space-y-4">
              <div className="border-b pb-4">
                <h2 className="text-xl font-bold">{formData.name || 'Untitled'}</h2>
                <p className="text-muted-foreground">{formData.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  {formData.category && (
                    <Badge variant="outline">{formData.category}</Badge>
                  )}
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {asset?.author || 'Current User'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex-1 overflow-auto">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                  {formData.content || 'No content yet...'}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
