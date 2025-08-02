export type ThemeMode = "auto" | "light" | "dark";

export class ThemeManager {
  private element: HTMLElement;
  private currentTheme: ThemeMode = "auto";
  private mediaQuery: MediaQueryList;

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
      <div class="theme-slider-container" id="themeSlider">
        <div class="theme-slider-track">
          <div class="theme-slider-indicator" id="sliderIndicator"></div>
          
<button class="theme-option" data-theme="light" title="Light theme">
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-darkmode" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"></path></svg>
</button>

<button class="theme-option" data-theme="auto" title="Auto theme">
  <svg xmlns="http://www.w3.org/2000/svg"
       width="24" height="24"
       viewBox="0 0 24 24"
       fill="currentColor">
    <text x="12" y="16" text-anchor="middle" font-size="14" font-family="sans-serif">A</text>
  </svg>
</button>

<button class="theme-option" data-theme="dark" title="Dark theme">
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-darkmode" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M9.37 5.51A7.35 7.35 0 009.1 7.5c0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27A7.014 7.014 0 0112 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"></path></svg>
</button>

          
        </div>
      </div>
    `;

    this.setupEventListeners(container);
    return container;
  }

  private setupEventListeners(container: HTMLElement): void {
    const themeOptions = container.querySelectorAll(
      ".theme-option",
    ) as NodeListOf<HTMLButtonElement>;

    themeOptions.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        const theme = button.dataset.theme as ThemeMode;
        this.setTheme(theme);
      });
    });
  }

  private updateSliderPosition(): void {
    const indicator = this.element.querySelector("#sliderIndicator") as HTMLElement;
    const themeIndex = this.currentTheme === "light" ? 0 : this.currentTheme === "auto" ? 1 : 2;
    const translateX = themeIndex * 100;
    indicator.style.transform = `translateX(${translateX}%)`;
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
    this.updateSliderPosition();
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
    this.updateSliderPosition();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getCurrentTheme(): ThemeMode {
    return this.currentTheme;
  }
}
