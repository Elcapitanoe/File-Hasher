import CryptoJS from 'crypto-js';
import type { HashResult } from '../types';
import { FileProcessingError } from '../types';

export class FileProcessor {
  /**
   * Process file and generate cryptographic hashes
   */
  public async processFile(file: File): Promise<HashResult> {
    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await this.readFileAsArrayBuffer(file);
      
      // Convert to WordArray for CryptoJS
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
      
      // Generate all hashes in parallel for better performance
      const [sha1Hash, sha256Hash, sha384Hash, sha512Hash] = await Promise.all([
        this.generateHash(wordArray, 'sha1'),
        this.generateHash(wordArray, 'sha256'),
        this.generateHash(wordArray, 'sha384'),
        this.generateHash(wordArray, 'sha512')
      ]);
      
      return {
        name: file.name,
        type: file.type,
        size: file.size,
        sha1Hash,
        sha256Hash,
        sha384Hash,
        sha512Hash,
        processedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new FileProcessingError(
        'Failed to process file',
        'PROCESSING_ERROR',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file as ArrayBuffer'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  private async generateHash(
    wordArray: CryptoJS.lib.WordArray,
    algorithm: 'sha1' | 'sha256' | 'sha384' | 'sha512'
  ): Promise<string> {
    return new Promise((resolve) => {
      // Use setTimeout to make hash generation non-blocking
      setTimeout(() => {
        let hash: CryptoJS.lib.WordArray;
        
        switch (algorithm) {
          case 'sha1':
            hash = CryptoJS.SHA1(wordArray);
            break;
          case 'sha256':
            hash = CryptoJS.SHA256(wordArray);
            break;
          case 'sha384':
            hash = CryptoJS.SHA384(wordArray);
            break;
          case 'sha512':
            hash = CryptoJS.SHA512(wordArray);
            break;
        }
        
        resolve(hash.toString());
      }, 0);
    });
  }
}