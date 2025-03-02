/**
 * File upload handler for the FileHasher Pro application
 */

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up drag and drop functionality
    setupDragAndDrop();
    
    // Add event listener to the upload button
    _('upload-button').addEventListener('click', function(event) {
        // Add ripple effect
        createRipple(this, event);
        
        const fileInput = _('file');
        if (fileInput.files.length > 0) {
            uploadFile(fileInput);
        } else {
            // Shake animation for error
            this.classList.add('animate__animated', 'animate__shakeX');
            setTimeout(() => {
                this.classList.remove('animate__animated', 'animate__shakeX');
            }, 500);
            
            // Show error message
            const dropZone = _('drop-zone');
            dropZone.style.borderColor = '#dc3545';
            dropZone.style.backgroundColor = 'rgba(220, 53, 69, 0.05)';
            
            setTimeout(() => {
                dropZone.style.borderColor = '';
                dropZone.style.backgroundColor = '';
            }, 1500);
        }
    });
});

/**
 * Set up drag and drop functionality
 */
function setupDragAndDrop() {
    const dropZone = _('drop-zone');
    const fileInput = _('file');
    
    // Click on drop zone to trigger file input
    dropZone.addEventListener('click', () => fileInput.click());
    
    // File selected via input
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            updateDropZoneUI(fileInput.files[0]);
        }
    });
    
    // Drag and drop events
    ['dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });
    
    // Add visual cue when dragging over
    dropZone.addEventListener('dragover', () => {
        dropZone.classList.add('drop-zone--over');
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('drop-zone--over');
        });
    });
    
    // Handle dropped files
    dropZone.addEventListener('drop', (e) => {
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            updateDropZoneUI(e.dataTransfer.files[0]);
        }
    });
}

/**
 * Update the drop zone UI when a file is selected
 * @param {File} file - The selected file
 */
function updateDropZoneUI(file) {
    const dropZone = _('drop-zone');
    const dropZonePrompt = dropZone.querySelector('.drop-zone-prompt');
    
    // Clear previous file info
    const existingFileInfo = dropZone.querySelector('.drop-zone-file');
    if (existingFileInfo) {
        existingFileInfo.remove();
    }
    
    // Create file info element
    const fileInfo = document.createElement('div');
    fileInfo.classList.add('drop-zone-file', 'animate__animated', 'animate__fadeIn');
    
    // Determine file icon based on type
    let fileIcon = 'bi-file-earmark';
    if (file.type.startsWith('image/')) fileIcon = 'bi-file-earmark-image';
    else if (file.type.startsWith('video/')) fileIcon = 'bi-file-earmark-play';
    else if (file.type.startsWith('audio/')) fileIcon = 'bi-file-earmark-music';
    else if (file.type.startsWith('text/')) fileIcon = 'bi-file-earmark-text';
    else if (file.type.includes('pdf')) fileIcon = 'bi-file-earmark-pdf';
    else if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('tar')) fileIcon = 'bi-file-earmark-zip';
    
    // Format file size
    const fileSize = niceBytes(file.size).replace('/s', '');
    
    fileInfo.innerHTML = `
        <i class="bi ${fileIcon}"></i>
        <div class="file-details">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${fileSize}</div>
        </div>
    `;
    
    dropZone.appendChild(fileInfo);
    dropZonePrompt.style.display = 'none';
}

/**
 * Handle file upload and display results
 * @param {HTMLInputElement} input - The file input element
 */
function uploadFile(input) {
    const file = input.files[0];
    if (!file) return;

    // Show result section with animation
    const resultSection = _('result');
    resultSection.style.display = 'block';
    resultSection.classList.add('animate__animated', 'animate__fadeIn');
    
    _('status').innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Processing file...';
    _('progress-percentage').textContent = '0%';

    const formData = new FormData();
    formData.append('file', file);

    const startTime = Date.now();
    const xhr = new XMLHttpRequest();

    // Speed tracking variables
    let speedMeasurements = [];
    let minSpeed = Infinity;
    let maxSpeed = 0;
    let lastLoaded = 0;
    let lastTime = startTime;
    let instantSpeed = 0;

    xhr.upload.onprogress = (event) => {
        const percentComplete = (event.loaded / event.total) * 100;
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 1000;
        const uploadSpeed = event.loaded / elapsedTime;
        
        // Calculate instant speed
        const timeDiff = (currentTime - lastTime) / 1000;
        if (timeDiff > 0) {
            instantSpeed = (event.loaded - lastLoaded) / timeDiff;
            lastLoaded = event.loaded;
            lastTime = currentTime;
        }

        // Track speeds
        speedMeasurements.push(instantSpeed);
        if (instantSpeed > 0) {
            minSpeed = Math.min(minSpeed, instantSpeed);
            maxSpeed = Math.max(maxSpeed, instantSpeed);
        }

        const avgSpeed = speedMeasurements.reduce((a, b) => a + b, 0) / speedMeasurements.length;

        _('progressBar').style.width = `${percentComplete}%`;
        _('progress-percentage').textContent = `${percentComplete.toFixed(0)}%`;
        _('status').innerHTML = `<i class="bi bi-arrow-repeat spin"></i> Processing: ${percentComplete.toFixed(0)}%`;
        
        _('uploadStats').innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-label"><i class="bi bi-speedometer"></i> Current Speed</div>
                    <div class="stat-value">${niceBytes(instantSpeed)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label"><i class="bi bi-arrow-down"></i> Min Speed</div>
                    <div class="stat-value">${niceBytes(minSpeed)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label"><i class="bi bi-arrow-up"></i> Max Speed</div>
                    <div class="stat-value">${niceBytes(maxSpeed)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label"><i class="bi bi-calculator"></i> Avg Speed</div>
                    <div class="stat-value">${niceBytes(avgSpeed)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label"><i class="bi bi-clock"></i> Elapsed Time</div>
                    <div class="stat-value">${formatTime(elapsedTime)}</div>
                </div>
            </div>
        `;
    };

    xhr.onload = () => {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                // Calculate final speed statistics
                const avgSpeed = speedMeasurements.reduce((a, b) => a + b, 0) / speedMeasurements.length;
                const totalTime = (Date.now() - startTime) / 1000;
                
                // Success animation
                _('status').innerHTML = '<i class="bi bi-check-circle-fill text-success"></i> Processing Complete';
                _('progressBar').style.width = '100%';
                _('progress-percentage').textContent = '100%';
                
                // Generate a unique file ID
                const fileId = generateGUID();
                
                // Create hash details with copy buttons
                const hashDetails = document.createElement('div');
                hashDetails.classList.add('animate__animated', 'animate__fadeIn');
                
                hashDetails.innerHTML = `
                    <div class="file-summary">
                        <div class="file-icon">
                            <i class="bi bi-file-earmark-binary"></i>
                        </div>
                        <div class="file-info">
                            <h5>${response.name}</h5>
                            <div class="file-meta">
                                <span><i class="bi bi-hdd"></i> ${niceBytes(response.size).replace('/s', '')}</span>
                                <span><i class="bi bi-file-earmark"></i> ${response.type || 'Unknown type'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="hash-section">
                        <h6><i class="bi bi-shield-lock"></i> File Hashes</h6>
                        
                        <div class="hash-item">
                            <div class="hash-label">SHA-1</div>
                            <div class="hash-value-container">
                                <code class="hash-value">${response.sha1Hash}</code>
                                <button class="copy-btn" data-hash="${response.sha1Hash}" title="Copy to clipboard">
                                    <i class="bi bi-clipboard"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="hash-item">
                            <div class="hash-label">SHA-256</div>
                            <div class="hash-value-container">
                                <code class="hash-value">${response.sha256Hash}</code>
                                <button class="copy-btn" data-hash="${response.sha256Hash}" title="Copy to clipboard">
                                    <i class="bi bi-clipboard"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="hash-item">
                            <div class="hash-label">SHA-384</div>
                            <div class="hash-value-container">
                                <code class="hash-value">${response.sha384Hash}</code>
                                <button class="copy-btn" data-hash="${response.sha384Hash}" title="Copy to clipboard">
                                    <i class="bi bi-clipboard"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="hash-item">
                            <div class="hash-label">SHA-512</div>
                            <div class="hash-value-container">
                                <code class="hash-value">${response.sha512Hash}</code>
                                <button class="copy-btn" data-hash="${response.sha512Hash}" title="Copy to clipboard">
                                    <i class="bi bi-clipboard"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="additional-info">
                        <h6><i class="bi bi-info-circle"></i> Additional Information</h6>
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
                `;
                
                _('hashDetails').innerHTML = '';
                _('hashDetails').appendChild(hashDetails);
                
                // Add event listeners to copy buttons
                const copyButtons = document.querySelectorAll('.copy-btn');
                copyButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const hashValue = this.getAttribute('data-hash');
                        copyToClipboard(hashValue).then(success => {
                            const icon = this.querySelector('i');
                            if (success) {
                                icon.className = 'bi bi-check';
                                setTimeout(() => {
                                    icon.className = 'bi bi-clipboard';
                                }, 1500);
                            }
                        });
                    });
                });
                
                // Update stats with final values
                _('uploadStats').innerHTML = `
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-label"><i class="bi bi-speedometer"></i> Average Speed</div>
                            <div class="stat-value">${niceBytes(avgSpeed)}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label"><i class="bi bi-arrow-down"></i> Min Speed</div>
                            <div class="stat-value">${niceBytes(minSpeed)}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label"><i class="bi bi-arrow-up"></i> Max Speed</div>
                            <div class="stat-value">${niceBytes(maxSpeed)}</div>
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
                
            } catch (error) {
                _('status').innerHTML = '<i class="bi bi-exclamation-triangle-fill text-warning"></i> Error parsing response';
            }
        } else {
            _('status').innerHTML = `<i class="bi bi-x-circle-fill text-danger"></i> Upload Failed: ${xhr.status} ${xhr.statusText}`;
        }
    };

    xhr.onerror = () => {
        _('status').innerHTML = '<i class="bi bi-x-circle-fill text-danger"></i> Upload Failed: Network Error';
    };
    
    xhr.open('POST', '/upload');
    xhr.send(formData);
}