import { HashGenerator, type HashAlgorithm } from '../hashGenerator';

export class HashCard {
  private element: HTMLElement;
  private algorithm: HashAlgorithm;

  constructor(algorithm: HashAlgorithm) {
    this.algorithm = algorithm;
    this.element = this.createElement();
  }

  private createElement(): HTMLElement {
    const info = HashGenerator.getAlgorithmInfo(this.algorithm);
    
    const card = document.createElement('div');
    card.className = 'hash-card';
    card.innerHTML = `
      <div class="hash-card-header">
        <h3 class="hash-algorithm-name">${info.name}</h3>
        <div class="hash-info">
          <span class="hash-output-length">${info.outputLength}</span>
        </div>
      </div>
      <div class="hash-description">${info.description}</div>
      <div class="hash-result-container">
        <div class="hash-result" data-algorithm="${this.algorithm}">
          <span class="hash-placeholder">Hash will appear here...</span>
        </div>
        <button class="copy-button" title="Copy to clipboard">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
      <div class="hash-loading">
        <div class="loading-spinner"></div>
        <span>Generating hash...</span>
      </div>
    `;

    this.setupEventListeners(card);
    return card;
  }

  private setupEventListeners(card: HTMLElement): void {
    const copyButton = card.querySelector('.copy-button') as HTMLButtonElement;
    const resultElement = card.querySelector('.hash-result') as HTMLElement;

    copyButton.addEventListener('click', async () => {
      const hashText = resultElement.textContent;
      if (hashText && hashText !== 'Hash will appear here...') {
        try {
          await navigator.clipboard.writeText(hashText);
          this.showCopyFeedback(copyButton);
        } catch (error) {
          console.error('Failed to copy:', error);
        }
      }
    });
  }

  private showCopyFeedback(button: HTMLButtonElement): void {
    const originalHTML = button.innerHTML;
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20,6 9,17 4,12"></polyline>
      </svg>
    `;
    button.classList.add('copied');
    
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.classList.remove('copied');
    }, 2000);
  }

  async updateHash(input: string): Promise<void> {
    const resultElement = this.element.querySelector('.hash-result') as HTMLElement;
    const loadingElement = this.element.querySelector('.hash-loading') as HTMLElement;
    const copyButton = this.element.querySelector('.copy-button') as HTMLButtonElement;

    if (!input.trim()) {
      resultElement.innerHTML = '<span class="hash-placeholder">Hash will appear here...</span>';
      copyButton.disabled = true;
      return;
    }

    this.isGenerating = true;
    loadingElement.style.display = 'flex';
    copyButton.disabled = true;

    try {
      const hash = await HashGenerator.generateHash(this.algorithm, input);
      resultElement.textContent = hash;
      copyButton.disabled = false;
    } catch (error) {
      resultElement.innerHTML = `<span class="hash-error">Error: ${error}</span>`;
    } finally {
      loadingElement.style.display = 'none';
    }
  }

  async updateHashFromFile(fileContent: ArrayBuffer): Promise<void> {
    const resultElement = this.element.querySelector('.hash-result') as HTMLElement;
    const loadingElement = this.element.querySelector('.hash-loading') as HTMLElement;
    const copyButton = this.element.querySelector('.copy-button') as HTMLButtonElement;

    if (!fileContent || fileContent.byteLength === 0) {
      resultElement.innerHTML = '<span class="hash-placeholder">Hash will appear here...</span>';
      copyButton.disabled = true;
      return;
    }

    loadingElement.style.display = 'flex';
    copyButton.disabled = true;

    try {
      const hash = await HashGenerator.generateHashFromFile(this.algorithm, fileContent);
      resultElement.textContent = hash;
      copyButton.disabled = false;
    } catch (error) {
      resultElement.innerHTML = `<span class="hash-error">Error: ${error}</span>`;
    } finally {
      loadingElement.style.display = 'none';
    }
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getAlgorithm(): HashAlgorithm {
    return this.algorithm;
  }
}