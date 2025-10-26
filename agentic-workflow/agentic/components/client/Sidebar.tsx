'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { 
  Command, 
  Eye, 
  Users, 
  Settings, 
  BarChart3, 
  Archive,
  ChevronLeft,
  ChevronRight,
  Plus,
  Snowflake
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Mission Control',
    href: '/plans/new',
    icon: Command,
    description: 'Plan and dispatch agents'
  },
  {
    title: 'Live Ops',
    href: '/tasks',
    icon: Eye,
    description: 'Monitor active missions'
  },
  {
    title: 'Agents',
    href: '/agents',
    icon: Users,
    description: 'Manage your workforce'
  },
  {
    title: 'Usage',
    href: '/usage',
    icon: BarChart3,
    description: 'Cost and performance metrics'
  },
  {
    title: 'Armory',
    href: '/armory',
    icon: Archive,
    description: 'Plans, docs, and prompts'
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Configuration'
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <div className={cn(
      'flex flex-col bg-card border-r border-border/50 transition-all duration-300 frost-border',
      sidebarCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center ice-glow relative">
              <Snowflake className="w-5 h-5 text-primary-foreground animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg winter-text tracking-wider">AGENTIC</span>
              <span className="text-[8px] text-muted-foreground uppercase tracking-widest">Winter is Coming</span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-auto hover:ice-glow"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border/50">
        {!sidebarCollapsed ? (
          <Button asChild className="w-full btn-winter">
            <Link href="/plans/new">
              <Plus className="w-4 h-4 mr-2" />
              New Mission
            </Link>
          </Button>
        ) : (
          <Button asChild size="icon" className="w-full btn-winter">
            <Link href="/plans/new">
              <Plus className="w-4 h-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground ice-glow shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent hover:border-primary/30 border border-transparent',
                    sidebarCollapsed && 'justify-center'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <div className="flex flex-col">
                      <span>{item.title}</span>
                      <span className="text-xs opacity-70">{item.description}</span>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        {!sidebarCollapsed && (
          <div className="text-xs text-muted-foreground space-y-2">
            <div className="flex items-center justify-between">
              <span className="uppercase tracking-wide">Active Agents</span>
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded-sm ice-glow font-bold">
                0
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground/60 italic text-center pt-2 border-t border-border/30">
              &quot;The lone wolf dies, but the pack survives.&quot;
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
