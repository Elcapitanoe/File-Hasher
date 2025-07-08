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
};

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

  // Check file size
  if (file.size < opts.minSize) {
    errors.push(`File is too small (minimum: ${formatBytes(opts.minSize)})`);
  }

  if (file.size > opts.maxSize) {
    errors.push(`File is too large (maximum: ${formatBytes(opts.maxSize)})`);
  }

  // Check file type if restrictions are specified
  if (opts.allowedTypes.length > 0 && !opts.allowedTypes.includes(file.type)) {
    errors.push(`File type "${file.type}" is not allowed`);
  }

  // Check for empty file name
  if (!file.name.trim()) {
    errors.push('File name cannot be empty');
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