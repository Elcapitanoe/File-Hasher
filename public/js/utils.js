/**
 * Utility functions for the FileHasher Pro application
 * Enhanced with better error handling and modern JavaScript features
 */

// Shorthand for document.getElementById with error checking
function _(elementId) { 
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with ID '${elementId}' not found`);
  }
  return element;
}

/**
 * Generate a cryptographically secure UUID v4
 * @returns {string} A randomly generated UUID
 */
function generateGUID() {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Convert bytes to human-readable format with improved precision
 * @param {number} bytes - The number of bytes
 * @param {boolean} isSpeed - Whether this is a speed measurement
 * @returns {string} Formatted string with appropriate unit
 */
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

/**
 * Format time in a human-readable way with improved accuracy
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
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

/**
 * Add a ripple effect to buttons with improved performance
 * @param {HTMLElement} button - The button element
 * @param {Event} event - The click event
 */
function createRipple(button, event) {
  if (!button || !event) return;
  
  // Remove existing ripples
  const existingRipples = button.querySelectorAll('.ripple');
  existingRipples.forEach(ripple => ripple.remove());
  
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const rect = button.getBoundingClientRect();
  
  circle.style.cssText = `
    width: ${diameter}px;
    height: ${diameter}px;
    left: ${event.clientX - rect.left - radius}px;
    top: ${event.clientY - rect.top - radius}px;
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  `;
  
  circle.classList.add('ripple');
  
  // Ensure button has relative positioning
  if (getComputedStyle(button).position === 'static') {
    button.style.position = 'relative';
  }
  
  button.style.overflow = 'hidden';
  button.appendChild(circle);
  
  // Clean up after animation
  setTimeout(() => {
    if (circle.parentNode) {
      circle.remove();
    }
  }, 600);
}

/**
 * Copy text to clipboard with enhanced error handling
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
async function copyToClipboard(text) {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers or non-secure contexts
      return fallbackCopyToClipboard(text);
    }
  } catch (error) {
    console.warn('Clipboard API failed, trying fallback:', error);
    return fallbackCopyToClipboard(text);
  }
}

/**
 * Fallback clipboard copy method
 * @param {string} text - Text to copy
 * @returns {boolean} Success status
 */
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

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Validate file type and size
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
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

// Add CSS for ripple animation if not already present
if (!document.querySelector('#ripple-styles')) {
  const style = document.createElement('style');
  style.id = 'ripple-styles';
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Export functions for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    _,
    generateGUID,
    niceBytes,
    formatTime,
    createRipple,
    copyToClipboard,
    debounce,
    throttle,
    validateFile
  };
}