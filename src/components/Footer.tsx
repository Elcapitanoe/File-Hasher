import React from 'react';
import { Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>by</span>
            <a
              href="https://github.com/Elcapitanoe"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Domi Adiwijaya (@Elcapitanoe)
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/Elcapitanoe/File-Hasher-V2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>Source Code</span>
            </a>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            © 2025 File Hasher V2. All files are processed locally in your browser. No data is sent to any server.
          </p>
        </div>
      </div>
    </footer>
  );
}