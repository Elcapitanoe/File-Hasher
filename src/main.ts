import "./style.css";
import { type HashAlgorithm, HashEngine } from "./hashGenerator";
import { HashCard } from "./components/HashCard";
import { InputSection } from "./components/InputSection";
import { FileUpload } from "./components/FileUpload";
import { ThemeManager } from "./components/ThemeManager";
import { Icons } from "./components/Icons";

const ALGORITHMS: HashAlgorithm[] = [
  "md5",
  "sha1",
  "sha256",
  "sha512",
  "sha3-256",
  "sha3-512",
];

class HashApp {
  private hashCards = new Map<HashAlgorithm, HashCard>();
  private inputSection!: InputSection;
  private fileUpload!: FileUpload;
  private debounceTimer: number | null = null;
  private fileOperationId = 0;
  private mode: "text" | "file" = "text";

  constructor() {
    this.init();
  }

  private init(): void {
    const root = document.querySelector<HTMLDivElement>("#app");
    if (!root) return;

    root.innerHTML = `
      <div class="app-layout">
        <header class="app-header">
          <div class="brand">
            <span class="brand-icon">${Icons.shield}</span>
            <div class="brand-info">
              <h1 class="brand-title">File Hasher</h1>
              <span class="brand-subtitle">Cryptographic Digest Generator</span>
            </div>
          </div>
          <div id="themeMount"></div>
        </header>

        <main class="main-content">
          <section id="inputMount"></section>
          
          <section class="hash-section">
            <div class="section-header">
              <h2 class="section-title">Cryptographic Digests</h2>
            </div>
            <div class="hash-grid" id="hashGrid"></div>
          </section>
        </main>

        <footer class="app-footer">
          <p class="footer-note">Local file and text hashing in a background worker.</p>
          <div class="footer-links">
            <a href="https://github.com/Elcapitanoe/File-Hasher" target="_blank" rel="noopener noreferrer" class="footer-link">Source Repository</a>
          </div>
        </footer>
      </div>
    `;

    this.mount();
    this.bindShortcuts();
  }

  private mount(): void {
    const themeManager = new ThemeManager();
    document.getElementById("themeMount")?.appendChild(themeManager.getElement());

    this.inputSection = new InputSection(
      (val) => this.handleTextInput(val),
      (mode) => this.handleModeChange(mode)
    );
    document.getElementById("inputMount")?.appendChild(this.inputSection.getElement());

    this.fileUpload = new FileUpload(
      (file) => this.handleFile(file),
      () => this.handleClear()
    );
    this.inputSection.getFileMount().appendChild(this.fileUpload.getElement());

    const grid = document.getElementById("hashGrid");
    ALGORITHMS.forEach((algo) => {
      const card = new HashCard(algo);
      this.hashCards.set(algo, card);
      grid?.appendChild(card.getElement());
    });
  }

  private bindShortcuts(): void {
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (this.mode === "text") {
          this.inputSection.focus();
        }
      }
    });
  }

  private handleTextInput(value: string): void {
    if (this.mode !== "text") return;

    if (this.debounceTimer !== null) {
      window.clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    HashEngine.cancelPendingTasks();

    if (!value) {
      this.handleClear();
      return;
    }

    this.hashCards.forEach((card) => card.setLoading());
    this.debounceTimer = window.setTimeout(() => {
      this.hashCards.forEach((card) => card.computeText(value));
    }, 200);
  }

  private handleClear(): void {
    this.fileOperationId += 1;
    HashEngine.cancelPendingTasks();
    if (this.debounceTimer !== null) {
      window.clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.hashCards.forEach((card) => card.setHash(""));
  }

  private handleModeChange(newMode: "text" | "file"): void {
    this.mode = newMode;

    if (newMode === "text") {
      this.fileUpload.clear();
      return;
    }

    this.handleClear();
  }

  private async handleFile(file: File): Promise<void> {
    if (this.mode !== "file") return;

    const operationId = ++this.fileOperationId;
    HashEngine.cancelPendingTasks();
    this.fileUpload.showProgress();

    const tasks = Array.from(this.hashCards.entries()).map(async ([algo, card]) => {
      card.setLoading();
      const onProgress = algo === "sha256"
        ? (progress: number) => {
            if (operationId === this.fileOperationId) {
              this.fileUpload.updateProgress(progress);
            }
          }
        : undefined;

      try {
        const hash = await HashEngine.hashFile(algo, file, onProgress);
        if (operationId === this.fileOperationId) card.setHash(hash);
      } catch (error) {
        if (operationId === this.fileOperationId) card.setError();
        console.error(`Hashing failed for ${algo}:`, error);
      }
    });

    await Promise.all(tasks);
    if (operationId !== this.fileOperationId) return;

    this.fileUpload.updateProgress(100);
    window.setTimeout(() => {
      if (operationId === this.fileOperationId) this.fileUpload.hideProgress();
    }, 800);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new HashApp();
});
