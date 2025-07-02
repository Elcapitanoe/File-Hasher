import CryptoJS from 'crypto-js';

// Utility functions
function _(elementId) { 
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with ID '${elementId}' not found`);
  }
  return element;
}

function generateGUID() {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function niceBytes(bytes, isSpeed = true) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '0 bytes';
  }
  
  const units = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  let unitIndex = 0;
  let value = bytes;
  
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  
  const precision = unitIndex === 0 ? 0 : 2;
  const suffix = isSpeed && unitIndex > 0 ? '/s' : '';
  
  return `${value.toFixed(precision)} ${units[unitIndex]}${suffix}`;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0 seconds';
  }
  
  if (seconds < 1) {
    return `${(seconds * 1000).toFixed(0)} ms`;
  } else if (seconds < 60) {
    return `${seconds.toFixed(2)} seconds`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds.toFixed(0)} sec`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hr ${minutes} min`;
  }
}

async function copyToClipboard(text) {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      return fallbackCopyToClipboard(text);
    }
  } catch (error) {
    console.warn('Clipboard API failed, trying fallback:', error);
    return fallbackCopyToClipboard(text);
  }
}

function fallbackCopyToClipboard(text) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText = `
      position: fixed;
      top: -9999px;
      left: -9999px;
      opacity: 0;
      pointer-events: none;
    `;
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.error('Fallback copy failed:', error);
    return false;
  }
}

function validateFile(file, options = {}) {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB default
    allowedTypes = null,
    minSize = 1
  } = options;
  
  const errors = [];
  
  if (!file) {
    errors.push('No file provided');
    return { valid: false, errors };
  }
  
  if (file.size < minSize) {
    errors.push('File is too small');
  }
  
  if (file.size > maxSize) {
    errors.push(`File size exceeds ${niceBytes(maxSize, false)} limit`);
  }
  
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    errors.push('File type not allowed');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    file: {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }
  };
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

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

// Theme switcher
function initializeTheme() {
  const themeToggle = _('theme-toggle');
  const themeStylesheet = _('theme-stylesheet');
  
  const savedTheme = localStorage.getItem('theme');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  const initialTheme = savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');
  setTheme(initialTheme);
  
  themeToggle?.addEventListener('click', function() {
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    themeToggle.classList.add('animate__animated', 'animate__pulse');
    setTimeout(() => {
      themeToggle.classList.remove('animate__animated', 'animate__pulse');
    }, 500);
    
    setTheme(newTheme);
  });
  
  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
  
  function setTheme(theme) {
    document.body.style.transition = 'background 0.3s ease';
    themeStylesheet.href = `/css/style-${theme}.css`;
    
    const icon = themeToggle?.querySelector('i');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'bi bi-sun';
      } else {
        icon.className = 'bi bi-moon';
      }
    }
    
    localStorage.setItem('theme', theme);
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }
}

// File processing
const uploadState = {
  isProcessing: false,
  currentFile: null
};

function initializeFileHandling() {
  setupDragAndDrop();
  setupUploadButton();
  setupFileInput();
}

function setupDragAndDrop() {
  const dropZone = _('drop-zone');
  const fileInput = _('file');
  
  if (!dropZone || !fileInput) {
    console.error('Required elements not found for drag and drop setup');
    return;
  }

  // Make sure the file input is properly configured
  fileInput.style.position = 'absolute';
  fileInput.style.left = '-9999px';
  fileInput.style.opacity = '0';
  fileInput.style.pointerEvents = 'none';

  // Click handler for drop zone
  dropZone.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Drop zone clicked, triggering file input');
    
    if (!uploadState.isProcessing) {
      // Force trigger the file input
      fileInput.click();
    }
  });

  // File input change handler
  fileInput.addEventListener('change', (e) => {
    console.log('File input changed:', e.target.files);
    handleFileSelection();
  });

  // Prevent default drag behaviors
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  // Highlight drop zone when item is dragged over it
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
      if (!uploadState.isProcessing) {
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

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function handleDrop(e) {
  if (uploadState.isProcessing) return;
  
  const dt = e.dataTransfer;
  const files = dt.files;

  if (files.length > 1) {
    showError('Please select only one file at a time');
    return;
  }

  if (files.length === 1) {
    const fileInput = _('file');
    // Create a new FileList-like object
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(files[0]);
    fileInput.files = dataTransfer.files;
    handleFileSelection();
  }
}

function setupUploadButton() {
  const uploadButton = _('upload-button');
  if (!uploadButton) return;

  uploadButton.addEventListener('click', function(event) {
    event.preventDefault();
    
    if (uploadState.isProcessing) {
      return;
    }

    const fileInput = _('file');
    if (!fileInput?.files?.length) {
      showFileSelectionError();
      return;
    }

    processFile(fileInput.files[0]);
  });
}

function setupFileInput() {
  const fileInput = _('file');
  if (!fileInput) return;

  // Additional change handler to ensure it works
  fileInput.addEventListener('change', handleFileSelection);
}

function handleFileSelection() {
  const fileInput = _('file');
  const file = fileInput?.files?.[0];
  
  console.log('Handling file selection:', file);
  
  if (!file) {
    resetDropZoneUI();
    return;
  }

  const validation = validateFile(file, {
    maxSize: 50 * 1024 * 1024 // 50MB
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

function updateDropZoneUI(file) {
  const dropZone = _('drop-zone');
  const dropZonePrompt = dropZone?.querySelector('.drop-zone-prompt');
  
  if (!dropZone || !dropZonePrompt) return;

  const existingFileInfo = dropZone.querySelector('.drop-zone-file');
  existingFileInfo?.remove();

  const fileInfo = createFileInfoElement(file);
  dropZone.appendChild(fileInfo);
  dropZonePrompt.style.display = 'none';
}

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

async function processFile(file) {
  if (!file || uploadState.isProcessing) return;

  try {
    uploadState.isProcessing = true;
    
    showResultSection();
    updateUploadButton('processing');
    initializeProgress();

    const startTime = performance.now();
    
    // Show processing status
    showStatus('<i class="bi bi-arrow-repeat spin"></i> Reading file...', 'info');
    
    // Read file as ArrayBuffer
    const arrayBuffer = await readFileAsArrayBuffer(file);
    
    showStatus('<i class="bi bi-arrow-repeat spin"></i> Generating hashes...', 'info');
    
    // Convert to WordArray for CryptoJS
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    
    // Generate hashes
    const sha1Hash = CryptoJS.SHA1(wordArray).toString();
    const sha256Hash = CryptoJS.SHA256(wordArray).toString();
    const sha384Hash = CryptoJS.SHA384(wordArray).toString();
    const sha512Hash = CryptoJS.SHA512(wordArray).toString();
    
    const totalTime = (performance.now() - startTime) / 1000;
    
    const result = {
      name: file.name,
      type: file.type,
      size: file.size,
      sha1Hash,
      sha256Hash,
      sha384Hash,
      sha512Hash,
      processedAt: new Date().toISOString()
    };
    
    await displayResults(result, totalTime);
    
  } catch (error) {
    console.error('Processing error:', error);
    showStatus(`<i class="bi bi-exclamation-triangle"></i> Processing failed: ${error.message}`, 'error');
  } finally {
    uploadState.isProcessing = false;
    updateUploadButton('ready');
  }
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

function showResultSection() {
  const resultSection = _('result');
  if (!resultSection) return;

  resultSection.style.display = 'block';
  resultSection.classList.add('animate__animated', 'animate__fadeIn');
}

function initializeProgress() {
  const progressBar = _('progressBar');
  const progressPercentage = _('progress-percentage');
  
  if (progressBar) progressBar.style.width = '0%';
  if (progressPercentage) progressPercentage.textContent = '0%';
  
  showStatus('<i class="bi bi-arrow-repeat spin"></i> Starting processing...', 'info');
}

async function displayResults(response, totalTime) {
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
    updateFinalStats(totalTime);
    
  } catch (error) {
    console.error('Error displaying results:', error);
    showStatus('<i class="bi bi-exclamation-triangle"></i> Error displaying results', 'error');
  }
}

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

function updateFinalStats(totalTime) {
  const uploadStats = _('uploadStats');
  if (!uploadStats) return;

  const fileSize = uploadState.currentFile?.size || 0;
  const processingSpeed = fileSize / totalTime;

  uploadStats.innerHTML = `
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-label"><i class="bi bi-speedometer"></i> Processing Speed</div>
        <div class="stat-value">${niceBytes(processingSpeed)}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label"><i class="bi bi-hdd"></i> File Size</div>
        <div class="stat-value">${niceBytes(fileSize, false)}</div>
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

function showError(message) {
  showStatus(`<i class="bi bi-exclamation-triangle"></i> ${message}`, 'error');
  
  const dropZone = _('drop-zone');
  if (dropZone) {
    dropZone.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => {
      dropZone.classList.remove('animate__animated', 'animate__shakeX');
    }, 500);
  }
}

function showFileSelectionError() {
  const uploadButton = _('upload-button');
  const dropZone = _('drop-zone');
  
  if (uploadButton) {
    uploadButton.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => {
      uploadButton.classList.remove('animate__animated', 'animate__shakeX');
    }, 500);
  }
  
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

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .spin {
    animation: spin 1s linear infinite;
  }
  
  footer a {
    color: inherit;
    transition: color 0.3s ease;
  }
  
  footer a:hover {
    color: var(--primary-500, #4361ee) !important;
  }
  
  /* Ensure file input is properly hidden but still functional */
  .drop-zone-input {
    position: absolute !important;
    left: -9999px !important;
    opacity: 0 !important;
    pointer-events: none !important;
    width: 1px !important;
    height: 1px !important;
  }
  
  /* Make drop zone more clickable */
  .drop-zone {
    cursor: pointer !important;
  }
  
  .drop-zone:hover {
    cursor: pointer !important;
  }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing...');
  initializeTheme();
  initializeFileHandling();
  
  // Debug: Check if elements exist
  const dropZone = _('drop-zone');
  const fileInput = _('file');
  console.log('Drop zone found:', !!dropZone);
  console.log('File input found:', !!fileInput);
});