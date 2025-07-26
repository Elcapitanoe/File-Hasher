export type ThemeMode = 'auto' | 'light' | 'dark';

export class ThemeManager {
  private element: HTMLElement;
  private currentTheme: ThemeMode = 'auto';
  private mediaQuery: MediaQueryList;

  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.element = this.createElement();
    this.loadSavedTheme();
    this.applyTheme();
    this.setupMediaQueryListener();
  }

  private createElement(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'theme-selector';
    container.innerHTML = `
      <div class="theme-toggle">
        <button class="theme-btn" data-theme="light" title="Light theme">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </button>
        <button class="theme-btn" data-theme="dark" title="Dark theme">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    `;

    this.setupEventListeners(container);
    return container;
  }

  private setupEventListeners(container: HTMLElement): void {
    const themeButtons = container.querySelectorAll('.theme-btn') as NodeListOf<HTMLButtonElement>;

    themeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const theme = button.dataset.theme as ThemeMode;
        this.setTheme(theme);
      });
    });
  }

  private setupMediaQueryListener(): void {
    this.mediaQuery.addEventListener('change', () => {
      if (this.currentTheme === 'auto') {
        this.applyTheme();
      }
    });
  }

  private setTheme(theme: ThemeMode): void {
    this.currentTheme = theme;
    this.saveTheme();
    this.applyTheme();
    this.updateButtonStates();
  }

  private applyTheme(): void {
    const root = document.documentElement;
    let actualTheme: 'light' | 'dark';

    if (this.currentTheme === 'auto') {
      actualTheme = this.mediaQuery.matches ? 'dark' : 'light';
    } else {
      actualTheme = this.currentTheme;
    }

    root.setAttribute('data-theme', actualTheme);
    
    if (actualTheme === 'dark') {
      root.classList.add('dark-theme');
    } else {
      root.classList.remove('dark-theme');
    }
  }

  private updateButtonStates(): void {
    const buttons = this.element.querySelectorAll('.theme-btn') as NodeListOf<HTMLButtonElement>;
    
    buttons.forEach(button => {
      const isActive = button.dataset.theme === this.currentTheme;
      button.classList.toggle('active', isActive);
    });
  }

  private saveTheme(): void {
    try {
      localStorage.setItem('theme-preference', this.currentTheme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }

  private loadSavedTheme(): void {
    try {
      const saved = localStorage.getItem('theme-preference') as ThemeMode;
      if (saved && ['auto', 'light', 'dark'].includes(saved)) {
        this.currentTheme = saved;
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }
    this.updateButtonStates();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getCurrentTheme(): ThemeMode {
    return this.currentTheme;
  }
}