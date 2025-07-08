import type { ValidationOptions, ValidationResult } from '../types';
import { ValidationError } from '../types';
import { formatBytes } from './formatters';

/**
 * Default validation options
 */
const DEFAULT_OPTIONS: Required<ValidationOptions> = {
  maxSize: 1024 * 1024 * 1024, // 1GB
  minSize: 1, // 1 byte
  allowedTypes: [], // Empty array means all types allowed
} as const;

/**
 * Common file type groups for validation
 */
export const FILE_TYPE_GROUPS = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  documents: ['application/pdf', 'text/plain', 'application/msword'],
  archives: ['application/zip', 'application/x-rar-compressed', 'application/x-tar'],
  videos: ['video/mp4', 'video/avi', 'video/mov', 'video/webm'],
  audio: ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/ogg'],
} as const;

/**
 * Validate a file against the given options
 */
export function validateFile(
  file: File | null,
  options: ValidationOptions = {}
): ValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errors: string[] = [];

  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }

  // Check file size constraints
  if (file.size < opts.minSize) {
    errors.push(`File is too small (minimum: ${formatBytes(opts.minSize)})`);
  }

  if (file.size > opts.maxSize) {
    errors.push(`File is too large (maximum: ${formatBytes(opts.maxSize)})`);
  }

  // Check file type if restrictions are specified
  if (opts.allowedTypes.length > 0 && !opts.allowedTypes.includes(file.type)) {
    const allowedTypesStr = opts.allowedTypes.join(', ');
    errors.push(`File type "${file.type}" is not allowed. Allowed types: ${allowedTypesStr}`);
  }

  // Check for empty file name
  if (!file.name.trim()) {
    errors.push('File name cannot be empty');
  }

  // Check for suspicious file names
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    errors.push('File name contains invalid characters');
  }

  // Check for zero-byte files (unless explicitly allowed)
  if (file.size === 0 && opts.minSize > 0) {
    errors.push('File is empty (0 bytes)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate file and throw error if invalid
 */
export function validateFileOrThrow(
  file: File | null,
  options: ValidationOptions = {}
): asserts file is File {
  const result = validateFile(file, options);
  
  if (!result.isValid) {
    throw new ValidationError('File validation failed', result.errors);
  }
}

/**
 * Check if file type is in a specific group
 */
export function isFileTypeInGroup(
  fileType: string,
  group: keyof typeof FILE_TYPE_GROUPS
): boolean {
  return FILE_TYPE_GROUPS[group].includes(fileType as never);
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex === -1 ? '' : filename.slice(lastDotIndex + 1).toLowerCase();
}

/**
 * Validate file extension against MIME type
 */
export function validateFileExtension(file: File): boolean {
  const extension = getFileExtension(file.name);
  const mimeType = file.type;
  
  // Common extension to MIME type mappings
  const extensionMimeMap: Record<string, string[]> = {
    'jpg': ['image/jpeg'],
    'jpeg': ['image/jpeg'],
    'png': ['image/png'],
    'gif': ['image/gif'],
    'pdf': ['application/pdf'],
    'txt': ['text/plain'],
    'zip': ['application/zip'],
    'mp4': ['video/mp4'],
    'mp3': ['audio/mpeg', 'audio/mp3'],
  };
  
  const expectedMimeTypes = extensionMimeMap[extension];
  if (!expectedMimeTypes) {
    // Unknown extension, allow it
    return true;
  }
  
  return expectedMimeTypes.includes(mimeType);
}