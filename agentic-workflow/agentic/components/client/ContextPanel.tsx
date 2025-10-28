'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMissionControlStore } from '@/lib/store';
import { 
  FileText, 
  Folder, 
  X, 
  Search,
  Plus,
  Database,
  Code,
  BookOpen
} from 'lucide-react';

export function ContextPanel() {
  const { selectedContext, setSelectedContext } = useMissionControlStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for development
  const mockCodebaseFiles = [
    'src/auth/controller.ts',
    'src/auth/middleware.ts',
    'src/auth/service.ts',
    'src/models/user.ts',
    'src/routes/auth.ts',
    'tests/auth.test.ts',
    'docs/auth-flow.md',
    'package.json',
    'README.md'
  ];

  const mockAIDocs = [
    {
      id: 'arch-1',
      title: 'System Architecture Overview',
      type: 'Architecture Diagram',
      tags: ['architecture', 'system-design']
    },
    {
      id: 'style-1',
      title: 'TypeScript Style Guide',
      type: 'Style Guide',
      tags: ['typescript', 'coding-standards']
    },
    {
      id: 'api-1',
      title: 'API Design Patterns',
      type: 'Documentation',
      tags: ['api', 'patterns', 'rest']
    },
    {
      id: 'db-1',
      title: 'Database Schema',
      type: 'Schema',
      tags: ['database', 'schema', 'postgresql']
    }
  ];

  const handleToggleFile = (filePath: string) => {
    const isSelected = selectedContext.includes(filePath);
    if (isSelected) {
      setSelectedContext(selectedContext.filter(f => f !== filePath));
    } else {
      setSelectedContext([...selectedContext, filePath]);
    }
  };

  const handleRemoveContext = (filePath: string) => {
    setSelectedContext(selectedContext.filter(f => f !== filePath));
  };

  const filteredCodebaseFiles = mockCodebaseFiles.filter(file =>
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAIDocs = mockAIDocs.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getFileIcon = (filePath: string) => {
    const ext = filePath.split('.').pop();
    switch (ext) {
      case 'ts':
      case 'js':
        return <Code className="w-3 h-3 text-blue-500" />;
      case 'md':
        return <BookOpen className="w-3 h-3 text-green-500" />;
      case 'json':
        return <Database className="w-3 h-3 text-yellow-500" />;
      default:
        return <FileText className="w-3 h-3 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Selected Context */}
      {selectedContext.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Selected Context:</div>
          <div className="flex flex-wrap gap-1">
            {selectedContext.map((filePath) => (
              <Badge
                key={filePath}
                variant="secondary"
                className="text-xs cursor-pointer pr-1"
              >
                <span className="truncate max-w-[120px]">{filePath}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-3 w-3 p-0 ml-1 hover:bg-red-100"
                  onClick={() => handleRemoveContext(filePath)}
                >
                  <X className="w-2 h-2" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
        <Input
          placeholder="Search files and docs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 text-xs"
        />
      </div>

      {/* Context Sources */}
      <Tabs defaultValue="codebase" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="codebase" className="text-xs">
            <Folder className="w-3 h-3 mr-1" />
            Codebase
          </TabsTrigger>
          <TabsTrigger value="ai-docs" className="text-xs">
            <Database className="w-3 h-3 mr-1" />
            AI Docs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="codebase" className="mt-3">
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {filteredCodebaseFiles.map((filePath) => (
              <div
                key={filePath}
                className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer text-xs"
                onClick={() => handleToggleFile(filePath)}
              >
                <input
                  type="checkbox"
                  checked={selectedContext.includes(filePath)}
                  onChange={() => {}}
                  className="w-3 h-3"
                  aria-label={`Select ${filePath}`}
                />
                {getFileIcon(filePath)}
                <span className="flex-1 truncate">{filePath}</span>
              </div>
            ))}
            
            {filteredCodebaseFiles.length === 0 && (
              <div className="text-center py-4 text-muted-foreground text-xs">
                No files found
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="ai-docs" className="mt-3">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredAIDocs.map((doc) => (
              <Card
                key={doc.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => handleToggleFile(doc.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={selectedContext.includes(doc.id)}
                      onChange={() => {}}
                      className="w-3 h-3 mt-0.5"
                      aria-label={`Select ${doc.title}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{doc.title}</div>
                      <div className="text-xs text-muted-foreground">{doc.type}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {doc.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredAIDocs.length === 0 && (
              <div className="text-center py-4 text-muted-foreground text-xs">
                No AI docs found
              </div>
            )}

            <Button
              size="sm"
              variant="outline"
              className="w-full border-dashed text-xs h-8"
            >
              <Plus className="w-3 h-3 mr-1" />
              Upload AI Doc
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {selectedContext.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <FileText className="w-6 h-6 mx-auto mb-2 opacity-50" />
          <p className="text-xs">No context selected</p>
          <p className="text-xs">Choose files or docs to provide context to your agents</p>
        </div>
      )}
    </div>
  );
}
