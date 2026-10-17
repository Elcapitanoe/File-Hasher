import { type HashAlgorithm, HashEngine } from "../hashGenerator";
import { Icons } from "./Icons";

export class HashCard {
  private element: HTMLElement;
  private valueElement!: HTMLElement;
  private copyButton!: HTMLButtonElement;
  private currentHash = "";
  private requestVersion = 0;
  private algorithm: HashAlgorithm;

  constructor(algorithm: HashAlgorithm) {
    this.algorithm = algorithm;
    this.element = document.createElement("div");
    this.element.className = "hash-card";
    this.render();
    this.bindEvents();
  }

  private render(): void {
    const meta = HashEngine.getMetadata(this.algorithm);

    this.element.innerHTML = `
      <div class="hash-header">
        <div class="hash-meta">
          <span class="hash-name">${meta.name}</span>
          <span class="hash-description">${meta.description}</span>
        </div>
        <div class="hash-badges">
          <span class="hash-badge">${meta.outputBits}-bit</span>
          <span class="hash-badge">${meta.outputChars} hex</span>
        </div>
      </div>
      <div class="hash-value-container">
        <span class="hash-value empty" role="textbox" aria-readonly="true">Waiting for input...</span>
        <button type="button" class="icon-btn btn-copy" aria-label="Copy ${meta.name} hash" title="Copy to clipboard" disabled>
          ${Icons.copy}
        </button>
      </div>
    `;

    this.valueElement = this.element.querySelector(".hash-value")!;
    this.copyButton = this.element.querySelector(".btn-copy")!;
  }

  private bindEvents(): void {
    this.copyButton.addEventListener("click", async () => {
      if (!this.currentHash) return;

      try {
        await navigator.clipboard.writeText(this.currentHash);
        this.copyButton.innerHTML = Icons.check;
        this.copyButton.classList.add("success");

        setTimeout(() => {
          this.copyButton.innerHTML = Icons.copy;
          this.copyButton.classList.remove("success");
        }, 1500);
      } catch (err) {
        console.error("Clipboard copy failed:", err);
      }
    });
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public setLoading(): void {
    this.requestVersion += 1;
    this.currentHash = "";
    this.valueElement.className = "hash-value skeleton skeleton-text";
    this.valueElement.textContent = "";
    this.valueElement.title = "";
    this.copyButton.disabled = true;
  }

  public setHash(hash: string): void {
    this.requestVersion += 1;
    this.renderHash(hash);
  }

  public setError(message = "Error computing digest"): void {
    this.requestVersion += 1;
    this.currentHash = "";
    this.valueElement.className = "hash-value error";
    this.valueElement.textContent = message;
    this.valueElement.title = message;
    this.copyButton.disabled = true;
  }

  private renderHash(hash: string): void {
    this.currentHash = hash;
    this.valueElement.className = "hash-value";

    if (hash) {
      this.valueElement.textContent = hash;
      this.valueElement.title = hash;
      this.copyButton.disabled = false;
      return;
    }

    this.valueElement.classList.add("empty");
    this.valueElement.textContent = "Waiting for input...";
    this.valueElement.title = "";
    this.copyButton.disabled = true;
  }

  public async computeText(input: string): Promise<void> {
    if (!input) {
      this.setHash("");
      return;
    }

    this.setLoading();
    const requestVersion = this.requestVersion;

    try {
      const hash = await HashEngine.hashText(this.algorithm, input);
      if (requestVersion === this.requestVersion) this.renderHash(hash);
    } catch {
      if (requestVersion === this.requestVersion) this.setError();
    }
  }
}
