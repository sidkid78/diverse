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
    <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
      {/* Left side - Status indicators */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-muted-foreground uppercase tracking-wide text-xs">System Status:</span>
          <Badge variant="success" className="ice-glow">Operational</Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm border-l border-border/50 pl-4">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground uppercase tracking-wide text-xs">Active Tasks:</span>
          <Badge variant="info" className="ice-pulse">{activeAgents.length}</Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm border-l border-border/50 pl-4">
          <DollarSign className="w-4 h-4 text-accent" />
          <span className="text-muted-foreground uppercase tracking-wide text-xs">Today&apos;s Cost:</span>
          <Badge variant="warning">$12.50</Badge>
        </div>
      </div>

      {/* Right side - User actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hover:ice-glow rounded-sm">
          <Bell className="w-4 h-4" />
        </Button>
        
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:ice-glow rounded-sm">
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </Button>
        
        <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border/50">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center ice-glow">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="text-sm">
            <div className="font-medium tracking-wide">{user?.name || 'Lord Commander'}</div>
            <div className="text-muted-foreground text-xs">
              {user?.email || 'commander@thewall.north'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
