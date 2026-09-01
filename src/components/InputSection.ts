export class InputSection {
  private element: HTMLElement;
  private textArea!: HTMLTextAreaElement;
  private fileMount!: HTMLElement;
  private tabs!: NodeListOf<HTMLButtonElement>;

  private onInput: (text: string) => void;
  private onMode: (mode: "text" | "file") => void;

  constructor(
    onInput: (text: string) => void,
    onMode: (mode: "text" | "file") => void
  ) {
    this.onInput = onInput;
    this.onMode = onMode;
    this.element = document.createElement("div");
    this.element.className = "input-section";
    this.render();
    this.bindEvents();
  }

  private render(): void {
    this.element.innerHTML = `
      <div class="tabs" role="tablist">
        <button type="button" class="tab active" role="tab" aria-selected="true" data-mode="text">Text Input</button>
        <button type="button" class="tab" role="tab" aria-selected="false" data-mode="file">File Input</button>
      </div>
      
      <div class="input-container" id="textInputWrapper">
        <textarea 
          class="text-area" 
          placeholder="Enter plain text or payload (Ctrl+K to focus)..."
          spellcheck="false"
          aria-label="Input payload"
        ></textarea>
      </div>

      <div id="fileMount" class="file-mount" style="display: none;"></div>
    `;

    this.textArea = this.element.querySelector("textarea")!;
    this.fileMount = this.element.querySelector("#fileMount")!;
    this.tabs = this.element.querySelectorAll<HTMLButtonElement>(".tab");
  }

  private bindEvents(): void {
    this.textArea.addEventListener("input", () => {
      this.onInput(this.textArea.value);
    });

    this.tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const mode = tab.dataset.mode as "text" | "file";

        this.tabs.forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");

        const textWrapper = this.element.querySelector<HTMLElement>("#textInputWrapper")!;
        if (mode === "text") {
          textWrapper.style.display = "block";
          this.fileMount.style.display = "none";
          this.onInput(this.textArea.value);
        } else {
          textWrapper.style.display = "none";
          this.fileMount.style.display = "block";
        }

        this.onMode(mode);
      });
    });
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public getFileMount(): HTMLElement {
    return this.fileMount;
  }

  public focus(): void {
    const isTextActive = this.element.querySelector('.tab[data-mode="text"]')?.classList.contains("active");
    if (isTextActive) {
      this.textArea.focus();
    }
  }

  public clearText(): void {
    this.textArea.value = "";
    this.onInput("");
  }
}
