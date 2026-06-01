'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800/50" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 rounded-full glass-card hover:bg-primary-blue/10 dark:hover:bg-primary-green/10 transition-all text-text-dark dark:text-white"
      aria-label="Toggle theme"
      id="theme-toggle-btn"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
      ) : (
        <Moon className="w-4 h-4 text-primary-blue" />
      )}
    </button>
  );
}
