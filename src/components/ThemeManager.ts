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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
</svg>
</button>

<button class="theme-option" data-theme="auto" title="Auto theme">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5Z" clip-rule="evenodd" />
</svg>
</button>

<button class="theme-option" data-theme="dark" title="Dark theme">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clip-rule="evenodd" />
</svg>
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
