export class InputSection {
  private container: HTMLDivElement;
  private textArea!: HTMLTextAreaElement;
  private fileContainer!: HTMLDivElement;
  private tabs!: NodeListOf<Element>;

  private onInputChange: (value: string) => void;
  private onModeChange: (mode: "text" | "file") => void;

  constructor(
    onInputChange: (value: string) => void,
    onModeChange: (mode: "text" | "file") => void,
  ) {
    this.onInputChange = onInputChange;
    this.onModeChange = onModeChange;
    this.container = document.createElement("div");
    this.container.className = "input-section";
    this.render();
    this.setupListeners();
  }

  private render() {
    this.container.innerHTML = `
      <div class="tabs">
        <button class="tab active" data-mode="text">Text Input</button>
        <button class="tab" data-mode="file">File Upload</button>
      </div>
      
      <div class="input-container" id="textInputContainer">
        <textarea 
          class="text-area" 
          placeholder="Enter text to hash... (Press Ctrl+K to focus)"
          spellcheck="false"
        ></textarea>
      </div>

      <div id="fileInputContainer" style="display: none;">
        <!-- FileUpload component will be mounted here -->
      </div>
    `;

    this.textArea = this.container.querySelector("textarea")!;
    this.fileContainer = this.container.querySelector("#fileInputContainer")!;
    this.tabs = this.container.querySelectorAll(".tab");
  }

  private setupListeners() {
    this.textArea.addEventListener("input", (e) => {
      const target = e.target as HTMLTextAreaElement;
      this.onInputChange(target.value);
    });

    this.tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const target = e.target as HTMLButtonElement;
        const mode = target.dataset.mode as "text" | "file";
        
        // Update tabs active state
        this.tabs.forEach(t => t.classList.remove("active"));
        target.classList.add("active");

        // Toggle visibility
        if (mode === "text") {
          (this.container.querySelector("#textInputContainer") as HTMLElement).style.display = "block";
          this.fileContainer.style.display = "none";
          // Trigger input change for current text value
          this.onInputChange(this.textArea.value);
        } else {
          (this.container.querySelector("#textInputContainer") as HTMLElement).style.display = "none";
          this.fileContainer.style.display = "block";
        }

        this.onModeChange(mode);
      });
    });
  }

  public getElement(): HTMLElement {
    return this.container;
  }

  public getFileContainer(): HTMLElement {
    return this.fileContainer;
  }

  public focus() {
    // Only focus if we are in text mode
    const textModeActive = this.container.querySelector('.tab[data-mode="text"]')?.classList.contains('active');
    if (textModeActive) {
      this.textArea.focus();
    }
  }

  public clearText() {
    this.textArea.value = "";
    this.onInputChange("");
  }
}
