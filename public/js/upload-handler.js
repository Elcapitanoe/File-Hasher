/**
 * File upload handler for the File Hasher application
 */

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the upload button
    _('upload-button').addEventListener('click', function() {
        const fileInput = _('file');
        if (fileInput.files.length > 0) {
            uploadFile(fileInput);
        } else {
            alert('Please select a file first');
        }
    });
});

/**
 * Handle file upload and display results
 * @param {HTMLInputElement} input - The file input element
 */
function uploadFile(input) {
    const file = input.files[0];
    if (!file) return;

    _('result').style.display = 'block';
    _('status').innerHTML = 'Starting upload...';

    const formData = new FormData();
    formData.append('file', file);

    const startTime = Date.now();
    const xhr = new XMLHttpRequest();

    // Speed tracking variables
    let speedMeasurements = [];
    let minSpeed = Infinity;
    let maxSpeed = 0;

    xhr.upload.onprogress = (event) => {
        const percentComplete = (event.loaded / event.total) * 100;
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 1000;
        const uploadSpeed = event.loaded / elapsedTime;

        // Track speeds
        speedMeasurements.push(uploadSpeed);
        minSpeed = Math.min(minSpeed, uploadSpeed);
        maxSpeed = Math.max(maxSpeed, uploadSpeed);

        const avgSpeed = speedMeasurements.reduce((a, b) => a + b, 0) / speedMeasurements.length;

        _('progressBar').style.width = `${percentComplete}%`;
        _('status').innerHTML = `Uploading: ${percentComplete.toFixed(2)}%`;
        _('uploadStats').innerHTML = `
            <div>Current Speed: ${niceBytes(uploadSpeed)}</div>
            <div>Minimum Speed: ${niceBytes(minSpeed)}</div>
            <div>Maximum Speed: ${niceBytes(maxSpeed)}</div>
            <div>Average Speed: ${niceBytes(avgSpeed)}</div>
            <div>Elapsed Time: ${elapsedTime.toFixed(2)} seconds</div>
        `;
    };

    xhr.onload = () => {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            
            // Calculate final speed statistics
            const avgSpeed = speedMeasurements.reduce((a, b) => a + b, 0) / speedMeasurements.length;

            _('hashDetails').innerHTML = `
                <div>
                    <strong>File Details:</strong>
                    <div>Name: ${response.name}</div>
                    <div>Size: ${niceBytes(response.size)}</div>
                    <div>Type: ${response.type}</div>
                    
                    <hr>
                    <strong>File Hashes:</strong>
                    <div><strong>SHA-1:</strong> <code>${response.sha1Hash}</code></div>
                    <div><strong>SHA-256:</strong> <code>${response.sha256Hash}</code></div>
                    <div><strong>SHA-384:</strong> <code>${response.sha384Hash}</code></div>
                    <div><strong>SHA-512:</strong> <code>${response.sha512Hash}</code></div>
                    
                    <hr>
                    <strong>Additional Information:</strong>
                    <div>File GUID: <code>${generateGUID()}</code></div>
                    
                    <hr>
                    <strong>Upload Speed Statistics:</strong>
                    <div>Minimum Speed: ${niceBytes(minSpeed)}</div>
                    <div>Maximum Speed: ${niceBytes(maxSpeed)}</div>
                    <div>Average Speed: ${niceBytes(avgSpeed)}</div>
                </div>
            `;
            _('status').innerHTML = 'Upload Complete';
        } else {
            _('status').innerHTML = `Upload Failed: ${xhr.status} ${xhr.statusText}`;
        }
    };

    xhr.onerror = () => {
        _('status').innerHTML = 'Upload Failed: Network Error';
    };
    
    xhr.open('POST', '/upload');
    xhr.send(formData);
}