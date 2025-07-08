/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 Bytes';
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format processing speed
 */
export function formatSpeed(bytesPerSecond: number): string {
  return `${formatBytes(bytesPerSecond)}/s`;
}

/**
 * Format time duration
 */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0s';
  
  if (seconds < 1) {
    return `${Math.round(seconds * 1000)}ms`;
  }
  
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format file type for display
 */
export function formatFileType(mimeType: string): string {
  if (!mimeType) return 'Unknown';
  
  const typeMap: Record<string, string> = {
    'application/pdf': 'PDF Document',
    'application/zip': 'ZIP Archive',
    'application/json': 'JSON File',
    'text/plain': 'Text File',
    'text/html': 'HTML Document',
    'text/css': 'CSS Stylesheet',
    'text/javascript': 'JavaScript File',
    'image/jpeg': 'JPEG Image',
    'image/png': 'PNG Image',
    'image/gif': 'GIF Image',
    'image/svg+xml': 'SVG Image',
    'video/mp4': 'MP4 Video',
    'audio/mpeg': 'MP3 Audio',
  };
  
  return typeMap[mimeType] || mimeType.split('/')[1]?.toUpperCase() || 'Unknown';
}