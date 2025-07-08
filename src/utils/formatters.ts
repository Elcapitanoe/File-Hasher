/**
 * Format bytes to human-readable string with proper error handling
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 Bytes';
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = Math.max(0, decimals);
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const sizeIndex = Math.min(i, sizes.length - 1);

  return `${parseFloat((bytes / Math.pow(k, sizeIndex)).toFixed(dm))} ${sizes[sizeIndex]}`;
}

/**
 * Format processing speed with appropriate units
 */
export function formatSpeed(bytesPerSecond: number): string {
  if (!Number.isFinite(bytesPerSecond) || bytesPerSecond < 0) return '0 Bytes/s';
  return `${formatBytes(bytesPerSecond)}/s`;
}

/**
 * Format time duration with appropriate units
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
 * Format percentage with proper bounds checking
 */
export function formatPercentage(value: number, decimals = 1): string {
  const clampedValue = Math.max(0, Math.min(100, value));
  return `${clampedValue.toFixed(Math.max(0, decimals))}%`;
}

/**
 * Format file type for display with better categorization
 */
export function formatFileType(mimeType: string): string {
  if (!mimeType) return 'Unknown';
  
  const typeMap: Record<string, string> = {
    // Documents
    'application/pdf': 'PDF Document',
    'application/msword': 'Word Document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
    'application/vnd.ms-excel': 'Excel Spreadsheet',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
    'application/vnd.ms-powerpoint': 'PowerPoint Presentation',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint Presentation',
    
    // Archives
    'application/zip': 'ZIP Archive',
    'application/x-rar-compressed': 'RAR Archive',
    'application/x-tar': 'TAR Archive',
    'application/gzip': 'GZIP Archive',
    'application/x-7z-compressed': '7-Zip Archive',
    
    // Code files
    'application/json': 'JSON File',
    'application/javascript': 'JavaScript File',
    'text/javascript': 'JavaScript File',
    'text/typescript': 'TypeScript File',
    'text/html': 'HTML Document',
    'text/css': 'CSS Stylesheet',
    'text/xml': 'XML Document',
    'application/xml': 'XML Document',
    
    // Text files
    'text/plain': 'Text File',
    'text/markdown': 'Markdown File',
    'text/csv': 'CSV File',
    
    // Images
    'image/jpeg': 'JPEG Image',
    'image/png': 'PNG Image',
    'image/gif': 'GIF Image',
    'image/svg+xml': 'SVG Image',
    'image/webp': 'WebP Image',
    'image/bmp': 'BMP Image',
    'image/tiff': 'TIFF Image',
    
    // Videos
    'video/mp4': 'MP4 Video',
    'video/avi': 'AVI Video',
    'video/mov': 'QuickTime Video',
    'video/wmv': 'WMV Video',
    'video/webm': 'WebM Video',
    'video/mkv': 'MKV Video',
    
    // Audio
    'audio/mpeg': 'MP3 Audio',
    'audio/mp3': 'MP3 Audio',
    'audio/wav': 'WAV Audio',
    'audio/flac': 'FLAC Audio',
    'audio/aac': 'AAC Audio',
    'audio/ogg': 'OGG Audio',
    'audio/wma': 'WMA Audio',
  } as const;
  
  const formattedType = typeMap[mimeType];
  if (formattedType) return formattedType;
  
  // Fallback: capitalize the subtype
  const parts = mimeType.split('/');
  const subtype = parts[1];
  if (subtype) {
    return `${subtype.toUpperCase()} File`;
  }
  
  return 'Unknown File Type';
}

/**
 * Format timestamp to localized string
 */
export function formatTimestamp(timestamp: string | Date): string {
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleString();
  } catch {
    return 'Invalid Date';
  }
}

/**
 * Format number with thousands separators
 */
export function formatNumber(num: number): string {
  if (!Number.isFinite(num)) return '0';
  return num.toLocaleString();
}