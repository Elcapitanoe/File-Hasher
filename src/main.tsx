import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * Initialize theme on page load to prevent flash of unstyled content
 */
const initializeTheme = (): void => {
  const stored = localStorage.getItem('file-hasher-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored ?? (prefersDark ? 'dark' : 'light');
  
  document.documentElement.classList.add(theme);
};

// Initialize theme before React renders
initializeTheme();

// Get root element with proper error handling
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a div with id="root" in your HTML.');
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);