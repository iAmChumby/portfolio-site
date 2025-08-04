'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SunIcon, MoonIcon } from './icons';

export interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className={cn(
          'relative inline-flex h-10 w-20 items-center rounded-full border-2 border-gray-300 bg-gray-200 transition-colors duration-200',
          className
        )}
        disabled
      >
        <span className="sr-only">Toggle theme</span>
        <div className="h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex h-10 w-20 items-center rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2',
        'border-white shadow-[0_0_0_1px_white] hover:shadow-[0_0_8px_rgba(255,255,255,0.6)]',
        'dark:border-white dark:shadow-[0_0_0_1px_white] dark:hover:shadow-[0_0_8px_rgba(255,255,255,0.6)]',
        theme === 'dark'
          ? 'bg-gray-700'
          : 'bg-gray-200',
        className
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {/* Toggle circle */}
      <div
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-full shadow-lg transition-all duration-300 relative z-20',
          theme === 'dark'
            ? 'translate-x-13 bg-gray-800 border border-white'
            : 'translate-x-1 bg-white border border-gray-300'
        )}
      >
        {/* Only show the current theme icon */}
        {theme === 'dark' ? (
          <MoonIcon size={12} className="text-white" />
        ) : (
          <SunIcon size={12} className="text-yellow-500" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;