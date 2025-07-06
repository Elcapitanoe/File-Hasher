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
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing File Hasher V2...');
  
  addCustomStyles();
  
  const app = new Application();
  app.initialize();
});