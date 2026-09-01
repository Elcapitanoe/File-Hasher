import type { HashAlgorithm } from "./workers/hashWorker";
export type { HashAlgorithm };

export interface HashTaskRequest {
  id: string;
  type: "hashText" | "hashFile";
  algorithm: HashAlgorithm;
  payload: string | File;
}

export interface HashTaskResponse {
  id: string;
  type: "success" | "error" | "progress";
  result?: string;
  error?: string;
  progress?: number;
}

interface PendingResolver {
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}

export interface AlgorithmMetadata {
  name: string;
  description: string;
  outputLength: string;
}

export class HashEngine {
  private static workerInstance: Worker | null = null;
  private static pendingResolvers = new Map<string, PendingResolver>();
  private static progressHandlers = new Map<string, (progress: number) => void>();
  private static sequenceId = 0;

  private static readonly METADATA: Record<HashAlgorithm, AlgorithmMetadata> = {
    md5: {
      name: "MD5",
      description: "Message Digest Algorithm 5 (128-bit legacy digest)",
      outputLength: "128 bits (32 hex characters)",
    },
    sha1: {
      name: "SHA-1",
      description: "Secure Hash Algorithm 1 (160-bit legacy digest)",
      outputLength: "160 bits (40 hex characters)",
    },
    sha256: {
      name: "SHA-256",
      description: "Secure Hash Algorithm 2 (256-bit standard)",
      outputLength: "256 bits (64 hex characters)",
    },
    sha512: {
      name: "SHA-512",
      description: "Secure Hash Algorithm 2 (512-bit standard)",
      outputLength: "512 bits (128 hex characters)",
    },
    "sha3-256": {
      name: "SHA3-256",
      description: "Keccak-based Secure Hash Algorithm 3 (256-bit)",
      outputLength: "256 bits (64 hex characters)",
    },
    "sha3-512": {
      name: "SHA3-512",
      description: "Keccak-based Secure Hash Algorithm 3 (512-bit)",
      outputLength: "512 bits (128 hex characters)",
    },
  };

  private static getWorker(): Worker {
    if (!this.workerInstance) {
      this.workerInstance = new Worker(
        new URL("./workers/hashWorker.ts", import.meta.url),
        { type: "module" }
      );
      this.workerInstance.onmessage = (event: MessageEvent<HashTaskResponse>) => {
        this.handleMessage(event.data);
      };
      this.workerInstance.onerror = (event: ErrorEvent) => {
        this.handleWorkerFailure(event.message);
      };
    }
    return this.workerInstance;
  }

  private static handleMessage(data: HashTaskResponse): void {
    const { id, type, result, error, progress } = data;

    if (type === "progress") {
      const handler = this.progressHandlers.get(id);
      if (handler && typeof progress === "number") {
        handler(progress);
      }
      return;
    }

    const resolver = this.pendingResolvers.get(id);
    if (!resolver) {
      return;
    }

    if (type === "success" && typeof result === "string") {
      resolver.resolve(result);
    } else {
      resolver.reject(new Error(error || "Unknown hashing failure"));
    }

    this.cleanupTask(id);
  }

  private static handleWorkerFailure(message: string): void {
    const error = new Error(`Worker execution failed: ${message}`);
    for (const [id, resolver] of this.pendingResolvers.entries()) {
      resolver.reject(error);
      this.cleanupTask(id);
    }
  }

  private static cleanupTask(id: string): void {
    this.pendingResolvers.delete(id);
    this.progressHandlers.delete(id);
  }

  private static nextId(): string {
    this.sequenceId += 1;
    return `hash_task_${this.sequenceId}_${Date.now()}`;
  }

  public static async hashText(
    algorithm: HashAlgorithm,
    input: string
  ): Promise<string> {
    if (!input) {
      return "";
    }

    const id = this.nextId();
    return new Promise<string>((resolve, reject) => {
      this.pendingResolvers.set(id, { resolve, reject });
      this.getWorker().postMessage({
        id,
        type: "hashText",
        algorithm,
        payload: input,
      } as HashTaskRequest);
    });
  }

  public static async hashFile(
    algorithm: HashAlgorithm,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    if (!file || file.size === 0) {
      return "";
    }

    const id = this.nextId();
    return new Promise<string>((resolve, reject) => {
      this.pendingResolvers.set(id, { resolve, reject });
      if (onProgress) {
        this.progressHandlers.set(id, onProgress);
      }
      this.getWorker().postMessage({
        id,
        type: "hashFile",
        algorithm,
        payload: file,
      } as HashTaskRequest);
    });
  }

  public static getMetadata(algorithm: HashAlgorithm): AlgorithmMetadata {
    return this.METADATA[algorithm];
  }
}
