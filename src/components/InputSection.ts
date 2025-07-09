export class InputSection {
  private element: HTMLElement;
  private onInputChange: (value: string) => void;
  private onClearAll: () => void;
  private onModeChange: (mode: 'text' | 'file') => void;
  private currentMode: 'text' | 'file' = 'text';

  constructor(onInputChange: (value: string) => void, onClearAll: () => void, onModeChange: (mode: 'text' | 'file') => void) {
    this.onInputChange = onInputChange;
    this.onClearAll = onClearAll;
    this.onModeChange = onModeChange;
    this.element = this.createElement();
  }

  private createElement(): HTMLElement {
    const section = document.createElement('div');
    section.className = 'input-section';
    section.innerHTML = `
      <div class="input-header">
        <div class="input-title-section">
          <h2>Input to Hash</h2>
          <div class="input-mode-toggle">
            <button class="mode-btn active" data-mode="text">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              Text
            </button>
            <button class="mode-btn" data-mode="file">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <path d="M12 18v-6"></path>
                <path d="M9 15l3-3 3 3"></path>
              </svg>
              File
            </button>
          </div>
        </div>
        <div class="input-actions">
          <button class="clear-button" title="Clear all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            Clear
          </button>
        </div>
      </div>
      <div class="input-container text-input-container">
        <textarea 
          class="hash-input" 
          placeholder="Type or paste your text here..."
          rows="4"
        ></textarea>
        <div class="input-info">
          <span class="character-count">0 characters</span>
          <div class="input-examples">
            <span>Try: </span>
            <button class="example-btn" data-example="Hello World">Hello World</button>
            <button class="example-btn" data-example="The quick brown fox jumps over the lazy dog">Lorem text</button>
            <button class="example-btn" data-example="2025">2025</button>
          </div>
        </div>
      </div>
      <div class="file-input-container" style="display: none;">
        <!-- File upload component will be inserted here -->
      </div>
    `;

    this.setupEventListeners(section);
    return section;
  }

  private setupEventListeners(section: HTMLElement): void {
    const textarea = section.querySelector('.hash-input') as HTMLTextAreaElement;
    const clearButton = section.querySelector('.clear-button') as HTMLButtonElement;
    const characterCount = section.querySelector('.character-count') as HTMLElement;
    const exampleButtons = section.querySelectorAll('.example-btn') as NodeListOf<HTMLButtonElement>;
    const modeButtons = section.querySelectorAll('.mode-btn') as NodeListOf<HTMLButtonElement>;

    // Input change handler
    textarea.addEventListener('input', () => {
      const value = textarea.value;
      this.updateCharacterCount(characterCount, value.length);
      this.onInputChange(value);
    });

    // Clear button handler
    clearButton.addEventListener('click', () => {
      textarea.value = '';
      this.updateCharacterCount(characterCount, 0);
      this.onClearAll();
      textarea.focus();
    });

    // Example buttons
    exampleButtons.forEach(button => {
      button.addEventListener('click', () => {
        const example = button.dataset.example || '';
        textarea.value = example;
        this.updateCharacterCount(characterCount, example.length);
        this.onInputChange(example);
        textarea.focus();
      });
    });

    // Auto-resize textarea
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    });

    // Mode toggle handlers
    modeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const mode = button.dataset.mode as 'text' | 'file';
        this.switchMode(mode);
      });
    });
  }

  private switchMode(mode: 'text' | 'file'): void {
    if (this.currentMode === mode) return;

    this.currentMode = mode;
    const textContainer = this.element.querySelector('.text-input-container') as HTMLElement;
    const fileContainer = this.element.querySelector('.file-input-container') as HTMLElement;
    const modeButtons = this.element.querySelectorAll('.mode-btn') as NodeListOf<HTMLButtonElement>;

    // Update button states
    modeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Show/hide containers
    if (mode === 'text') {
      textContainer.style.display = 'block';
      fileContainer.style.display = 'none';
    } else {
      textContainer.style.display = 'none';
      fileContainer.style.display = 'block';
    }

    this.onModeChange(mode);
  }

  private updateCharacterCount(element: HTMLElement, count: number): void {
    element.textContent = `${count} character${count !== 1 ? 's' : ''}`;
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getValue(): string {
    const textarea = this.element.querySelector('.hash-input') as HTMLTextAreaElement;
    return textarea.value;
  }

  setValue(value: string): void {
    const textarea = this.element.querySelector('.hash-input') as HTMLTextAreaElement;
    const characterCount = this.element.querySelector('.character-count') as HTMLElement;
    textarea.value = value;
    this.updateCharacterCount(characterCount, value.length);
  }

  focus(): void {
    const textarea = this.element.querySelector('.hash-input') as HTMLTextAreaElement;
    textarea.focus();
  }

  getCurrentMode(): 'text' | 'file' {
    return this.currentMode;
  }

  getFileContainer(): HTMLElement {
    return this.element.querySelector('.file-input-container') as HTMLElement;
  }
}