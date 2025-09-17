'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, useUIStore } from '@/lib/store';
import { 
  Bell, 
  User, 
  Sun, 
  Moon, 
  Activity,
  DollarSign,
  Clock
} from 'lucide-react';

export function Header() {
  const { user } = useAuthStore();
  const { theme, toggleTheme, activeAgents } = useUIStore();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-card">
      {/* Left side - Status indicators */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-muted-foreground">System Status:</span>
          <Badge variant="success">Operational</Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="text-muted-foreground">Active Tasks:</span>
          <Badge variant="info">{activeAgents.length}</Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-yellow-500" />
          <span className="text-muted-foreground">Today&apos;s Cost:</span>
          <Badge variant="warning">$12.50</Badge>
        </div>
      </div>

      {/* Right side - User actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="w-4 h-4" />
        </Button>
        
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </Button>
        
        <div className="flex items-center gap-2 ml-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="text-sm">
            <div className="font-medium">{user?.name || 'User'}</div>
            <div className="text-muted-foreground text-xs">
              {user?.email || 'user@example.com'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
