'use client';

/**
 * ArmoryInterface is the main UI component for managing the user's asset library,
 * including plans, prompts, and documentation. It provides search, filtering,
 * sorting, and view mode controls, as well as interfaces for creating, editing,
 * importing, and exporting assets. The component displays an overview of asset
 * categories and renders the asset library and relevant modals.
 */
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssetLibrary } from '@/components/client/AssetLibrary';
import { AssetEditor } from '@/components/client/AssetEditor';
import { AssetImporter } from '@/components/client/AssetImporter';
import { 
  Archive,
  Search,
  Plus,
  Upload,
  Download,
  FileText,
  MessageSquare,
  BookOpen,
  Grid,
  List,
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

/**
 * Main component for the Armory asset management interface.
 * Provides controls for searching, filtering, sorting, and viewing assets,
 * as well as creating, editing, importing, and exporting them.
 */
export function ArmoryInterface() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterBy, setFilterBy] = useState<'all' | 'plans' | 'prompts' | 'docs'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'usage'>('recent');
  const [showEditor, setShowEditor] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Hardcoded asset counts for demonstration purposes
  const assetCounts = {
    plans: 12,
    prompts: 38,
    docs: 15,
    total: 65
  };

  /**
   * Handler to initiate creation of a new asset of the given type.
   * @param type - The type of asset to create ('plan', 'prompt', or 'doc')
   */
  const handleCreateNew = (type: 'plan' | 'prompt' | 'doc') => {
    setSelectedAsset({ type, isNew: true });
    setShowEditor(true);
  };

  /**
   * Handler to initiate editing of an existing asset.
   * @param asset - The asset to edit
   */
  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowEditor(true);
  };

  /**
   * Handler to open the asset importer modal.
   */
  const handleImportAssets = () => {
    setShowImporter(true);
  };

  /**
   * Handler to export assets (stub implementation).
   */
  const handleExportAssets = () => {
    // In production, this would export selected assets
    alert('📦 Assets exported successfully!');
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Archive className="w-6 h-6 text-purple-500" />
            Armory
          </h1>
          <p className="text-muted-foreground">Manage your library of plans, prompts, and documentation</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {assetCounts.total} Assets
          </Badge>
          <Button onClick={handleImportAssets}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={handleExportAssets} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search plans, prompts, and docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Tabs value={filterBy} onValueChange={(value) => setFilterBy(value as 'all' | 'plans' | 'prompts' | 'docs')}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="plans">Plans</TabsTrigger>
                  <TabsTrigger value="prompts">Prompts</TabsTrigger>
                  <TabsTrigger value="docs">Docs</TabsTrigger>
                </TabsList>
              </Tabs>

              <select
                title="Sort by"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'name' | 'usage')}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="recent">Recent</option>
                <option value="name">Name</option>
                <option value="usage">Most Used</option>
              </select>

              <div className="flex border rounded-md">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCreateNew('plan')}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Plan Templates
            </CardTitle>
            <CardDescription>Reusable mission blueprints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-600">{assetCounts.plans}</div>
              <Button size="sm">
                <Plus className="w-3 h-3 mr-1" />
                New Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCreateNew('prompt')}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-500" />
              Prompt Library
            </CardTitle>
            <CardDescription>Optimized AI prompts and templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">{assetCounts.prompts}</div>
              <Button size="sm">
                <Plus className="w-3 h-3 mr-1" />
                New Prompt
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCreateNew('doc')}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              AI Documentation
            </CardTitle>
            <CardDescription>Context docs and knowledge base</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-purple-600">{assetCounts.docs}</div>
              <Button size="sm">
                <Plus className="w-3 h-3 mr-1" />
                New Doc
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Library */}
      <div className="flex-1 min-h-0">
        <AssetLibrary
          searchQuery={searchQuery}
          filterBy={filterBy}
          sortBy={sortBy}
          viewMode={viewMode}
          onEditAsset={handleEditAsset}
        />
      </div>

      {/* Modals */}
      {showEditor && (
        <AssetEditor
          asset={selectedAsset as Asset}
          onClose={() => {
            setShowEditor(false);
            setSelectedAsset(null);
          }}
          onSave={(asset: Asset) => {
            console.log('Saving asset:', asset);
            setShowEditor(false);
            setSelectedAsset(null);
          }}
        />
      )}

      {showImporter && (
        <AssetImporter
          onClose={() => setShowImporter(false)}
          onImport={(assets: Asset[]) => {
            console.log('Importing assets:', assets);
            setShowImporter(false);
          }}
        />
      )}
    </div>
  );
}
