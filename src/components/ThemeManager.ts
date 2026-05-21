import { Icons } from "./Icons";

export class ThemeManager {
  private container: HTMLDivElement;
  private currentTheme: "light" | "dark" = "dark";

  constructor() {
    this.container = document.createElement("div");
    this.container.className = "controls-group";
    
    // Check system preference or saved preference
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") {
      this.currentTheme = saved;
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      this.currentTheme = "light";
    }

    this.render();
    this.applyTheme(this.currentTheme);
    this.setupListeners();
  }

  private render() {
    this.container.innerHTML = `
      <button class="icon-btn" data-theme="light" title="Light Mode">
        ${Icons.sun}
      </button>
      <button class="icon-btn" data-theme="dark" title="Dark Mode">
        ${Icons.moon}
      </button>
    `;
    this.updateActiveButton();
  }

  private setupListeners() {
    const buttons = this.container.querySelectorAll(".icon-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const target = (e.currentTarget as HTMLButtonElement);
        const theme = target.dataset.theme as "light" | "dark";
        this.applyTheme(theme);
      });
    });
  }

  private applyTheme(theme: "light" | "dark") {
    this.currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    this.updateActiveButton();
  }

  private updateActiveButton() {
    const buttons = this.container.querySelectorAll(".icon-btn");
    buttons.forEach((btn) => {
      if ((btn as HTMLButtonElement).dataset.theme === this.currentTheme) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  public getElement(): HTMLElement {
    return this.container;
  }
}
