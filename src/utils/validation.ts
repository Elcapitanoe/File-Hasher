import type { ValidationOptions, ValidationResult, FileInfo } from '../types';
import { formatBytes } from './formatters';
import { ValidationError } from '../types';

/**
 * Validate file type and size with comprehensive checks
 */
export function validateFile(file: File | null, options: ValidationOptions = {}): ValidationResult {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB default
    allowedTypes = null,
    minSize = 1
  } = options;
  
  const errors: string[] = [];
  
  if (!file) {
    errors.push('No file provided');
    return { valid: false, errors };
  }
  
  if (file.size < minSize) {
    errors.push('File is too small');
  }
  
  if (file.size > maxSize) {
    errors.push(`File size exceeds ${formatBytes(maxSize, false)} limit`);
  }
  
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    errors.push('File type not allowed');
  }
  
  const fileInfo: FileInfo = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified
  };
  
  return {
    valid: errors.length === 0,
    errors,
    file: fileInfo
  };
}

/**
 * Validate and throw error if file is invalid
 */
export function validateFileOrThrow(file: File | null, options: ValidationOptions = {}): FileInfo {
  const result = validateFile(file, options);
  
  if (!result.valid) {
    throw new ValidationError('File validation failed', result.errors);
  }
  
  return result.file!;
}