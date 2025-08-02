export type ThemeMode = "auto" | "light" | "dark";

export class ThemeManager {
  private element: HTMLElement;
  private currentTheme: ThemeMode = "auto";
  private mediaQuery: MediaQueryList;
  private isExpanded: boolean = false;

  constructor() {
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this.element = this.createElement();
    this.loadSavedTheme();
    this.applyTheme();
    this.setupMediaQueryListener();
  }

  private createElement(): HTMLElement {
    const container = document.createElement("div");
    container.className = "theme-selector";
    container.innerHTML = `
      <div class="theme-toggle" id="themeToggle">
        <button class="theme-btn active-theme" id="activeThemeBtn" title="Change theme">
          <svg class="theme-icon light-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
          <svg class="theme-icon dark-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <svg class="theme-icon auto-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </button>
        <div class="theme-options" id="themeOptions">
          <button class="theme-option-btn" data-theme="light" title="Light theme">
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
            <span>Light</span>
          </button>
          <button class="theme-option-btn" data-theme="auto" title="Auto theme">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <span>Auto</span>
          </button>
          <button class="theme-option-btn" data-theme="dark" title="Dark theme">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            <span>Dark</span>
          </button>
        </div>
      </div>
    `;

    this.setupEventListeners(container);
    return container;
  }

  private setupEventListeners(container: HTMLElement): void {
    const themeToggle = container.querySelector("#themeToggle") as HTMLElement;
    const activeThemeBtn = container.querySelector("#activeThemeBtn") as HTMLButtonElement;
    const themeOptions = container.querySelector("#themeOptions") as HTMLElement;
    const themeOptionButtons = container.querySelectorAll(
      ".theme-option-btn",
    ) as NodeListOf<HTMLButtonElement>;

    // Handle active theme button click (mobile)
    activeThemeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleExpanded();
    });

    // Handle hover for desktop
    themeToggle.addEventListener("mouseenter", () => {
      if (window.innerWidth > 768) {
        this.expand();
      }
    });

    themeToggle.addEventListener("mouseleave", () => {
      if (window.innerWidth > 768) {
        this.collapse();
      }
    });

    // Handle theme option selection
    themeOptionButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        const theme = button.dataset.theme as ThemeMode;
        this.setTheme(theme);
        this.collapse();
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!themeToggle.contains(e.target as Node)) {
        this.collapse();
      }
    });
  }

  private toggleExpanded(): void {
    if (this.isExpanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  private expand(): void {
    if (this.isExpanded) return;
    
    this.isExpanded = true;
    const themeToggle = this.element.querySelector("#themeToggle") as HTMLElement;
    const themeOptions = this.element.querySelector("#themeOptions") as HTMLElement;
    
    themeToggle.classList.add("expanded");
    themeOptions.style.display = "flex";
    
    // Calculate and set proper width based on content
    const optionButtons = themeOptions.querySelectorAll('.theme-option-btn');
    let maxWidth = 0;
    
    optionButtons.forEach(button => {
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.whiteSpace = 'nowrap';
      tempSpan.style.fontSize = '0.875rem';
      tempSpan.style.fontWeight = '500';
      tempSpan.textContent = button.textContent || '';
      document.body.appendChild(tempSpan);
      
      const textWidth = tempSpan.offsetWidth;
      document.body.removeChild(tempSpan);
      
      // Add padding and icon space (16px icon + 8px gap + 32px padding)
      const totalWidth = textWidth + 56;
      maxWidth = Math.max(maxWidth, totalWidth);
    });
    
    // Ensure minimum width and apply
    const finalWidth = Math.max(maxWidth, 140);
    themeToggle.style.width = `${finalWidth}px`;
    themeOptions.style.width = `${finalWidth}px`;
    
    // Trigger animation
    requestAnimationFrame(() => {
      themeOptions.classList.add("visible");
    });
  }

  private collapse(): void {
    if (!this.isExpanded) return;
    
    this.isExpanded = false;
    const themeToggle = this.element.querySelector("#themeToggle") as HTMLElement;
    const themeOptions = this.element.querySelector("#themeOptions") as HTMLElement;
    
    themeToggle.classList.remove("expanded");
    themeOptions.classList.remove("visible");
    
    // Reset width to auto for collapsed state
    themeToggle.style.width = '';
    themeOptions.style.width = '';
    
    // Hide after animation
    setTimeout(() => {
      if (!this.isExpanded) {
        themeOptions.style.display = "none";
      }
    }, 200);
  }

  private updateActiveThemeIcon(): void {
    const activeThemeBtn = this.element.querySelector("#activeThemeBtn") as HTMLButtonElement;
    const lightIcon = activeThemeBtn.querySelector(".light-icon") as SVGElement;
    const darkIcon = activeThemeBtn.querySelector(".dark-icon") as SVGElement;
    const autoIcon = activeThemeBtn.querySelector(".auto-icon") as SVGElement;

    // Hide all icons
    lightIcon.style.display = "none";
    darkIcon.style.display = "none";
    autoIcon.style.display = "none";

    // Show current theme icon
    switch (this.currentTheme) {
      case "light":
        lightIcon.style.display = "block";
        break;
      case "dark":
        darkIcon.style.display = "block";
        break;
      case "auto":
        autoIcon.style.display = "block";
        break;
    }
  }

  private setupEventListeners_old(container: HTMLElement): void {
    const themeButtons = container.querySelectorAll(
      ".theme-btn",
    ) as NodeListOf<HTMLButtonElement>;

    themeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const theme = button.dataset.theme as ThemeMode;
        this.setTheme(theme);
      });
    });
  }

  private setupMediaQueryListener(): void {
    this.mediaQuery.addEventListener("change", () => {
      if (this.currentTheme === "auto") {
        this.applyTheme();
      }
    });
  }

  private setTheme(theme: ThemeMode): void {
    this.currentTheme = theme;
    this.saveTheme();
    this.applyTheme();
    this.updateButtonStates();
    this.updateActiveThemeIcon();
  }

  private applyTheme(): void {
    const root = document.documentElement;
    let actualTheme: "light" | "dark";

    if (this.currentTheme === "auto") {
      actualTheme = this.mediaQuery.matches ? "dark" : "light";
    } else {
      actualTheme = this.currentTheme;
    }

    root.setAttribute("data-theme", actualTheme);

    if (actualTheme === "dark") {
      root.classList.add("dark-theme");
    } else {
      root.classList.remove("dark-theme");
    }
  }

  private updateButtonStates(): void {
    const buttons = this.element.querySelectorAll(
      ".theme-option-btn",
    ) as NodeListOf<HTMLButtonElement>;

    buttons.forEach((button) => {
      const isActive = button.dataset.theme === this.currentTheme;
      button.classList.toggle("active", isActive);
    });
  }

  private saveTheme(): void {
    try {
      localStorage.setItem("theme-preference", this.currentTheme);
    } catch (error) {
      console.warn("Failed to save theme preference:", error);
    }
  }

  private loadSavedTheme(): void {
    try {
      const saved = localStorage.getItem("theme-preference") as ThemeMode;
      if (saved && ["auto", "light", "dark"].includes(saved)) {
        this.currentTheme = saved;
      }
    } catch (error) {
      console.warn("Failed to load theme preference:", error);
    }
    this.updateButtonStates();
    this.updateActiveThemeIcon();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getCurrentTheme(): ThemeMode {
    return this.currentTheme;
  }
}
