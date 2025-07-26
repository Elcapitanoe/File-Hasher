export class FileUpload {
  private element: HTMLElement;
  private onFileSelect: (file: File) => void;
  private selectedFile: File | null = null;

  constructor(onFileSelect: (file: File) => void) {
    this.onFileSelect = onFileSelect;
    this.element = this.createElement();
  }

  private createElement(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'file-upload-section';
    container.innerHTML = `
      <div class="file-upload-header">
        <h3>Upload File to Hash</h3>
        <p>Select a file to generate its hash values</p>
      </div>
      <div class="file-upload-area" id="fileDropArea">
        <input type="file" id="fileInput" class="file-input" accept="*/*">
        <div class="file-upload-content">
          <div class="file-upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
          </div>
          <div class="file-upload-text">
            <p class="file-upload-primary">Click to select a file or drag and drop</p>
            <p class="file-upload-secondary">Any file type supported • Max 100MB</p>
          </div>
        </div>
        <div class="file-selected-info" style="display: none;">
          <div class="file-info">
            <div class="file-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
              </svg>
            </div>
            <div class="file-details">
              <div class="file-name"></div>
              <div class="file-size"></div>
            </div>
          </div>
          <button class="remove-file-btn" title="Remove file">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    `;

    this.setupEventListeners(container);
    return container;
  }

  private setupEventListeners(container: HTMLElement): void {
    const fileInput = container.querySelector('#fileInput') as HTMLInputElement;
    const dropArea = container.querySelector('#fileDropArea') as HTMLElement;
    const removeBtn = container.querySelector('.remove-file-btn') as HTMLButtonElement;

    fileInput.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        this.handleFileSelect(file);
      }
    });

    dropArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropArea.classList.add('drag-over');
    });

    dropArea.addEventListener('dragleave', (e) => {
      e.preventDefault();
      if (!dropArea.contains(e.relatedTarget as Node)) {
        dropArea.classList.remove('drag-over');
      }
    });

    dropArea.addEventListener('drop', (e) => {
      e.preventDefault();
      dropArea.classList.remove('drag-over');
      
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        this.handleFileSelect(files[0]);
      }
    });

    dropArea.addEventListener('click', (e) => {
      if (e.target === removeBtn || removeBtn.contains(e.target as Node)) {
        return;
      }
      fileInput.click();
    });

    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.clearFile();
    });
  }

  private handleFileSelect(file: File): void {
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      this.showError('File size exceeds 100MB limit. Please select a smaller file.');
      return;
    }

    this.selectedFile = file;
    this.showFileInfo(file);
    this.onFileSelect(file);
  }

  private showFileInfo(file: File): void {
    const uploadContent = this.element.querySelector('.file-upload-content') as HTMLElement;
    const selectedInfo = this.element.querySelector('.file-selected-info') as HTMLElement;
    const fileName = this.element.querySelector('.file-name') as HTMLElement;
    const fileSize = this.element.querySelector('.file-size') as HTMLElement;

    uploadContent.style.display = 'none';
    selectedInfo.style.display = 'flex';

    fileName.textContent = file.name;
    fileSize.textContent = this.formatFileSize(file.size);
  }

  private clearFile(): void {
    const uploadContent = this.element.querySelector('.file-upload-content') as HTMLElement;
    const selectedInfo = this.element.querySelector('.file-selected-info') as HTMLElement;
    const fileInput = this.element.querySelector('#fileInput') as HTMLInputElement;

    uploadContent.style.display = 'flex';
    selectedInfo.style.display = 'none';
    fileInput.value = '';
    this.selectedFile = null;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private showError(message: string): void {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-toast';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getSelectedFile(): File | null {
    return this.selectedFile;
  }
}