import type { MimeType } from '../types';

/**
 * Get appropriate Bootstrap icon class for file type
 */
export function getFileIcon(mimeType: MimeType): string {
  if (!mimeType) return 'bi-file-earmark';
  
  const iconMap: Record<string, string> = {
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