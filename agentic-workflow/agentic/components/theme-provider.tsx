'use client';

import * as React from 'react';
import { useUIStore } from '@/lib/store';

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'dark',
}: ThemeProviderProps) {
  const { theme, toggleTheme } = useUIStore();

  React.useEffect(() => {
    // Set default theme on mount if not already set
    if (!theme) {
      toggleTheme();
    }
   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    root.classList.add(theme || defaultTheme);
  }, [theme, defaultTheme]);

  return <>{children}</>;
}
