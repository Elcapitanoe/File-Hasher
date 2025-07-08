import type { HashAlgorithm, ProcessingProgress } from '../types';
import { FileProcessingError } from '../types';

/**
 * Hash algorithms configuration with security information
 */
export const HASH_ALGORITHMS: Record<HashAlgorithm, { name: string; isSecure: boolean }> = {
  'MD5': { name: 'MD5', isSecure: false },
  'SHA-1': { name: 'SHA-1', isSecure: false },
  'SHA-256': { name: 'SHA-256', isSecure: true },
  'SHA-512': { name: 'SHA-512', isSecure: true },
} as const;

/**
 * Chunk size for streaming hash calculation (1MB)
 */
const CHUNK_SIZE = 1024 * 1024;

/**
 * Progress update interval in milliseconds
 */
const PROGRESS_UPDATE_INTERVAL = 100;

/**
 * Calculate hash for a file using streaming approach
 */
export async function calculateFileHash(
  file: File,
  algorithm: HashAlgorithm,
  onProgress?: (progress: ProcessingProgress) => void
): Promise<string> {
  try {
    const algorithmConfig = HASH_ALGORITHMS[algorithm];
    
    // For MD5, use fallback implementation since Web Crypto API doesn't support it
    if (algorithm === 'MD5') {
      return await calculateMD5Hash(file, onProgress);
    }
    
    // Use Web Crypto API for SHA algorithms
    return await calculateWebCryptoHash(file, algorithmConfig.name, onProgress);
  } catch (error) {
    throw new FileProcessingError(
      `Failed to calculate ${algorithm} hash: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'HASH_CALCULATION_ERROR',
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Calculate multiple hashes for a file in parallel
 */
export async function calculateAllHashes(
  file: File,
  onProgress?: (progress: ProcessingProgress) => void
): Promise<Record<string, string>> {
  const algorithms: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512'];
  const results: Record<string, string> = {};
  
  let completedAlgorithms = 0;
  const totalAlgorithms = algorithms.length;
  
  // Calculate hashes in parallel for better performance
  const hashPromises = algorithms.map(async (algorithm) => {
    const hash = await calculateFileHash(file, algorithm, (progress) => {
      if (onProgress) {
        // Adjust progress based on number of algorithms
        const adjustedProgress: ProcessingProgress = {
          ...progress,
          percentage: (progress.percentage + (completedAlgorithms * 100)) / totalAlgorithms,
        };
        onProgress(adjustedProgress);
      }
    });
    
    results[algorithm.toLowerCase().replace('-', '')] = hash;
    completedAlgorithms++;
    return hash;
  });
  
  await Promise.all(hashPromises);
  return results;
}

/**
 * Calculate hash using Web Crypto API with progress tracking
 */
async function calculateWebCryptoHash(
  file: File,
  algorithmName: string,
  onProgress?: (progress: ProcessingProgress) => void
): Promise<string> {
  const fileSize = file.size;
  
  // For small files, process directly
  if (fileSize <= CHUNK_SIZE) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest(algorithmName, arrayBuffer);
    return bufferToHex(hashBuffer);
  }
  
  // For large files, use streaming approach
  let processedBytes = 0;
  const startTime = performance.now();
  let lastProgressUpdate = startTime;
  
  // Read file in chunks and update hash
  const chunks: ArrayBuffer[] = [];
  
  for (let offset = 0; offset < fileSize; offset += CHUNK_SIZE) {
    const chunk = file.slice(offset, offset + CHUNK_SIZE);
    const arrayBuffer = await chunk.arrayBuffer();
    chunks.push(arrayBuffer);
    
    processedBytes += chunk.size;
    
    // Update progress at intervals
    const currentTime = performance.now();
    if (onProgress && (currentTime - lastProgressUpdate) >= PROGRESS_UPDATE_INTERVAL) {
      const elapsedTime = (currentTime - startTime) / 1000;
      const speed = processedBytes / elapsedTime;
      const remainingBytes = fileSize - processedBytes;
      const estimatedTimeRemaining = remainingBytes / speed;
      
      onProgress({
        bytesProcessed: processedBytes,
        totalBytes: fileSize,
        percentage: (processedBytes / fileSize) * 100,
        speed,
        estimatedTimeRemaining,
      });
      
      lastProgressUpdate = currentTime;
    }
    
    // Allow UI to update
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  // Combine all chunks and calculate hash
  const totalSize = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const combinedBuffer = new ArrayBuffer(totalSize);
  const combinedView = new Uint8Array(combinedBuffer);
  
  let offset = 0;
  for (const chunk of chunks) {
    combinedView.set(new Uint8Array(chunk), offset);
    offset += chunk.byteLength;
  }
  
  const hashBuffer = await crypto.subtle.digest(algorithmName, combinedBuffer);
  return bufferToHex(hashBuffer);
}

/**
 * MD5 hash implementation using crypto-js
 */
async function calculateMD5Hash(
  file: File,
  onProgress?: (progress: ProcessingProgress) => void
): Promise<string> {
  // Dynamic import to reduce bundle size
  const CryptoJS = await import('crypto-js');
  
  const fileSize = file.size;
  let processedBytes = 0;
  const startTime = performance.now();
  let lastProgressUpdate = startTime;
  
  // For small files, process directly
  if (fileSize <= CHUNK_SIZE) {
    const arrayBuffer = await file.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    return CryptoJS.MD5(wordArray).toString();
  }
  
  // For large files, use streaming approach
  const hasher = CryptoJS.algo.MD5.create();
  
  for (let offset = 0; offset < fileSize; offset += CHUNK_SIZE) {
    const chunk = file.slice(offset, offset + CHUNK_SIZE);
    const arrayBuffer = await chunk.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    
    hasher.update(wordArray);
    processedBytes += chunk.size;
    
    // Update progress at intervals
    const currentTime = performance.now();
    if (onProgress && (currentTime - lastProgressUpdate) >= PROGRESS_UPDATE_INTERVAL) {
      const elapsedTime = (currentTime - startTime) / 1000;
      const speed = processedBytes / elapsedTime;
      const remainingBytes = fileSize - processedBytes;
      const estimatedTimeRemaining = remainingBytes / speed;
      
      onProgress({
        bytesProcessed: processedBytes,
        totalBytes: fileSize,
        percentage: (processedBytes / fileSize) * 100,
        speed,
        estimatedTimeRemaining,
      });
      
      lastProgressUpdate = currentTime;
    }
    
    // Allow UI to update
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return hasher.finalize().toString();
}

/**
 * Convert ArrayBuffer to hex string
 */
function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = Array.from(byteArray, (value) => {
    const hexCode = value.toString(16);
    return hexCode.padStart(2, '0');
  });
  
  return hexCodes.join('');
}

/**
 * Generate a secure random UUID
 */
export function generateUUID(): string {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}