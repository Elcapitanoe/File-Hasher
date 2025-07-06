/**
 * Convert bytes to human-readable format with improved precision
 */
export function formatBytes(bytes: number, isSpeed = true): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '0 bytes';
  }
  
  const units = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB'] as const;
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
 */
export function formatTime(seconds: number): string {
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