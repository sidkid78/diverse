'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUIStore, useAuthStore } from '@/lib/store';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Zap,
  Bell,
  Key,
  Database,
  GitBranch,
  Save,
  Moon,
  Sun,
  Trash2,
  Download,
  Upload
} from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useUIStore();
  const { user } = useAuthStore();
  
  const [settings, setSettings] = useState({
    // User Profile
    displayName: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    bio: 'Senior Software Engineer',
    
    // API Keys
    geminiApiKey: '••••••••••••••••••••••••',
    githubToken: '••••••••••••••••••••••••',
    
    // Preferences
    defaultModel: 'gemini-2.5-flash',
    autoSave: true,
    notifications: true,
    soundEffects: false,
    
    // Notification Settings
    notifyOnTaskComplete: true,
    notifyOnTaskFailed: true,
    notifyOnAgentStart: false,
    emailNotifications: false,
    desktopNotifications: true,
    
    // Execution
    maxConcurrentAgents: 5,
    defaultTimeout: 30,
    autoRetry: true,
    retryAttempts: 3,
    
    // Repository
    defaultRepo: 'https://github.com/sidkid78/agentic.git',
    defaultBranch: 'main',
    autoCommit: false,
    
    // Advanced
    debugMode: false,
    telemetry: true,
    cacheDuration: 3600
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: string, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings);
    setHasChanges(false);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      // Reset logic here
      setHasChanges(false);
      alert('Settings reset to defaults');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'agentic-settings.json';
    link.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string);
            setSettings(imported);
            setHasChanges(true);
            alert('Settings imported successfully!');
          } catch (error: unknown) {
            if (error instanceof Error) {
              alert(`Failed to import settings. Invalid file format: ${error.message}`);
            } else {
              alert('Failed to import settings. Invalid file format.');
            }
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const testNotification = () => {
    if (settings.desktopNotifications && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Agentic Test Notification', {
          body: 'Your notifications are working correctly!',
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Agentic Test Notification', {
              body: 'Your notifications are working correctly!',
              icon: '/favicon.ico'
            });
          }
        });
      } else {
        alert('Notifications are blocked. Please enable them in your browser settings.');
      }
    } else {
      alert('Desktop notifications are disabled or not supported by your browser.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-blue-500" />
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your account and application preferences</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleImport}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          {hasChanges && (
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="execution">Execution</TabsTrigger>
          <TabsTrigger value="repository">Repository</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Profile
              </CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Name</label>
                <Input
                  value={settings.displayName}
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  value={settings.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Appearance
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="text-sm text-muted-foreground">
                      Currently using {theme === 'dark' ? 'dark' : 'light'} mode
                    </p>
                  </div>
                  <Button variant="outline" onClick={toggleTheme}>
                    {theme === 'dark' ? (
                      <>
                        <Sun className="w-4 h-4 mr-2" />
                        Switch to Light
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4 mr-2" />
                        Switch to Dark
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Keys
              </CardTitle>
              <CardDescription>Manage your API keys and integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Google Gemini API Key</label>
                  <Badge variant="outline" className="text-xs">Required</Badge>
                </div>
                <Input
                  type="password"
                  value={settings.geminiApiKey}
                  onChange={(e) => handleChange('geminiApiKey', e.target.value)}
                  placeholder="Enter your Gemini API key"
                />
                <p className="text-xs text-muted-foreground">
                  Get your API key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">GitHub Personal Access Token</label>
                  <Badge variant="outline" className="text-xs">Optional</Badge>
                </div>
                <Input
                  type="password"
                  value={settings.githubToken}
                  onChange={(e) => handleChange('githubToken', e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                />
                <p className="text-xs text-muted-foreground">
                  Required for private repository access and Git operations
                </p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <Shield className="w-4 h-4 text-yellow-500" />
                  <div className="text-sm">
                    <p className="font-medium">Security Notice</p>
                    <p className="text-muted-foreground">API keys are stored locally and never sent to our servers</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Preferences
              </CardTitle>
              <CardDescription>Customize your workflow experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Default AI Model</label>
                <select
                  title="Default AI Model"
                  value={settings.defaultModel}
                  onChange={(e) => handleChange('defaultModel', e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (High-Intellect)</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Latest)</option>
                  <option value="gemini-2.0-pro">Gemini 2.0 Pro (Speed)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Auto-save Plans</p>
                  <p className="text-sm text-muted-foreground">Automatically save changes to your plans</p>
                </div>
                <input
                  title="Auto-save Plans"
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => handleChange('autoSave', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications for task completion</p>
                </div>
                <input
                  title="Notifications"
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleChange('notifications', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Sound Effects</p>
                  <p className="text-sm text-muted-foreground">Play sounds for important events</p>
                </div>
                <input
                  title="Notifications Checkbox"
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={(e) => handleChange('soundEffects', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Task Completion</p>
                  <p className="text-sm text-muted-foreground">Notify when a task completes successfully</p>
                </div>
                <input
                  title="Task Completion"
                  type="checkbox"
                  checked={settings.notifyOnTaskComplete}
                  onChange={(e) => handleChange('notifyOnTaskComplete', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Task Failure</p>
                  <p className="text-sm text-muted-foreground">Notify when a task fails or encounters an error</p>
                </div>
                <input
                  title="Task Failure"
                  type="checkbox"
                  checked={settings.notifyOnTaskFailed}
                  onChange={(e) => handleChange('notifyOnTaskFailed', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Agent Start</p>
                  <p className="text-sm text-muted-foreground">Notify when an agent begins execution</p>
                </div>
                <input
                  title="Agent Start"
                  type="checkbox"
                  checked={settings.notifyOnAgentStart}
                  onChange={(e) => handleChange('notifyOnAgentStart', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Notification Channels</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Desktop Notifications</p>
                      <p className="text-sm text-muted-foreground">Show browser notifications</p>
                    </div>
                    <input
                      title="Desktop Notifications"
                      type="checkbox"
                      checked={settings.desktopNotifications}
                      onChange={(e) => handleChange('desktopNotifications', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Send notifications to your email</p>
                    </div>
                    <input
                      title="Email Notifications"
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={testNotification}
                  className="w-full"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Test Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Execution Tab */}
        <TabsContent value="execution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Execution Settings
              </CardTitle>
              <CardDescription>Configure how tasks are executed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Concurrent Agents</label>
                <Input
                  type="number"
                  value={settings.maxConcurrentAgents}
                  onChange={(e) => handleChange('maxConcurrentAgents', parseInt(e.target.value))}
                  min={1}
                  max={10}
                />
                <p className="text-xs text-muted-foreground">Maximum number of agents that can run simultaneously</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Default Timeout (minutes)</label>
                <Input
                  type="number"
                  value={settings.defaultTimeout}
                  onChange={(e) => handleChange('defaultTimeout', parseInt(e.target.value))}
                  min={5}
                  max={120}
                />
                <p className="text-xs text-muted-foreground">Maximum time before a task is automatically cancelled</p>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Auto-retry Failed Tasks</p>
                  <p className="text-sm text-muted-foreground">Automatically retry tasks that fail</p>
                </div>
                <input
                  title="Auto-retry Failed Tasks"
                  type="checkbox"
                  checked={settings.autoRetry}
                  onChange={(e) => handleChange('autoRetry', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>

              {settings.autoRetry && (
                <div className="space-y-2 ml-4">
                  <label className="text-sm font-medium">Retry Attempts</label>
                  <Input
                    type="number"
                    value={settings.retryAttempts}
                    onChange={(e) => handleChange('retryAttempts', parseInt(e.target.value))}
                    min={1}
                    max={5}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Repository Tab */}
        <TabsContent value="repository" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Repository Settings
              </CardTitle>
              <CardDescription>Configure Git and repository preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Repository URL</label>
                <Input
                  value={settings.defaultRepo}
                  onChange={(e) => handleChange('defaultRepo', e.target.value)}
                  placeholder="https://github.com/username/repo.git"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Default Branch</label>
                <Input
                  value={settings.defaultBranch}
                  onChange={(e) => handleChange('defaultBranch', e.target.value)}
                  placeholder="main"
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Auto-commit Changes</p>
                  <p className="text-sm text-muted-foreground">Automatically commit changes made by agents</p>
                </div>
                <input
                  title="Auto-commit Changes"
                  type="checkbox"
                  checked={settings.autoCommit}
                  onChange={(e) => handleChange('autoCommit', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Advanced Settings
              </CardTitle>
              <CardDescription>Advanced configuration options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Debug Mode</p>
                  <p className="text-sm text-muted-foreground">Show detailed logs and debugging information</p>
                </div>
                <input
                  title="Debug Mode"
                  type="checkbox"
                  checked={settings.debugMode}
                  onChange={(e) => handleChange('debugMode', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Usage Telemetry</p>
                  <p className="text-sm text-muted-foreground">Help improve the platform by sharing anonymous usage data</p>
                </div>
                <input
                  title="Usage Telemetry"
                  type="checkbox"
                  checked={settings.telemetry}
                  onChange={(e) => handleChange('telemetry', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cache Duration (seconds)</label>
                <Input
                  type="number"
                  value={settings.cacheDuration}
                  onChange={(e) => handleChange('cacheDuration', parseInt(e.target.value))}
                  min={0}
                  max={86400}
                />
                <p className="text-xs text-muted-foreground">How long to cache API responses (0 to disable)</p>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  variant="destructive" 
                  onClick={handleReset}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset All Settings to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
