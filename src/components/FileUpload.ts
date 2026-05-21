import { Icons } from "./Icons";

export class FileUpload {
  private container: HTMLDivElement;
  private dropzone!: HTMLDivElement;
  private fileInput!: HTMLInputElement;
  private fileActiveArea!: HTMLDivElement;
  private progressContainer!: HTMLDivElement;
  private progressFill!: HTMLDivElement;
  private progressText!: HTMLSpanElement;


  private onFileSelect: (file: File) => void;
  private onFileRemove: () => void;

  constructor(onFileSelect: (file: File) => void, onFileRemove: () => void) {
    this.onFileSelect = onFileSelect;
    this.onFileRemove = onFileRemove;
    this.container = document.createElement("div");
    this.container.className = "file-upload-wrapper";
    this.render();
    this.setupListeners();
  }

  private render() {
    this.container.innerHTML = `
      <div class="file-dropzone" id="dropzone">
        <div class="upload-icon">${Icons.upload}</div>
        <p>Drag & drop a file here, or click to select</p>
        <span class="sub-text">Maximum file size: 100MB</span>
        <input type="file" id="fileInput" style="display: none;" />
      </div>

      <div class="file-active" id="fileActiveArea" style="display: none;">
        <div class="file-info">
          <div style="color: var(--accent-color)">${Icons.file}</div>
          <div>
            <div class="file-name" id="fileName">filename.txt</div>
            <div class="file-size" id="fileSize">1.2 MB</div>
          </div>
        </div>
        <button class="btn-remove" id="removeFileBtn" title="Remove file">
          ${Icons.trash}
        </button>
      </div>

      <div class="progress-container" id="progressContainer" style="display: none;">
        <div class="progress-header">
          <span>Hashing File...</span>
          <span id="progressText">0%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" id="progressFill"></div>
        </div>
      </div>
    `;

    this.dropzone = this.container.querySelector("#dropzone")!;
    this.fileInput = this.container.querySelector("#fileInput")!;
    this.fileActiveArea = this.container.querySelector("#fileActiveArea")!;
    this.progressContainer = this.container.querySelector("#progressContainer")!;
    this.progressFill = this.container.querySelector("#progressFill")!;
    this.progressText = this.container.querySelector("#progressText")!;
  }

  private setupListeners() {
    this.dropzone.addEventListener("click", () => this.fileInput.click());

    this.dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.dropzone.classList.add("drag-active");
    });

    this.dropzone.addEventListener("dragleave", () => {
      this.dropzone.classList.remove("drag-active");
    });

    this.dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      this.dropzone.classList.remove("drag-active");
      if (e.dataTransfer?.files.length) {
        this.handleFile(e.dataTransfer.files[0]);
      }
    });

    this.fileInput.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files?.length) {
        this.handleFile(target.files[0]);
      }
    });

    const removeBtn = this.container.querySelector("#removeFileBtn")!;
    removeBtn.addEventListener("click", () => this.clearFile());
  }

  private handleFile(file: File) {
    if (file.size > 100 * 1024 * 1024) {
      alert("File is too large! Maximum size is 100MB.");
      return;
    }
    

    // Update UI
    this.dropzone.style.display = "none";
    this.fileActiveArea.style.display = "flex";
    
    const fileNameEl = this.container.querySelector("#fileName")!;
    const fileSizeEl = this.container.querySelector("#fileSize")!;
    
    fileNameEl.textContent = file.name;
    fileSizeEl.textContent = this.formatBytes(file.size);
    
    this.onFileSelect(file);
  }

  public clearFile() {

    this.fileInput.value = "";
    
    this.dropzone.style.display = "flex";
    this.fileActiveArea.style.display = "none";
    this.hideProgress();
    
    this.onFileRemove();
  }

  public showProgress() {
    this.progressContainer.style.display = "flex";
    this.updateProgress(0);
  }

  public updateProgress(percent: number) {
    this.progressFill.style.width = `${percent}%`;
    this.progressText.textContent = `${percent}%`;
  }

  public hideProgress() {
    this.progressContainer.style.display = "none";
    this.updateProgress(0);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  public getElement(): HTMLElement {
    return this.container;
  }
}
