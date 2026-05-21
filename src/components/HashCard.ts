import { type HashAlgorithm, HashGenerator } from "../hashGenerator";
import { Icons } from "./Icons";

export class HashCard {
  private container: HTMLDivElement;
  private hashValueEl!: HTMLDivElement;
  private copyBtn!: HTMLButtonElement;
  private currentHash: string = "";
  private algorithm: HashAlgorithm;

  constructor(algorithm: HashAlgorithm) {
    this.algorithm = algorithm;
    this.container = document.createElement("div");
    this.container.className = "hash-card";
    this.render();
    this.setupListeners();
  }

  private render() {
    const info = HashGenerator.getAlgorithmInfo(this.algorithm);
    
    this.container.innerHTML = `
      <div class="hash-header">
        <h3 class="hash-name">${info.name}</h3>
        <span class="hash-length">${info.outputLength}</span>
      </div>
      <div class="hash-value-container">
        <div class="hash-value empty" title="Waiting for input...">Waiting for input...</div>
        <button class="icon-btn btn-copy" title="Copy to clipboard" disabled>
          ${Icons.copy}
        </button>
      </div>
    `;

    this.hashValueEl = this.container.querySelector(".hash-value")!;
    this.copyBtn = this.container.querySelector(".btn-copy")!;
  }

  private setupListeners() {
    this.copyBtn.addEventListener("click", () => {
      if (!this.currentHash) return;
      
      navigator.clipboard.writeText(this.currentHash).then(() => {
        this.copyBtn.innerHTML = Icons.check;
        this.copyBtn.classList.add("success");
        
        setTimeout(() => {
          this.copyBtn.innerHTML = Icons.copy;
          this.copyBtn.classList.remove("success");
        }, 2000);
      });
    });
  }

  public getElement(): HTMLElement {
    return this.container;
  }

  public setLoading(loading: boolean) {
    if (loading) {
      this.hashValueEl.className = "hash-value skeleton skeleton-text";
      this.hashValueEl.textContent = "";
      this.hashValueEl.title = "Computing...";
      this.copyBtn.disabled = true;
    }
  }

  public setHash(hash: string) {
    this.currentHash = hash;
    
    this.hashValueEl.className = "hash-value";
    
    if (hash) {
      this.hashValueEl.textContent = hash;
      this.hashValueEl.title = hash;
      this.copyBtn.disabled = false;
    } else {
      this.hashValueEl.classList.add("empty");
      this.hashValueEl.textContent = "Waiting for input...";
      this.hashValueEl.title = "Waiting for input...";
      this.copyBtn.disabled = true;
    }
  }

  public async updateHash(input: string): Promise<void> {
    if (!input) {
      this.setHash("");
      return;
    }
    
    this.setLoading(true);
    try {
      const hash = await HashGenerator.generateHash(this.algorithm, input);
      this.setHash(hash);
    } catch (e) {
      this.setHash("Error computing hash");
    }
  }
}
