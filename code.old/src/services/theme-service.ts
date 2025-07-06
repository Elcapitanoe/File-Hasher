import type { Theme, ThemeConfig } from '../types';
import { getElementById } from '../utils/dom';

export class ThemeService {
  private static readonly STORAGE_KEY = 'theme';
  private static readonly THEME_CONFIGS: Record<Theme, ThemeConfig> = {
    light: { theme: 'light', iconClass: 'bi bi-moon' },
    dark: { theme: 'dark', iconClass: 'bi bi-sun' }
  };

  private currentTheme: Theme;
  private readonly prefersDarkScheme: MediaQueryList;

  constructor() {
    this.prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    this.currentTheme = this.getInitialTheme();
    this.initialize();
  }

  private getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem(ThemeService.STORAGE_KEY) as Theme | null;
    return savedTheme || (this.prefersDarkScheme.matches ? 'dark' : 'light');
  }

  private initialize(): void {
    this.setTheme(this.currentTheme);
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    const themeToggle = getElementById<HTMLButtonElement>('theme-toggle');
    
    themeToggle?.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Listen for system theme changes
    this.prefersDarkScheme.addEventListener('change', (e) => {
      // Only change theme automatically if user hasn't set a preference
      if (!localStorage.getItem(ThemeService.STORAGE_KEY)) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  public toggleTheme(): void {
    const newTheme: Theme = this.currentTheme === 'light' ? 'dark' : 'light';
    
    // Add animation to theme toggle
    const themeToggle = getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.classList.add('animate__animated', 'animate__pulse');
      setTimeout(() => {
        themeToggle.classList.remove('animate__animated', 'animate__pulse');
      }, 500);
    }
    
    this.setTheme(newTheme);
  }

  private setTheme(theme: Theme): void {
    const themeStylesheet = getElementById<HTMLLinkElement>('theme-stylesheet');
    const themeToggle = getElementById<HTMLButtonElement>('theme-toggle');
    
    if (!themeStylesheet) {
      console.error('Theme stylesheet element not found');
      return;
    }

    // Update stylesheet with smooth transition
    document.body.style.transition = 'background 0.3s ease';
    themeStylesheet.href = `/css/style-${theme}.css`;
    
    // Update button icon
    const icon = themeToggle?.querySelector('i');
    if (icon) {
      const config = ThemeService.THEME_CONFIGS[theme];
      icon.className = config.iconClass;
    }
    
    // Save preference and update state
    localStorage.setItem(ThemeService.STORAGE_KEY, theme);
    this.currentTheme = theme;
    
    // Add theme class to body for additional styling hooks
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }

  public getCurrentTheme(): Theme {
    return this.currentTheme;
  }
}