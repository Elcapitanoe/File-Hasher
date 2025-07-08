import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '../types';

const STORAGE_KEY = 'file-hasher-theme';

/**
 * Hook for managing theme state with system preference detection
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      // Check localStorage first
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored && (stored === 'light' || stored === 'dark')) {
        return stored;
      }
      
      // Fall back to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch {
      // Fallback if localStorage is not available
      return 'light';
    }
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Save to localStorage with error handling
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        // Only auto-switch if user hasn't manually set a preference
        const hasStoredPreference = localStorage.getItem(STORAGE_KEY);
        if (!hasStoredPreference) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      } catch {
        // If localStorage is not available, still respond to system changes
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    // Use modern event listener if available, fallback to deprecated method
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const setLightTheme = useCallback(() => {
    setTheme('light');
  }, []);

  const setDarkTheme = useCallback(() => {
    setTheme('dark');
  }, []);

  return { 
    theme, 
    toggleTheme, 
    setLightTheme, 
    setDarkTheme,
    isLight: theme === 'light',
    isDark: theme === 'dark'
  };
}