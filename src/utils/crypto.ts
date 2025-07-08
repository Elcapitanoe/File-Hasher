import type { HashAlgorithm, ProcessingProgress } from '../types';
import { FileProcessingError } from '../types';

/**
 * Hash algorithms configuration
 */
export const HASH_ALGORITHMS: Record<HashAlgorithm, string> = {
  'MD5': 'MD5',
  'SHA-1': 'SHA-1',
  'SHA-256': 'SHA-256',
  'SHA-512': 'SHA-512',
};

/**
 * Chunk size for streaming hash calculation (1MB)
 */
const CHUNK_SIZE = 1024 * 1024;

/**
 * Calculate hash for a file using streaming approach
 */
export async function calculateFileHash(
  file: File,
  algorithm: HashAlgorithm,
  onProgress?: (progress: ProcessingProgress) => void
): Promise<string> {
  try {
    const algorithmName = HASH_ALGORITHMS[algorithm];
    
    // For MD5, we'll use a fallback implementation since Web Crypto API doesn't support it
    if (algorithm === 'MD5') {
      return await calculateMD5Hash(file, onProgress);
    }
    
    const hashBuffer = await crypto.subtle.digest(
      algorithmName,
      await file.arrayBuffer()
    );
    
    return bufferToHex(hashBuffer);
  } catch (error) {
    throw new FileProcessingError(
      `Failed to calculate ${algorithm} hash`,
      'HASH_CALCULATION_ERROR',
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

/**
 * Calculate multiple hashes for a file
 */
export async function calculateAllHashes(
  file: File,
  onProgress?: (progress: ProcessingProgress) => void
): Promise<Record<string, string>> {
  const startTime = performance.now();
  const algorithms: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512'];
  const results: Record<string, string> = {};
  
  let completedAlgorithms = 0;
  
  // Calculate hashes in parallel for better performance
  await Promise.all(
    algorithms.map(async algorithm => {
      const hash = await calculateFileHash(file, algorithm, progress => {
        if (onProgress) {
          // Adjust progress based on number of algorithms
          const adjustedProgress: ProcessingProgress = {
            ...progress,
            percentage: (progress.percentage + (completedAlgorithms * 100)) / algorithms.length,
          };
          onProgress(adjustedProgress);
        }
      });
      
      results[algorithm.toLowerCase().replace('-', '')] = hash;
      completedAlgorithms++;
    })
  );
  
  return results;
}

/**
 * Convert ArrayBuffer to hex string
 */
function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = [...byteArray].map(value => {
    const hexCode = value.toString(16);
    return hexCode.padStart(2, '0');
  });
  
  return hexCodes.join('');
}

/**
 * MD5 hash implementation (fallback for Web Crypto API)
 */
async function calculateMD5Hash(
  file: File,
  onProgress?: (progress: ProcessingProgress) => void
): Promise<string> {
  // Import crypto-js for MD5 since Web Crypto API doesn't support it
  const CryptoJS = await import('crypto-js');
  
  const fileSize = file.size;
  let processedBytes = 0;
  const startTime = performance.now();
  
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
    
    if (onProgress) {
      const currentTime = performance.now();
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
    }
    
    // Allow UI to update
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return hasher.finalize().toString();
}

/**
 * Generate a secure random UUID
 */
export function generateUUID(): string {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}