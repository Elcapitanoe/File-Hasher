import { ThemeService } from './services/theme-service';
import { FileHandler } from './components/file-handler';

// Add CSS for animations and custom styles
function addCustomStyles(): void {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .spin {
      animation: spin 1s linear infinite;
    }
    
    footer a {
      color: inherit;
      transition: color 0.3s ease;
    }
    
    footer a:hover {
      color: var(--primary-500, #4361ee) !important;
    }
    
    /* Ensure file input is properly hidden but still functional */
    .drop-zone-input {
      position: absolute !important;
      left: -9999px !important;
      opacity: 0 !important;
      pointer-events: none !important;
      width: 1px !important;
      height: 1px !important;
    }
    
    /* Make drop zone more clickable */
    .drop-zone {
      cursor: pointer !important;
    }
    
    .drop-zone:hover {
      cursor: pointer !important;
    }
    
    /* Browse button alternative styling */
    .browse-alternative {
      margin-top: var(--space-4, 1rem);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-3, 0.75rem);
      pointer-events: auto;
      position: relative;
      z-index: 10;
    }
    
    .or-divider {
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--secondary-500, #64748b);
      font-weight: 500;
      position: relative;
      padding: 0 var(--space-4, 1rem);
      pointer-events: none;
    }
    
    .or-divider::before,
    .or-divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 40px;
      height: 1px;
      background: var(--secondary-300, #cbd5e1);
    }
    
    .or-divider::before {
      left: -50px;
    }
    
    .or-divider::after {
      right: -50px;
    }
    
    #browse-button {
      transition: all var(--transition-base, 250ms cubic-bezier(0.4, 0, 0.2, 1));
      border-radius: var(--radius-md, 0.75rem);
      font-weight: 500;
      padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
      font-size: var(--font-size-sm, 0.875rem);
      pointer-events: auto !important;
      position: relative;
      z-index: 20;
      cursor: pointer !important;
      background: transparent;
      border: 1px solid var(--primary-500, #4361ee);
      color: var(--primary-500, #4361ee);
    }
    
    #browse-button:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
      background: var(--primary-500, #4361ee);
      color: white;
    }
    
    #browse-button:active {
      transform: translateY(0);
    }
    
    #browse-button:focus {
      outline: 2px solid var(--primary-500, #4361ee);
      outline-offset: 2px;
    }
    
    /* Ensure browse button area doesn't interfere with drop zone clicks */
    .drop-zone-prompt {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-4, 1rem);
      pointer-events: none;
    }
    
    .drop-zone-prompt > * {
      pointer-events: none;
    }
    
    .drop-zone-prompt .browse-alternative {
      pointer-events: auto;
    }
    
    .drop-zone-prompt .browse-alternative * {
      pointer-events: auto;
    }
    
    /* Responsive adjustments */
    @media (max-width: 480px) {
      .or-divider::before,
      .or-divider::after {
        width: 30px;
      }
      
      .or-divider::before {
        left: -40px;
      }
      
      .or-divider::after {
        right: -40px;
      }
      
      #browse-button {
        font-size: var(--font-size-xs, 0.75rem);
        padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
      }
    }
    
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Application initialization
class Application {
  private readonly themeService: ThemeService;
  private readonly fileHandler: FileHandler;

  constructor() {
    this.themeService = new ThemeService();
    this.fileHandler = new FileHandler();
  }

  public initialize(): void {
    console.log('File Hasher V2 initialized successfully');
    // Access services to satisfy TypeScript unused variable check
    console.log('Theme service active:', this.themeService.getCurrentTheme());
    console.log('File handler ready:', !!this.fileHandler);
    
    // Debug: Check if browse button exists
    const browseButton = document.getElementById('browse-button');
    console.log('Browse button found:', !!browseButton);
    if (browseButton) {
      console.log('Browse button element:', browseButton);
    }
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing File Hasher V2...');
  
  addCustomStyles();
  
  const app = new Application();
  app.initialize();
});