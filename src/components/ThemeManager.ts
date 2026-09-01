import { Icons } from "./Icons";

export class ThemeManager {
  private element: HTMLElement;
  private currentTheme: "light" | "dark" = "dark";

  constructor() {
    this.element = document.createElement("div");
    this.element.className = "theme-switcher";

    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") {
      this.currentTheme = saved;
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      this.currentTheme = "light";
    }

    this.render();
    this.applyTheme(this.currentTheme);
    this.bindEvents();
  }

  private render(): void {
    this.element.innerHTML = `
      <div class="controls-group" role="group" aria-label="Color scheme selection">
        <button type="button" class="icon-btn" data-theme="light" title="Light theme" aria-label="Select light theme">
          ${Icons.sun}
        </button>
        <button type="button" class="icon-btn" data-theme="dark" title="Dark theme" aria-label="Select dark theme">
          ${Icons.moon}
        </button>
      </div>
    `;
    this.updateUI();
  }

  private bindEvents(): void {
    const buttons = this.element.querySelectorAll<HTMLButtonElement>(".icon-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const theme = btn.dataset.theme as "light" | "dark";
        this.applyTheme(theme);
      });
    });
  }

  private applyTheme(theme: "light" | "dark"): void {
    this.currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    this.updateUI();
  }

  private updateUI(): void {
    const buttons = this.element.querySelectorAll<HTMLButtonElement>(".icon-btn");
    buttons.forEach((btn) => {
      const matches = btn.dataset.theme === this.currentTheme;
      btn.classList.toggle("active", matches);
      btn.setAttribute("aria-pressed", matches.toString());
    });
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
