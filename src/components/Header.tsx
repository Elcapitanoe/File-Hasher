import React from 'react';
import { Shield } from 'lucide-react';
import { ThemeToggle } from './ui/ThemeToggle';

export function Header() {
  return (
    <header className="glass border-b border-gray-200 dark:border-dark-700 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 dark:bg-primary-500 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">
                File Hasher V2
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Secure client-side file hashing
              </p>
            </div>
          </div>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}