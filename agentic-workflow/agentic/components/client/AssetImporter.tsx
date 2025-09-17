'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  X,
  Upload,
  FileText,
  MessageSquare,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Link,
  Copy
} from 'lucide-react';

interface Asset {
  id?: string;
  name?: string;
  description?: string;
  content?: string;
  tags?: string[];
  category?: string;
  starred?: boolean;
  type?: 'plan' | 'prompt' | 'doc';
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  usageCount?: number;
  isNew?: boolean;
}

interface AssetImporterProps {
  onClose: () => void;
  onImport: (assets: Asset[]) => void;
}

export function AssetImporter({ onClose, onImport }: AssetImporterProps) {
  const [importMethod, setImportMethod] = useState<'file' | 'url' | 'text'>('file');
  const [importData, setImportData] = useState('');
  const [parsedAssets, setParsedAssets] = useState<Asset[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(content);
          processImportData(data);
        } else if (file.name.endsWith('.md')) {
          processMarkdownFile(content, file.name);
        } else {
          processTextFile(content, file.name);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Error processing file. Please check the format.');
      }
      setIsProcessing(false);
    };
    
    reader.readAsText(file);
  };

  const processImportData = (data: Asset[] | { assets: Asset[] }) => {
    let assets: Asset[] = [];
    
    if (Array.isArray(data)) {
      assets = data as Asset[];
    } else if (data.assets && Array.isArray(data.assets)) {
      assets = data.assets as Asset[];
    } else {
      assets = [data as Asset];
    }
    
    // Validate and format assets
    const formattedAssets = assets.map((asset, index) => ({
      id: asset.id || `imported-${Date.now()}-${index}`,
      type: asset.type || 'doc',
      name: asset.name || asset.name || `Imported Asset ${index + 1}`,
      description: asset.description || asset.description || '',
      content: asset.content || asset.content || '',
      tags: asset.tags || [],
      category: asset.category || 'Imported',
      author: asset.author || 'Imported',
      createdAt: asset.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      starred: false
    }));
    
    setParsedAssets(formattedAssets);
  };

  const processMarkdownFile = (content: string, filename: string) => {
    const asset = {
      id: `imported-${Date.now()}`,
      type: 'doc' as const,
      name: filename.replace('.md', ''),
      description: 'Imported from Markdown file',
      content: content,
      tags: ['imported', 'markdown'],
      category: 'Imported',
      author: 'Imported',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      starred: false
    };
    
    setParsedAssets([asset]);
  };

  const processTextFile = (content: string, filename: string) => {
    const asset = {
      id: `imported-${Date.now()}`,
      type: 'doc' as const,
      name: filename.replace(/\.[^/.]+$/, ''),
      description: 'Imported from text file',
      content: content,
      tags: ['imported', 'text'],
      category: 'Imported',
      author: 'Imported',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      starred: false
    };
    
    setParsedAssets([asset]);
  };

  const handleTextImport = () => {
    if (!importData.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Try to parse as JSON first
      const data = JSON.parse(importData);
      processImportData(data);
    } catch {
      // If not JSON, treat as plain text
      const asset = {
        id: `imported-${Date.now()}`,
        type: 'doc' as const,
        name: 'Imported Text',
        description: 'Imported from text input',
        content: importData,
        tags: ['imported', 'text'],
        category: 'Imported',
        author: 'Imported',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        starred: false
      };
      
      setParsedAssets([asset]);
    }
    
    setIsProcessing(false);
  };

  const handleUrlImport = async () => {
    if (!importData.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would fetch from the URL
      // For now, we'll simulate it
      const asset = {
        id: `imported-${Date.now()}`,
        type: 'doc' as const,
        name: 'Imported from URL',
        description: `Imported from ${importData}`,
        content: `# Content from ${importData}\n\nThis content would be fetched from the provided URL.`,
        tags: ['imported', 'url'],
        category: 'Imported',
        author: 'Imported',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        starred: false
      };
      
      setParsedAssets([asset]);
    } catch (error) {
      console.error('Error importing from URL:', error);
      alert('Error importing from URL. Please check the URL and try again.');
    }
    
    setIsProcessing(false);
  };

  const handleImport = () => {
    if (parsedAssets.length === 0) {
      alert('No assets to import. Please process some data first.');
      return;
    }
    
    onImport(parsedAssets);
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'plan': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'prompt': return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'doc': return <BookOpen className="w-4 h-4 text-purple-500" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const sampleJson = `{
  "assets": [
    {
      "type": "plan",
      "name": "Sample Plan",
      "description": "A sample plan template",
      "content": "# Plan\\n\\n## Steps\\n1. Step 1\\n2. Step 2",
      "tags": ["sample", "template"],
      "category": "Example"
    },
    {
      "type": "prompt",
      "name": "Sample Prompt",
      "description": "A sample AI prompt",
      "content": "You are an expert...",
      "tags": ["ai", "prompt"],
      "category": "AI"
    }
  ]
}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Import Assets
              </CardTitle>
              <CardDescription>
                Import plans, prompts, and documentation from various sources
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col min-h-0 space-y-4">
          <Tabs value={importMethod} onValueChange={(value) => setImportMethod(value as 'file' | 'url' | 'text')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="file">File Upload</TabsTrigger>
              <TabsTrigger value="url">From URL</TabsTrigger>
              <TabsTrigger value="text">Text/JSON</TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">Upload Files</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Support for JSON, Markdown (.md), and text files
                </p>
                <input
                  title="Upload Files"
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.md,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()} disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Choose File'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="https://example.com/assets.json"
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                  <Button onClick={handleUrlImport} disabled={isProcessing || !importData.trim()}>
                    <Link className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Fetching...' : 'Fetch'}
                  </Button>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                URL should point to a JSON file containing asset data
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">JSON Data</label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setImportData(sampleJson)}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Use Sample
                  </Button>
                </div>
                <Textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste your JSON data here..."
                  className="min-h-[200px] font-mono text-sm"
                />
                <Button onClick={handleTextImport} disabled={isProcessing || !importData.trim()}>
                  {isProcessing ? 'Processing...' : 'Process Data'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Preview */}
          {parsedAssets.length > 0 && (
            <div className="flex-1 min-h-0 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Preview ({parsedAssets.length} assets)</h3>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setParsedAssets([])}>
                    Clear
                  </Button>
                  <Button onClick={handleImport}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Import All
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto border rounded-lg">
                <div className="space-y-2 p-4">
                  {parsedAssets.map((asset, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-start gap-3">
                        {getAssetIcon(asset.type as string)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{asset.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {asset.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {asset.description}
                          </p>
                          {asset.tags && asset.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {asset.tags.slice(0, 3).map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {asset.tags && asset.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{asset.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
