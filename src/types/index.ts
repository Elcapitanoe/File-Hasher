// Core application types and interfaces

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
  readonly sha1Hash: string;
  readonly sha256Hash: string;
  readonly sha384Hash: string;
  readonly sha512Hash: string;
  readonly processedAt: string;
}

export interface ValidationOptions {
  readonly maxSize?: number;
  readonly allowedTypes?: readonly string[] | null;
  readonly minSize?: number;
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly file?: FileInfo;
}

export interface SpeedStats {
  readonly min: number;
  readonly max: number;
  readonly avg: number;
  readonly current: number;
}

export interface UploadState {
  isProcessing: boolean;
  currentFile: File | null;
}

export type StatusType = 'info' | 'success' | 'warning' | 'error';

export type ButtonState = 'initial' | 'ready' | 'processing';

export interface ButtonConfig {
  readonly text: string;
  readonly disabled: boolean;
  readonly className: string;
}

export interface ProcessingStats {
  readonly processingSpeed: number;
  readonly fileSize: number;
  readonly totalTime: number;
  readonly status: string;
}

export type Theme = 'light' | 'dark';

export interface ThemeConfig {
  readonly theme: Theme;
  readonly iconClass: string;
}

// Error types
export class FileProcessingError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'FileProcessingError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: readonly string[]
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Utility types
export type ElementId = string;
export type CSSSelector = string;
export type MimeType = string;
export type HashAlgorithm = 'sha1' | 'sha256' | 'sha384' | 'sha512';