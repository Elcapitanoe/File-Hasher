/**
 * Get appropriate icon for file type
 */
export function getFileIcon(mimeType: string): string {
  if (!mimeType) return 'file';
  
  const iconMap: Record<string, string> = {
    // Images
    'image/jpeg': 'image',
    'image/jpg': 'image',
    'image/png': 'image',
    'image/gif': 'image',
    'image/svg+xml': 'image',
    'image/webp': 'image',
    'image/bmp': 'image',
    'image/tiff': 'image',
    
    // Videos
    'video/mp4': 'video',
    'video/avi': 'video',
    'video/mov': 'video',
    'video/wmv': 'video',
    'video/flv': 'video',
    'video/webm': 'video',
    'video/mkv': 'video',
    
    // Audio
    'audio/mp3': 'music',
    'audio/mpeg': 'music',
    'audio/wav': 'music',
    'audio/flac': 'music',
    'audio/aac': 'music',
    'audio/ogg': 'music',
    'audio/wma': 'music',
    
    // Documents
    'application/pdf': 'file-text',
    'application/msword': 'file-text',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'file-text',
    'application/vnd.ms-excel': 'file-text',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'file-text',
    'application/vnd.ms-powerpoint': 'file-text',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'file-text',
    
    // Text files
    'text/plain': 'file-text',
    'text/html': 'code',
    'text/css': 'code',
    'text/javascript': 'code',
    'text/typescript': 'code',
    'text/json': 'code',
    'text/xml': 'code',
    'text/csv': 'file-text',
    
    // Archives
    'application/zip': 'archive',
    'application/x-rar-compressed': 'archive',
    'application/x-tar': 'archive',
    'application/gzip': 'archive',
    'application/x-7z-compressed': 'archive',
    
    // Code files
    'application/json': 'code',
    'application/javascript': 'code',
    'application/typescript': 'code',
    'application/xml': 'code',
  };
  
  // Check for exact match first
  if (iconMap[mimeType]) {
    return iconMap[mimeType];
  }
  
  // Check for category match
  const category = mimeType.split('/')[0];
  const categoryMap: Record<string, string> = {
    'image': 'image',
    'video': 'video',
    'audio': 'music',
    'text': 'file-text',
    'application': 'file',
  };
  
  return categoryMap[category] || 'file';
}