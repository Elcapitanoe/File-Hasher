// Core Types
export interface FileInfo {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly lastModified: number;
}

export interface HashResult {
  readonly name: string;
  readonly type: string;
  readonly size: number;
  readonly md5: string;
  readonly sha1: string;
  readonly sha256: string;
  readonly sha512: string;
  readonly processedAt: string;
  readonly processingTime: number;
}

export interface ProcessingProgress {
  readonly bytesProcessed: number;
  readonly totalBytes: number;
  readonly percentage: number;
  readonly speed: number;
  readonly estimatedTimeRemaining: number;
}

export interface ValidationOptions {
  readonly maxSize?: number;
  readonly allowedTypes?: readonly string[];
  readonly minSize?: number;
}

export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
}

// UI Types
export type Theme = 'light' | 'dark';

export type ProcessingState = 'idle' | 'processing' | 'completed' | 'error';

export interface UIState {
  readonly theme: Theme;
  readonly processingState: ProcessingState;
  readonly selectedFile: File | null;
  readonly hashResult: HashResult | null;
  readonly progress: ProcessingProgress | null;
  readonly error: string | null;
}

// Hash Algorithm Types
export type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

export interface HashConfig {
  readonly algorithm: HashAlgorithm;
  readonly label: string;
  readonly description: string;
  readonly isSecure: boolean;
}

// Error Types
export class FileProcessingError extends Error {
  public readonly code: string;
  public readonly originalError?: Error;

  constructor(
    message: string,
    code: string,
    originalError?: Error
  ) {
    super(message);
    this.name = 'FileProcessingError';
    this.code = code;
    this.originalError = originalError;
  }
}

export class ValidationError extends Error {
  public readonly errors: readonly string[];

  constructor(
    message: string,
    errors: readonly string[]
  ) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

// Utility Types
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & Record<string, never>;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredKeys<T> = {
  [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? never : K;
}[keyof T];

export type OptionalKeys<T> = {
  [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? K : never;
}[keyof T];