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
  Plus
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
      'flex flex-col bg-card border-r transition-all duration-300',
      sidebarCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Command className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Agentic</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-auto"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b">
        {!sidebarCollapsed ? (
          <Button asChild className="w-full">
            <Link href="/plans/new">
              <Plus className="w-4 h-4 mr-2" />
              New Mission
            </Link>
          </Button>
        ) : (
          <Button asChild size="icon" className="w-full">
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
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent',
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
      <div className="p-4 border-t">
        {!sidebarCollapsed && (
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Active Agents</span>
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded">
                0
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
