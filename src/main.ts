import "./style.css";
import { type HashAlgorithm, HashGenerator } from "./hashGenerator";
import { HashCard } from "./components/HashCard";
import { InputSection } from "./components/InputSection";
import { FileUpload } from "./components/FileUpload";
import { ThemeManager } from "./components/ThemeManager";
import { Icons } from "./components/Icons";

class HashGeneratorApp {
  private hashCards: Map<HashAlgorithm, HashCard> = new Map();
  private inputSection!: InputSection;
  private fileUpload!: FileUpload;
  private themeManager!: ThemeManager;
  
  private debounceTimer: number | null = null;
  private currentMode: "text" | "file" = "text";

  constructor() {
    this.initializeApp();
  }

  private initializeApp(): void {
    const appEl = document.querySelector<HTMLDivElement>("#app");
    if (!appEl) return;

    appEl.innerHTML = `
      <div class="app-layout">
        <header class="app-header">
          <div class="brand">
            <div class="brand-icon">${Icons.shield}</div>
            <h1 class="brand-title">File Hasher</h1>
          </div>
          <div id="theme-controls"></div>
        </header>

        <main class="main-content">
          <section id="input-mount"></section>
          
          <section class="hash-results">
            <h2 class="hash-results-title">Computed Hashes</h2>
            <div class="hash-grid" id="hash-grid"></div>
          </section>
        </main>

        <footer class="app-footer">
          <div>Built for speed and privacy. All operations are local.</div>
          <div class="footer-links">
            <a href="https://github.com/Elcapitanoe/File-Hasher" target="_blank" rel="noopener noreferrer" class="footer-link">GitHub</a>
          </div>
        </footer>
      </div>
    `;

    this.mountComponents();
    this.setupKeyboardShortcuts();
  }

  private mountComponents(): void {
    // Theme Manager
    this.themeManager = new ThemeManager();
    document.getElementById("theme-controls")?.appendChild(this.themeManager.getElement());

    // Input Section
    this.inputSection = new InputSection(
      (value: string) => this.handleTextInput(value),
      (mode: "text" | "file") => this.handleModeChange(mode)
    );
    document.getElementById("input-mount")?.appendChild(this.inputSection.getElement());

    // File Upload
    this.fileUpload = new FileUpload(
      (file: File) => this.handleFileSelect(file),
      () => this.handleClearAll()
    );
    this.inputSection.getFileContainer().appendChild(this.fileUpload.getElement());

    // Hash Cards
    const grid = document.getElementById("hash-grid");
    const algorithms: HashAlgorithm[] = ["md5", "sha1", "sha256", "sha512", "sha3-256", "sha3-512"];

    algorithms.forEach((algorithm) => {
      const card = new HashCard(algorithm);
      this.hashCards.set(algorithm, card);
      grid?.appendChild(card.getElement());
    });
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        if (this.currentMode === "text") {
          this.inputSection.focus();
        }
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "l") {
        event.preventDefault();
        this.inputSection.clearText();
        this.handleClearAll();
      }
    });
  }

  private handleTextInput(value: string): void {
    if (this.currentMode !== "text") return;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    if (!value) {
      this.handleClearAll();
      return;
    }

    this.debounceTimer = window.setTimeout(() => {
      this.hashCards.forEach(card => card.updateHash(value));
    }, 300);
  }

  private handleClearAll(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.hashCards.forEach(card => card.setHash(""));
  }

  private handleModeChange(mode: "text" | "file"): void {
    this.currentMode = mode;
    this.handleClearAll();
  }

  private async handleFileSelect(file: File): Promise<void> {
    if (this.currentMode !== "file") return;

    this.fileUpload.showProgress();
    
    try {
      const promises = Array.from(this.hashCards.entries()).map(async ([algo, card]) => {
        card.setLoading(true);
        // We only attach progress callback to the heaviest/primary hash to avoid UI jitter
        const onProgress = algo === "sha256" ? (p: number) => this.fileUpload.updateProgress(p) : undefined;
        
        try {
          const hash = await HashGenerator.generateHashFromFile(algo, file, onProgress);
          card.setHash(hash);
        } catch (error) {
          card.setHash("Error computing hash");
          console.error(error);
        }
      });

      await Promise.all(promises);
      this.fileUpload.updateProgress(100);
      setTimeout(() => this.fileUpload.hideProgress(), 1000);
    } catch (e) {
      this.showToast("Error processing file", "error");
      this.fileUpload.hideProgress();
    }
  }

  private showToast(message: string, type: "success" | "error" = "success") {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = type === "error" ? "⚠️ " + message : Icons.check + " " + message;
    
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new HashGeneratorApp();
});
