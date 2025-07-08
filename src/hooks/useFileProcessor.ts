import { useState, useCallback } from 'react';
import type { HashResult, ProcessingProgress, ProcessingState } from '../types';
import { calculateAllHashes } from '../utils/crypto';
import { validateFileOrThrow } from '../utils/validation';
import { FileProcessingError } from '../types';

interface UseFileProcessorReturn {
  processingState: ProcessingState;
  progress: ProcessingProgress | null;
  result: HashResult | null;
  error: string | null;
  processFile: (file: File) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for processing files and calculating hashes
 */
export function useFileProcessor(): UseFileProcessorReturn {
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const [result, setResult] = useState<HashResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    try {
      // Reset state
      setError(null);
      setResult(null);
      setProgress(null);
      setProcessingState('processing');

      // Validate file
      validateFileOrThrow(file, {
        maxSize: 1024 * 1024 * 1024, // 1GB
        minSize: 1,
      });

      const startTime = performance.now();

      // Calculate hashes with progress tracking
      const hashes = await calculateAllHashes(file, (progressData) => {
        setProgress(progressData);
      });

      const endTime = performance.now();
      const processingTime = (endTime - startTime) / 1000;

      // Create result
      const hashResult: HashResult = {
        name: file.name,
        type: file.type,
        size: file.size,
        md5: hashes.md5,
        sha1: hashes.sha1,
        sha256: hashes.sha256,
        sha512: hashes.sha512,
        processedAt: new Date().toISOString(),
        processingTime,
      };

      setResult(hashResult);
      setProcessingState('completed');
      
      // Set final progress
      setProgress({
        bytesProcessed: file.size,
        totalBytes: file.size,
        percentage: 100,
        speed: file.size / processingTime,
        estimatedTimeRemaining: 0,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setProcessingState('error');
      setProgress(null);
      
      console.error('File processing error:', err);
    }
  }, []);

  const reset = useCallback(() => {
    setProcessingState('idle');
    setProgress(null);
    setResult(null);
    setError(null);
  }, []);

  return {
    processingState,
    progress,
    result,
    error,
    processFile,
    reset,
  };
}