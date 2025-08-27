'use client';

import * as React from 'react';
import { useUIStore } from '@/lib/store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useUIStore();

  React.useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
