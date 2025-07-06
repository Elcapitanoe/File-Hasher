import type { StatusType, ButtonState, ButtonConfig, HashResult, ProcessingStats } from '../types';
import { getElementById, escapeHtml, addAnimationClass } from '../utils/dom';
import { formatBytes, formatTime } from '../utils/formatters';
import { generateUUID } from '../utils/crypto';
import { getFileIcon } from '../utils/file-icons';

export class UIManager {
  private static readonly BUTTON_CONFIGS: Record<ButtonState, ButtonConfig> = {
    initial: {
      text: '<i class="bi bi-upload"></i> Select File to Process',
      disabled: true,
      className: 'btn-secondary'
    },
    ready: {
      text: '<i class="bi bi-upload"></i> Process File',
      disabled: false,
      className: 'btn-primary'
    },
    processing: {
      text: '<i class="bi bi-arrow-repeat spin"></i> Processing...',
      disabled: true,
      className: 'btn-warning'
    }
  };

  private static readonly STATUS_CLASSES: Record<StatusType, string> = {
    info: 'text-info',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-danger'
  };

  public updateDropZoneWithFile(file: File): void {
    const dropZone = getElementById('drop-zone');
    const dropZonePrompt = dropZone?.querySelector('.drop-zone-prompt') as HTMLElement;
    
    if (!dropZone || !dropZonePrompt) return;

    // Remove existing file info
    const existingFileInfo = dropZone.querySelector('.drop-zone-file');
    existingFileInfo?.remove();

    // Create and add new file info
    const fileInfo = this.createFileInfoElement(file);
    dropZone.appendChild(fileInfo);
    dropZonePrompt.style.display = 'none';
  }

  public resetDropZone(): void {
    const dropZone = getElementById('drop-zone');
    const dropZonePrompt = dropZone?.querySelector('.drop-zone-prompt') as HTMLElement;
    const existingFileInfo = dropZone?.querySelector('.drop-zone-file');
    
    existingFileInfo?.remove();
    
    if (dropZonePrompt) {
      dropZonePrompt.style.display = 'flex';
    }
    
    this.updateUploadButton('initial');
  }

  public updateUploadButton(state: ButtonState): void {
    const uploadButton = getElementById<HTMLButtonElement>('upload-button');
    if (!uploadButton) return;

    const config = UIManager.BUTTON_CONFIGS[state];
    
    uploadButton.innerHTML = config.text;
    uploadButton.disabled = config.disabled;
    uploadButton.className = `btn btn-lg ${config.className} w-100`;
  }

  public showResultSection(): void {
    const resultSection = getElementById('result');
    if (!resultSection) return;

    resultSection.style.display = 'block';
    resultSection.classList.add('animate__animated', 'animate__fadeIn');
  }

  public initializeProgress(): void {
    const progressBar = getElementById<HTMLElement>('progressBar');
    const progressPercentage = getElementById('progress-percentage');
    
    if (progressBar) progressBar.style.width = '0%';
    if (progressPercentage) progressPercentage.textContent = '0%';
    
    this.showStatus('<i class="bi bi-arrow-repeat spin"></i> Starting processing...', 'info');
  }

  public completeProgress(): void {
    const progressBar = getElementById<HTMLElement>('progressBar');
    const progressPercentage = getElementById('progress-percentage');
    
    if (progressBar) progressBar.style.width = '100%';
    if (progressPercentage) progressPercentage.textContent = '100%';
  }

  public showStatus(message: string, type: StatusType = 'info'): void {
    const statusElement = getElementById('status');
    if (!statusElement) return;

    const className = UIManager.STATUS_CLASSES[type];
    statusElement.innerHTML = message;
    statusElement.className = `text-center status-text ${className}`;
  }

  public showError(message: string): void {
    this.showStatus(`<i class="bi bi-exclamation-triangle"></i> ${message}`, 'error');
    
    // Add shake animation to drop zone
    const dropZone = getElementById('drop-zone');
    if (dropZone) {
      addAnimationClass(dropZone, 'animate__shakeX');
    }
  }

  public showFileSelectionError(): void {
    const uploadButton = getElementById('upload-button');
    const dropZone = getElementById('drop-zone');
    
    // Shake animation for button
    if (uploadButton) {
      addAnimationClass(uploadButton, 'animate__shakeX');
    }
    
    // Highlight drop zone with error styling
    if (dropZone) {
      dropZone.style.borderColor = '#dc3545';
      dropZone.style.backgroundColor = 'rgba(220, 53, 69, 0.05)';
      
      setTimeout(() => {
        dropZone.style.borderColor = '';
        dropZone.style.backgroundColor = '';
      }, 1500);
    }
    
    this.showError('Please select a file first');
  }

  public displayResults(result: HashResult, totalTime: number): void {
    this.showStatus('<i class="bi bi-check-circle-fill text-success"></i> Processing Complete', 'success');
    this.completeProgress();

    const fileId = generateUUID();
    const hashDetails = this.createHashDetailsElement(result, fileId, totalTime);
    
    const hashContainer = getElementById('hashDetails');
    if (hashContainer) {
      hashContainer.innerHTML = '';
      hashContainer.appendChild(hashDetails);
    }

    this.updateFinalStats(result.size, totalTime);
  }

  public updateFinalStats(fileSize: number, totalTime: number): void {
    const uploadStats = getElementById('uploadStats');
    if (!uploadStats) return;

    const processingSpeed = fileSize / totalTime;

    const stats: ProcessingStats = {
      processingSpeed,
      fileSize,
      totalTime,
      status: 'Complete'
    };

    uploadStats.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label"><i class="bi bi-speedometer"></i> Processing Speed</div>
          <div class="stat-value">${formatBytes(stats.processingSpeed)}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label"><i class="bi bi-hdd"></i> File Size</div>
          <div class="stat-value">${formatBytes(stats.fileSize, false)}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label"><i class="bi bi-clock"></i> Total Time</div>
          <div class="stat-value">${formatTime(stats.totalTime)}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label"><i class="bi bi-check-circle"></i> Status</div>
          <div class="stat-value text-success">${stats.status}</div>
        </div>
      </div>
    `;
  }

  private createFileInfoElement(file: File): HTMLElement {
    const fileInfo = document.createElement('div');
    fileInfo.classList.add('drop-zone-file', 'animate__animated', 'animate__fadeIn');
    
    const fileIcon = getFileIcon(file.type);
    const fileSize = formatBytes(file.size, false);
    
    fileInfo.innerHTML = `
      <div class="file-display">
        <i class="bi ${fileIcon} file-icon"></i>
        <div class="file-details">
          <div class="file-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</div>
          <div class="file-size">${fileSize}</div>
          <div class="file-type">${file.type || 'Unknown type'}</div>
        </div>
      </div>
    `;
    
    return fileInfo;
  }

  private createHashDetailsElement(result: HashResult, fileId: string, totalTime: number): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('animate__animated', 'animate__fadeIn');
    
    container.innerHTML = `
      <div class="file-summary">
        <div class="file-icon-large">
          <i class="bi ${getFileIcon(result.type)}"></i>
        </div>
        <div class="file-info">
          <h5 class="file-name">${escapeHtml(result.name)}</h5>
          <div class="file-meta">
            <span><i class="bi bi-hdd"></i> ${formatBytes(result.size, false)}</span>
            <span><i class="bi bi-file-earmark"></i> ${result.type || 'Unknown type'}</span>
          </div>
        </div>
      </div>
      
      <div class="hash-section">
        <h6><i class="bi bi-shield-lock"></i> Cryptographic Hashes</h6>
        
        ${this.createHashItem('SHA-1', result.sha1Hash)}
        ${this.createHashItem('SHA-256', result.sha256Hash)}
        ${this.createHashItem('SHA-384', result.sha384Hash)}
        ${this.createHashItem('SHA-512', result.sha512Hash)}
      </div>
      
      <div class="additional-info">
        <h6><i class="bi bi-info-circle"></i> Processing Information</h6>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">File ID</div>
            <code>${fileId}</code>
          </div>
          <div class="info-item">
            <div class="info-label">Processed On</div>
            <code>${new Date().toLocaleString()}</code>
          </div>
          <div class="info-item">
            <div class="info-label">Processing Time</div>
            <code>${formatTime(totalTime)}</code>
          </div>
        </div>
      </div>
    `;
    
    return container;
  }

  private createHashItem(algorithm: string, hash: string): string {
    return `
      <div class="hash-item">
        <div class="hash-header">
          <div class="hash-label">${algorithm}</div>
          <button class="copy-btn" data-hash="${hash}" title="Copy ${algorithm} hash to clipboard">
            <i class="bi bi-clipboard"></i>
          </button>
        </div>
        <div class="hash-value-container">
          <code class="hash-value">${hash}</code>
        </div>
      </div>
    `;
  }
}