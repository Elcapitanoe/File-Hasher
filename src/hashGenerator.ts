import { type HashAlgorithm } from "./workers/hashWorker";
export type { HashAlgorithm };

export interface HashResult {
  algorithm: HashAlgorithm;
  input: string;
  hash: string;
  timestamp: Date;
}

export class HashGenerator {
  private static worker: Worker | null = null;
  private static resolvers = new Map<string, { resolve: (val: any) => void; reject: (err: any) => void }>();
  private static progressCallbacks = new Map<string, (progress: number) => void>();
  private static messageIdCounter = 0;

  private static getWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(new URL('./workers/hashWorker.ts', import.meta.url), { type: 'module' });
      this.worker.onmessage = (e) => this.handleWorkerMessage(e);
      this.worker.onerror = (e) => {
        console.error("Hash Worker Error:", e);
      };
    }
    return this.worker;
  }

  private static handleWorkerMessage(e: MessageEvent) {
    const { id, type, result, error, progress } = e.data;
    
    if (type === 'progress') {
      const cb = this.progressCallbacks.get(id);
      if (cb) cb(progress);
      return;
    }

    const resolver = this.resolvers.get(id);
    if (!resolver) return;

    if (type === 'success') {
      resolver.resolve(result);
    } else {
      resolver.reject(new Error(error));
    }

    this.resolvers.delete(id);
    this.progressCallbacks.delete(id);
  }

  private static createMessageId(): string {
    return `msg_${++this.messageIdCounter}_${Date.now()}`;
  }

  static async generateHash(
    algorithm: HashAlgorithm,
    input: string,
  ): Promise<string> {
    if (!input) return "";

    const id = this.createMessageId();
    return new Promise((resolve, reject) => {
      this.resolvers.set(id, { resolve, reject });
      this.getWorker().postMessage({ id, type: 'hashText', algorithm, payload: input });
    });
  }

  static async generateHashFromFile(
    algorithm: HashAlgorithm,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    if (!file || file.size === 0) return "";

    const id = this.createMessageId();
    return new Promise((resolve, reject) => {
      this.resolvers.set(id, { resolve, reject });
      if (onProgress) {
        this.progressCallbacks.set(id, onProgress);
      }
      this.getWorker().postMessage({ id, type: 'hashFile', algorithm, payload: file });
    });
  }

  static getAlgorithmInfo(algorithm: HashAlgorithm): {
    name: string;
    description: string;
    outputLength: string;
  } {
    const info = {
      md5: {
        name: "MD5",
        description: "Message Digest 5 - Fast but cryptographically broken",
        outputLength: "128 bits (32 hex chars)",
      },
      sha1: {
        name: "SHA-1",
        description: "Secure Hash Algorithm 1 - Deprecated for security",
        outputLength: "160 bits (40 hex chars)",
      },
      sha256: {
        name: "SHA-256",
        description: "Secure Hash Algorithm 256-bit - Widely used and secure",
        outputLength: "256 bits (64 hex chars)",
      },
      sha512: {
        name: "SHA-512",
        description: "Secure Hash Algorithm 512-bit - Highly secure, large output",
        outputLength: "512 bits (128 hex chars)",
      },
      "sha3-256": {
        name: "SHA-3 256",
        description: "Latest SHA-3 standard with 256-bit output",
        outputLength: "256 bits (64 hex chars)",
      },
      "sha3-512": {
        name: "SHA-3 512",
        description: "Latest SHA-3 standard with 512-bit output",
        outputLength: "512 bits (128 hex chars)",
      },
    };
    return info[algorithm];
  }
}
