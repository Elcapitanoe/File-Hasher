/**
 * Enhanced file upload handler for the FileHasher Pro application
 * Improved with better error handling, performance optimizations, and modern JavaScript
 */

// Configuration constants
const CONFIG = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  UPLOAD_ENDPOINT: '/upload',
  PROGRESS_UPDATE_INTERVAL: 100, // ms
  SPEED_CALCULATION_WINDOW: 5 // number of measurements to average
};

// State management
const uploadState = {
  isUploading: false,
  currentFile: null,
  abortController: null
};

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeUploadHandlers();
});

/**
 * Initialize all upload-related event handlers
 */
function initializeUploadHandlers() {
  setupDragAndDrop();
  setupUploadButton();
  setupFileInput();
}

/**
 * Set up drag and drop functionality with enhanced UX
 */
function setupDragAndDrop() {
  const dropZone = _('drop-zone');
  const fileInput = _('file');
  
  if (!dropZone || !fileInput) {
    console.error('Required elements not found for drag and drop setup');
    return;
  }

  // Click on drop zone to trigger file input
  dropZone.addEventListener('click', (e) => {
    e.preventDefault();
    if (!uploadState.isUploading) {
      fileInput.click();
    }
  });

  // File selected via input
  fileInput.addEventListener('change', handleFileSelection);

  // Prevent default drag behaviors
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  // Highlight drop zone when item is dragged over it
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
      if (!uploadState.isUploading) {
        dropZone.classList.add('drop-zone--over');
      }
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
      dropZone.classList.remove('drop-zone--over');
    }, false);
  });

  // Handle dropped files
  dropZone.addEventListener('drop', handleDrop, false);
}

/**
 * Prevent default drag behaviors
 */
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

/**
 * Handle file drop event
 */
function handleDrop(e) {
  if (uploadState.isUploading) return;
  
  const dt = e.dataTransfer;
  const files = dt.files;

  if (files.length > 1) {
    showError('Please select only one file at a time');
    return;
  }

  if (files.length === 1) {
    const fileInput = _('file');
    fileInput.files = files;
    handleFileSelection();
  }
}

/**
 * Set up upload button with enhanced feedback
 */
function setupUploadButton() {
  const uploadButton = _('upload-button');
  if (!uploadButton) return;

  uploadButton.addEventListener('click', function(event) {
    event.preventDefault();
    
    // Add ripple effect
    createRipple(this, event);
    
    if (uploadState.isUploading) {
      // Cancel upload
      cancelUpload();
      return;
    }

    const fileInput = _('file');
    if (!fileInput?.files?.length) {
      showFileSelectionError();
      return;
    }

    uploadFile(fileInput);
  });
}

/**
 * Set up file input change handler
 */
function setupFileInput() {
  const fileInput = _('file');
  if (!fileInput) return;

  fileInput.addEventListener('change', handleFileSelection);
}

/**
 * Handle file selection from input or drop
 */
function handleFileSelection() {
  const fileInput = _('file');
  const file = fileInput?.files?.[0];
  
  if (!file) {
    resetDropZoneUI();
    return;
  }

  // Validate file
  const validation = validateFile(file, {
    maxSize: CONFIG.MAX_FILE_SIZE
  });

  if (!validation.valid) {
    showError(validation.errors.join(', '));
    resetDropZoneUI();
    return;
  }

  uploadState.currentFile = file;
  updateDropZoneUI(file);
  updateUploadButton('ready');
}

/**
 * Update the drop zone UI when a file is selected
 */
function updateDropZoneUI(file) {
  const dropZone = _('drop-zone');
  const dropZonePrompt = dropZone?.querySelector('.drop-zone-prompt');
  
  if (!dropZone || !dropZonePrompt) return;

  // Clear previous file info
  const existingFileInfo = dropZone.querySelector('.drop-zone-file');
  existingFileInfo?.remove();

  // Create file info element
  const fileInfo = createFileInfoElement(file);
  dropZone.appendChild(fileInfo);
  dropZonePrompt.style.display = 'none';
}

/**
 * Create file info display element
 */
function createFileInfoElement(file) {
  const fileInfo = document.createElement('div');
  fileInfo.classList.add('drop-zone-file', 'animate__animated', 'animate__fadeIn');
  
  const fileIcon = getFileIcon(file.type);
  const fileSize = niceBytes(file.size, false);
  
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

/**
 * Get appropriate icon for file type
 */
function getFileIcon(mimeType) {
  if (!mimeType) return 'bi-file-earmark';
  
  const iconMap = {
    'image/': 'bi-file-earmark-image',
    'video/': 'bi-file-earmark-play',
    'audio/': 'bi-file-earmark-music',
    'text/': 'bi-file-earmark-text',
    'application/pdf': 'bi-file-earmark-pdf',
    'application/zip': 'bi-file-earmark-zip',
    'application/x-rar': 'bi-file-earmark-zip',
    'application/x-tar': 'bi-file-earmark-zip',
    'application/json': 'bi-file-earmark-code',
    'application/javascript': 'bi-file-earmark-code',
    'text/html': 'bi-file-earmark-code',
    'text/css': 'bi-file-earmark-code'
  };
  
  for (const [type, icon] of Object.entries(iconMap)) {
    if (mimeType.startsWith(type) || mimeType === type) {
      return icon;
    }
  }
  
  return 'bi-file-earmark';
}

/**
 * Reset drop zone to initial state
 */
function resetDropZoneUI() {
  const dropZone = _('drop-zone');
  const dropZonePrompt = dropZone?.querySelector('.drop-zone-prompt');
  const existingFileInfo = dropZone?.querySelector('.drop-zone-file');
  
  if (existingFileInfo) {
    existingFileInfo.remove();
  }
  
  if (dropZonePrompt) {
    dropZonePrompt.style.display = 'flex';
  }
  
  updateUploadButton('initial');
}

/**
 * Update upload button state and text
 */
function updateUploadButton(state) {
  const uploadButton = _('upload-button');
  if (!uploadButton) return;

  const states = {
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
    uploading: {
      text: '<i class="bi bi-x-circle"></i> Cancel Upload',
      disabled: false,
      className: 'btn-danger'
    },
    processing: {
      text: '<i class="bi bi-arrow-repeat spin"></i> Processing...',
      disabled: true,
      className: 'btn-warning'
    }
  };

  const config = states[state] || states.initial;
  
  uploadButton.innerHTML = config.text;
  uploadButton.disabled = config.disabled;
  uploadButton.className = `btn btn-lg ${config.className} w-100`;
}

/**
 * Enhanced file upload with better progress tracking and error handling
 */
async function uploadFile(input) {
  const file = input.files[0];
  if (!file || uploadState.isUploading) return;

  try {
    uploadState.isUploading = true;
    uploadState.abortController = new AbortController();
    
    showResultSection();
    updateUploadButton('uploading');
    initializeProgress();

    const formData = new FormData();
    formData.append('file', file);

    const startTime = performance.now();
    const speedTracker = new SpeedTracker();

    const response = await fetch(CONFIG.UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData,
      signal: uploadState.abortController.signal
    });

    const totalTime = (performance.now() - startTime) / 1000;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    updateUploadButton('processing');
    await displayResults(result, speedTracker.getStats(), totalTime);
    
  } catch (error) {
    if (error.name === 'AbortError') {
      showStatus('<i class="bi bi-x-circle"></i> Upload cancelled', 'warning');
    } else {
      console.error('Upload error:', error);
      showStatus(`<i class="bi bi-exclamation-triangle"></i> Upload failed: ${error.message}`, 'error');
    }
  } finally {
    uploadState.isUploading = false;
    uploadState.abortController = null;
    updateUploadButton('ready');
  }
}

/**
 * Speed tracking utility class
 */
class SpeedTracker {
  constructor() {
    this.measurements = [];
    this.startTime = performance.now();
  }

  addMeasurement(bytesLoaded) {
    const currentTime = performance.now();
    const elapsedTime = (currentTime - this.startTime) / 1000;
    const speed = elapsedTime > 0 ? bytesLoaded / elapsedTime : 0;
    
    this.measurements.push(speed);
    
    // Keep only recent measurements for better accuracy
    if (this.measurements.length > CONFIG.SPEED_CALCULATION_WINDOW) {
      this.measurements.shift();
    }
  }

  getStats() {
    if (this.measurements.length === 0) {
      return { min: 0, max: 0, avg: 0, current: 0 };
    }

    const validMeasurements = this.measurements.filter(m => m > 0);
    
    return {
      min: Math.min(...validMeasurements) || 0,
      max: Math.max(...validMeasurements) || 0,
      avg: validMeasurements.reduce((a, b) => a + b, 0) / validMeasurements.length || 0,
      current: validMeasurements[validMeasurements.length - 1] || 0
    };
  }
}

/**
 * Cancel current upload
 */
function cancelUpload() {
  if (uploadState.abortController) {
    uploadState.abortController.abort();
  }
}

/**
 * Show result section with animation
 */
function showResultSection() {
  const resultSection = _('result');
  if (!resultSection) return;

  resultSection.style.display = 'block';
  resultSection.classList.add('animate__animated', 'animate__fadeIn');
}

/**
 * Initialize progress display
 */
function initializeProgress() {
  const progressBar = _('progressBar');
  const progressPercentage = _('progress-percentage');
  
  if (progressBar) progressBar.style.width = '0%';
  if (progressPercentage) progressPercentage.textContent = '0%';
  
  showStatus('<i class="bi bi-arrow-repeat spin"></i> Starting upload...', 'info');
}

/**
 * Display upload results with enhanced formatting
 */
async function displayResults(response, speedStats, totalTime) {
  try {
    showStatus('<i class="bi bi-check-circle-fill text-success"></i> Processing Complete', 'success');
    
    const progressBar = _('progressBar');
    const progressPercentage = _('progress-percentage');
    
    if (progressBar) progressBar.style.width = '100%';
    if (progressPercentage) progressPercentage.textContent = '100%';

    const fileId = generateGUID();
    const hashDetails = createHashDetailsElement(response, fileId, totalTime);
    
    const hashContainer = _('hashDetails');
    if (hashContainer) {
      hashContainer.innerHTML = '';
      hashContainer.appendChild(hashDetails);
    }

    setupCopyButtons();
    updateFinalStats(speedStats, totalTime);
    
  } catch (error) {
    console.error('Error displaying results:', error);
    showStatus('<i class="bi bi-exclamation-triangle"></i> Error displaying results', 'error');
  }
}

/**
 * Create hash details display element
 */
function createHashDetailsElement(response, fileId, totalTime) {
  const container = document.createElement('div');
  container.classList.add('animate__animated', 'animate__fadeIn');
  
  container.innerHTML = `
    <div class="file-summary">
      <div class="file-icon-large">
        <i class="bi ${getFileIcon(response.type)}"></i>
      </div>
      <div class="file-info">
        <h5 class="file-name">${escapeHtml(response.name)}</h5>
        <div class="file-meta">
          <span><i class="bi bi-hdd"></i> ${niceBytes(response.size, false)}</span>
          <span><i class="bi bi-file-earmark"></i> ${response.type || 'Unknown type'}</span>
        </div>
      </div>
    </div>
    
    <div class="hash-section">
      <h6><i class="bi bi-shield-lock"></i> Cryptographic Hashes</h6>
      
      ${createHashItem('SHA-1', response.sha1Hash)}
      ${createHashItem('SHA-256', response.sha256Hash)}
      ${createHashItem('SHA-384', response.sha384Hash)}
      ${createHashItem('SHA-512', response.sha512Hash)}
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

/**
 * Create individual hash item HTML
 */
function createHashItem(algorithm, hash) {
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

/**
 * Set up copy button event listeners
 */
function setupCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async function() {
      const hashValue = this.getAttribute('data-hash');
      const icon = this.querySelector('i');
      const originalClass = icon.className;
      
      try {
        const success = await copyToClipboard(hashValue);
        
        if (success) {
          icon.className = 'bi bi-check';
          this.title = 'Copied!';
          
          setTimeout(() => {
            icon.className = originalClass;
            this.title = `Copy ${this.closest('.hash-item').querySelector('.hash-label').textContent} hash to clipboard`;
          }, 2000);
        } else {
          throw new Error('Copy failed');
        }
      } catch (error) {
        icon.className = 'bi bi-x';
        this.title = 'Copy failed';
        
        setTimeout(() => {
          icon.className = originalClass;
          this.title = `Copy ${this.closest('.hash-item').querySelector('.hash-label').textContent} hash to clipboard`;
        }, 2000);
      }
    });
  });
}

/**
 * Update final statistics display
 */
function updateFinalStats(speedStats, totalTime) {
  const uploadStats = _('uploadStats');
  if (!uploadStats) return;

  uploadStats.innerHTML = `
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-label"><i class="bi bi-speedometer"></i> Average Speed</div>
        <div class="stat-value">${niceBytes(speedStats.avg)}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label"><i class="bi bi-arrow-down"></i> Min Speed</div>
        <div class="stat-value">${niceBytes(speedStats.min)}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label"><i class="bi bi-arrow-up"></i> Max Speed</div>
        <div class="stat-value">${niceBytes(speedStats.max)}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label"><i class="bi bi-clock"></i> Total Time</div>
        <div class="stat-value">${formatTime(totalTime)}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label"><i class="bi bi-check-circle"></i> Status</div>
        <div class="stat-value text-success">Complete</div>
      </div>
    </div>
  `;
}

/**
 * Show status message with type styling
 */
function showStatus(message, type = 'info') {
  const statusElement = _('status');
  if (!statusElement) return;

  const typeClasses = {
    info: 'text-info',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-danger'
  };

  statusElement.innerHTML = message;
  statusElement.className = `text-center status-text ${typeClasses[type] || typeClasses.info}`;
}

/**
 * Show error message with visual feedback
 */
function showError(message) {
  showStatus(`<i class="bi bi-exclamation-triangle"></i> ${message}`, 'error');
  
  // Add shake animation to drop zone
  const dropZone = _('drop-zone');
  if (dropZone) {
    dropZone.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => {
      dropZone.classList.remove('animate__animated', 'animate__shakeX');
    }, 500);
  }
}

/**
 * Show file selection error with visual feedback
 */
function showFileSelectionError() {
  const uploadButton = _('upload-button');
  const dropZone = _('drop-zone');
  
  // Shake animation for button
  if (uploadButton) {
    uploadButton.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => {
      uploadButton.classList.remove('animate__animated', 'animate__shakeX');
    }, 500);
  }
  
  // Highlight drop zone
  if (dropZone) {
    dropZone.style.borderColor = '#dc3545';
    dropZone.style.backgroundColor = 'rgba(220, 53, 69, 0.05)';
    
    setTimeout(() => {
      dropZone.style.borderColor = '';
      dropZone.style.backgroundColor = '';
    }, 1500);
  }
  
  showError('Please select a file first');
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}