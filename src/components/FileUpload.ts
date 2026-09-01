import { Icons } from "./Icons";

export class FileUpload {
  private element: HTMLElement;
  private dropzone!: HTMLElement;
  private fileInput!: HTMLInputElement;
  private fileActiveArea!: HTMLElement;
  private fileNameEl!: HTMLElement;
  private fileSizeEl!: HTMLElement;
  private progressContainer!: HTMLElement;
  private progressFill!: HTMLElement;
  private progressText!: HTMLElement;

  private onSelect: (file: File) => void;
  private onRemove: () => void;

  constructor(onSelect: (file: File) => void, onRemove: () => void) {
    this.onSelect = onSelect;
    this.onRemove = onRemove;
    this.element = document.createElement("div");
    this.element.className = "file-upload-wrapper";
    this.render();
    this.bindEvents();
  }

  private render(): void {
    this.element.innerHTML = `
      <div class="file-dropzone" id="dropzone" tabindex="0" role="button" aria-label="Drop file or click to select">
        <div class="upload-icon">${Icons.upload}</div>
        <p class="dropzone-title">Click or drop file here</p>
        <span class="sub-text">Large files streamed via Web Workers</span>
        <input type="file" id="fileInput" style="display: none;" />
      </div>

      <div class="file-active" id="fileActiveArea" style="display: none;">
        <div class="file-info">
          <div class="file-icon">${Icons.file}</div>
          <div class="file-meta">
            <span class="file-name" id="fileName"></span>
            <span class="file-size" id="fileSize"></span>
          </div>
        </div>
        <button type="button" class="btn-remove" id="removeFileBtn" title="Remove file" aria-label="Remove selected file">
          ${Icons.trash}
        </button>
      </div>

      <div class="progress-container" id="progressContainer" style="display: none;">
        <div class="progress-header">
          <span>Processing payload</span>
          <span id="progressText">0%</span>
        </div>
        <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div class="progress-fill" id="progressFill"></div>
        </div>
      </div>
    `;

    this.dropzone = this.element.querySelector("#dropzone")!;
    this.fileInput = this.element.querySelector("#fileInput")!;
    this.fileActiveArea = this.element.querySelector("#fileActiveArea")!;
    this.fileNameEl = this.element.querySelector("#fileName")!;
    this.fileSizeEl = this.element.querySelector("#fileSize")!;
    this.progressContainer = this.element.querySelector("#progressContainer")!;
    this.progressFill = this.element.querySelector("#progressFill")!;
    this.progressText = this.element.querySelector("#progressText")!;
  }

  private bindEvents(): void {
    this.dropzone.addEventListener("click", () => this.fileInput.click());
    this.dropzone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.fileInput.click();
      }
    });

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

    this.fileInput.addEventListener("change", () => {
      if (this.fileInput.files?.length) {
        this.handleFile(this.fileInput.files[0]);
      }
    });

    const removeBtn = this.element.querySelector("#removeFileBtn")!;
    removeBtn.addEventListener("click", () => this.clear());
  }

  private handleFile(file: File): void {
    this.dropzone.style.display = "none";
    this.fileActiveArea.style.display = "flex";
    this.fileNameEl.textContent = file.name;
    this.fileSizeEl.textContent = this.formatBytes(file.size);
    this.onSelect(file);
  }

  public clear(): void {
    this.fileInput.value = "";
    this.dropzone.style.display = "flex";
    this.fileActiveArea.style.display = "none";
    this.hideProgress();
    this.onRemove();
  }

  public showProgress(): void {
    this.progressContainer.style.display = "flex";
    this.updateProgress(0);
  }

  public updateProgress(percent: number): void {
    const clamped = Math.max(0, Math.min(100, percent));
    this.progressFill.style.width = `${clamped}%`;
    this.progressText.textContent = `${clamped}%`;
    const track = this.element.querySelector(".progress-track");
    track?.setAttribute("aria-valuenow", clamped.toString());
  }

  public hideProgress(): void {
    this.progressContainer.style.display = "none";
    this.updateProgress(0);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
