import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Initialize theme on page load
const initializeTheme = () => {
  const stored = localStorage.getItem('file-hasher-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored ?? (prefersDark ? 'dark' : 'light');
  
  document.documentElement.classList.add(theme);
};

initializeTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);