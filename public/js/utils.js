/**
 * Utility functions for the File Hasher application
 */

// Shorthand for document.getElementById
function _(e) { 
    return document.getElementById(e); 
}

/**
 * Generate a unique GUID
 * @returns {string} A randomly generated GUID
 */
function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Convert bytes to human-readable format
 * @param {number} bytes - The number of bytes
 * @returns {string} Formatted string with appropriate unit
 */
function niceBytes(bytes) {
    const units = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
    let unitIndex = 0;
    while (bytes >= 1024 && unitIndex < units.length - 1) {
        bytes /= 1024;
        unitIndex++;
    }
    return `${bytes.toFixed(2)} ${units[unitIndex]}${unitIndex > 0 ? '/s' : ''}`;
}