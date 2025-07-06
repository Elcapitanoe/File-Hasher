import type { UploadState } from '../types';
import { getElementById } from '../utils/dom';
import { validateFileOrThrow } from '../utils/validation';
import { FileProcessor } from '../services/file-processor';
import { UIManager } from './ui-manager';
import { CopyButtonManager } from './copy-button-manager';

export class FileHandler {
  private readonly uploadState: UploadState = {
    isProcessing: false,
    currentFile: null
  };

  private readonly fileProcessor = new FileProcessor();
  private readonly uiManager = new UIManager();
  private readonly copyButtonManager = new CopyButtonManager();

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.setupFileInput();
    this.setupBrowseButton();
    this.setupDragAndDrop();
    this.setupUploadButton();
  }

  private setupFileInput(): void {
    const fileInput = getElementById<HTMLInputElement>('file');
    if (!fileInput) {
      console.error('File input not found');
      return;
    }

    // Configure file input to be hidden but functional
    this.configureFileInput(fileInput);

    // Handle file selection changes
    fileInput.addEventListener('change', () => {
      console.log('File input changed:', fileInput.files);
      this.handleFileSelection();
    });
  }

  private setupBrowseButton(): void {
    const browseButton = getElementById<HTMLButtonElement>('browse-button');
    const fileInput = getElementById<HTMLInputElement>('file');
    
    if (!browseButton || !fileInput) {
      console.error('Browse button or file input not found');
      return;
    }

    console.log('Setting up browse button...');

    browseButton.addEventListener('click', (e) => {
      console.log('Browse button clicked');
      e.preventDefault();
      e.stopPropagation();
      
      if (!this.uploadState.isProcessing) {
        console.log('Triggering file input click');
        fileInput.click();
      }
    });
  }

  private setupDragAndDrop(): void {
    const dropZone = getElementById('drop-zone');
    const fileInput = getElementById<HTMLInputElement>('file');
    
    if (!dropZone || !fileInput) {
      console.error('Required elements not found for drag and drop setup');
      return;
    }

    // Click handler for drop zone (but exclude browse button area)
    dropZone.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      // Don't trigger file input if clicking on browse button or its children
      if (target.closest('#browse-button') || target.closest('.browse-alternative')) {
        console.log('Click on browse area, ignoring drop zone click');
        return;
      }
      
      console.log('Drop zone clicked, triggering file input');
      e.preventDefault();
      e.stopPropagation();
      
      if (!this.uploadState.isProcessing) {
        fileInput.click();
      }
    });

    // Drag and drop event handlers
    this.setupDragEvents(dropZone);
    this.setupDropHandler(dropZone, fileInput);
  }

  private configureFileInput(fileInput: HTMLInputElement): void {
    // Ensure the file input is properly hidden but still functional
    fileInput.style.position = 'absolute';
    fileInput.style.left = '-9999px';
    fileInput.style.opacity = '0';
    fileInput.style.pointerEvents = 'none';
    fileInput.style.width = '1px';
    fileInput.style.height = '1px';
  }

  private setupDragEvents(dropZone: HTMLElement): void {
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, this.preventDefaults, false);
      document.body.addEventListener(eventName, this.preventDefaults, false);
    });

    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, () => {
        if (!this.uploadState.isProcessing) {
          dropZone.classList.add('drop-zone--over');
        }
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, () => {
        dropZone.classList.remove('drop-zone--over');
      }, false);
    });
  }

  private setupDropHandler(dropZone: HTMLElement, fileInput: HTMLInputElement): void {
    dropZone.addEventListener('drop', (e) => {
      if (this.uploadState.isProcessing) return;
      
      const files = e.dataTransfer?.files;
      if (!files) return;

      if (files.length > 1) {
        this.uiManager.showError('Please select only one file at a time');
        return;
      }

      if (files.length === 1) {
        // Create a new FileList-like object
        const dataTransfer = new DataTransfer();
        files[0] && dataTransfer.items.add(files[0]);
        fileInput.files = dataTransfer.files;
        this.handleFileSelection();
      }
    }, false);
  }

  private preventDefaults(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
  }

  private setupUploadButton(): void {
    const uploadButton = getElementById<HTMLButtonElement>('upload-button');
    if (!uploadButton) return;

    uploadButton.addEventListener('click', (event) => {
      event.preventDefault();
      
      if (this.uploadState.isProcessing) {
        return;
      }

      const fileInput = getElementById<HTMLInputElement>('file');
      const file = fileInput?.files?.[0];
      
      if (!file) {
        this.uiManager.showFileSelectionError();
        return;
      }

      void this.processFile(file);
    });
  }

  private handleFileSelection(): void {
    const fileInput = getElementById<HTMLInputElement>('file');
    const file = fileInput?.files?.[0];
    
    console.log('Handling file selection:', file?.name);
    
    if (!file) {
      this.uiManager.resetDropZone();
      return;
    }

    try {
      validateFileOrThrow(file, {
        maxSize: 50 * 1024 * 1024 // 50MB
      });

      this.uploadState.currentFile = file;
      this.uiManager.updateDropZoneWithFile(file);
      this.uiManager.updateUploadButton('ready');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'File validation failed';
      this.uiManager.showError(message);
      this.uiManager.resetDropZone();
    }
  }

  private async processFile(file: File): Promise<void> {
    if (this.uploadState.isProcessing) return;

    try {
      this.uploadState.isProcessing = true;
      
      this.uiManager.showResultSection();
      this.uiManager.updateUploadButton('processing');
      this.uiManager.initializeProgress();

      const startTime = performance.now();
      
      // Show processing status
      this.uiManager.showStatus('<i class="bi bi-arrow-repeat spin"></i> Reading file...', 'info');
      
      // Process file and generate hashes
      this.uiManager.showStatus('<i class="bi bi-arrow-repeat spin"></i> Generating hashes...', 'info');
      const result = await this.fileProcessor.processFile(file);
      
      const totalTime = (performance.now() - startTime) / 1000;
      
      this.uiManager.displayResults(result, totalTime);
      this.copyButtonManager.setupCopyButtons();
      
    } catch (error) {
      console.error('Processing error:', error);
      const message = error instanceof Error ? error.message : 'Processing failed';
      this.uiManager.showStatus(`<i class="bi bi-exclamation-triangle"></i> ${message}`, 'error');
    } finally {
      this.uploadState.isProcessing = false;
      this.uiManager.updateUploadButton('ready');
    }
  }
}