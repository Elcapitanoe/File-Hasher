import "./style.css";
import { type HashAlgorithm } from "./hashGenerator";
import { HashCard } from "./components/HashCard";
import { InputSection } from "./components/InputSection";
import { FileUpload } from "./components/FileUpload";
import { ThemeManager } from "./components/ThemeManager";
import { AboutPage } from "./pages/AboutPage";
import { PrivacyPage } from "./pages/PrivacyPage";

class HashGeneratorApp {
  private hashCards: Map<HashAlgorithm, HashCard> = new Map();
  private inputSection!: InputSection;
  private fileUpload!: FileUpload;
  private themeManager!: ThemeManager;
  private aboutPage!: AboutPage;
  private privacyPage!: PrivacyPage;
  private debounceTimer: number | null = null;
  private currentMode: "text" | "file" = "text";

  constructor() {
    this.initializeApp();
  }

  private initializeApp(): void {
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
      <div class="app-container">
        <header class="app-header">
          <div class="header-content">
            <div class="logo-section">
              <div class="logo-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div class="logo-text">
                <h1>File Hasher</h1>
                <p>Simple Hash Generator</p>
              </div>
            </div>
            <div class="header-controls">
              <div class="theme-selector-container"></div>
            </div>
          </div>
        </header>

        <main class="app-main">
          <div class="input-section-container"></div>
          <div class="hash-grid-container">
            <div class="section-header">
              <h2>Hash Results</h2>
              <p>Generate secure hashes using industry-standard algorithms</p>
            </div>
            <div class="hash-grid"></div>
          </div>
        </main>

        <footer class="app-footer">
          <div class="footer-content">
            <div class="footer-info">
              <p>&copy; 2025 File Hasher by <a href="https://github.com/Elcapitanoe" target="_blank" rel="noopener noreferrer" class="author-link">Elcapitanoe</a></p>
              <p class="footer-note">All hashing is performed locally in your browser for maximum security.</p>
            </div>
            <div class="footer-links">
              <a href="#" class="footer-link" id="aboutLink">About</a>
              <a href="#" class="footer-link" id="privacyLink">Privacy</a>
              <a href="https://github.com/Elcapitanoe/File-Hasher" target="_blank" rel="noopener noreferrer" class="footer-link">GitHub</a>
            </div>
          </div>
        </footer>
      </div>
    `;

    this.setupThemeManager();
    this.setupPages();
    this.setupInputSection();
    this.setupHashCards();
    this.setupKeyboardShortcuts();
  }

  private setupThemeManager(): void {
    const container = document.querySelector(
      ".theme-selector-container",
    ) as HTMLElement;
    this.themeManager = new ThemeManager();
    container.appendChild(this.themeManager.getElement());
  }

  private setupPages(): void {
    this.aboutPage = new AboutPage();
    this.privacyPage = new PrivacyPage();

    const aboutLink = document.querySelector("#aboutLink") as HTMLAnchorElement;
    const privacyLink = document.querySelector("#privacyLink") as HTMLAnchorElement;

    aboutLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.aboutPage.show();
    });

    privacyLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.privacyPage.show();
    });
  }

  private setupInputSection(): void {
    const container = document.querySelector(
      ".input-section-container",
    ) as HTMLElement;

    this.inputSection = new InputSection(
      (value: string) => this.handleInputChange(value),
      () => this.handleClearAll(),
      (mode: "text" | "file") => this.handleModeChange(mode),
    );

    container.appendChild(this.inputSection.getElement());

    this.fileUpload = new FileUpload((file: File) =>
      this.handleFileSelect(file),
    );
    const fileContainer = this.inputSection.getFileContainer();
    fileContainer.appendChild(this.fileUpload.getElement());
  }

  private setupHashCards(): void {
    const grid = document.querySelector(".hash-grid") as HTMLElement;
    const algorithms: HashAlgorithm[] = [
      "md5",
      "sha1",
      "sha256",
      "sha512",
      "sha3-256",
      "sha3-512",
    ];

    algorithms.forEach((algorithm) => {
      const card = new HashCard(algorithm);
      this.hashCards.set(algorithm, card);
      grid.appendChild(card.getElement());
    });
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        this.inputSection.focus();
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "l") {
        event.preventDefault();
        this.handleClearAll();
      }
    });
  }

  private handleInputChange(value: string): void {
    if (this.currentMode !== "text") return;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = window.setTimeout(() => {
      this.updateAllHashes(value);
    }, 300);
  }

  private handleClearAll(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.updateAllHashes("");
  }

  private handleModeChange(mode: "text" | "file"): void {
    this.currentMode = mode;
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.updateAllHashes("");
  }

  private async handleFileSelect(file: File): Promise<void> {
    if (this.currentMode !== "file") return;

    try {
      const fileContent = await this.readFileAsArrayBuffer(file);
      await this.updateAllHashesFromFile(fileContent);
    } catch (error) {
      console.error("Error reading file:", error);
      this.showErrorMessage("Error reading file. Please try again.");
    }
  }

  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  private async updateAllHashes(input: string): Promise<void> {
    if (this.currentMode !== "text") return;

    const promises = Array.from(this.hashCards.values()).map((card) =>
      card.updateHash(input),
    );

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error("Error updating hashes:", error);
    }
  }

  private async updateAllHashesFromFile(
    fileContent: ArrayBuffer,
  ): Promise<void> {
    if (this.currentMode !== "file") return;

    const promises = Array.from(this.hashCards.values()).map((card) =>
      card.updateHashFromFile(fileContent),
    );

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error("Error updating hashes from file:", error);
    }
  }

  private showErrorMessage(message: string): void {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-toast";
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new HashGeneratorApp();
});
