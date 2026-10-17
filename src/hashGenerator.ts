import type { HashAlgorithm } from "./workers/hashWorker";
export type { HashAlgorithm };

interface HashTaskRequest {
  id: string;
  type: "hashText" | "hashFile";
  algorithm: HashAlgorithm;
  payload: string | File;
}

interface HashTaskResponse {
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

interface AlgorithmMetadata {
  name: string;
  description: string;
  outputBits: number;
  outputChars: number;
}

export class HashEngine {
  private static workerInstance: Worker | null = null;
  private static pendingResolvers = new Map<string, PendingResolver>();
  private static progressHandlers = new Map<string, (progress: number) => void>();
  private static sequenceId = 0;

  private static readonly METADATA: Record<HashAlgorithm, AlgorithmMetadata> = {
    md5: {
      name: "MD5",
      description: "Message Digest 5 (RFC 1321)",
      outputBits: 128,
      outputChars: 32,
    },
    sha1: {
      name: "SHA-1",
      description: "Secure Hash Algorithm 1 (FIPS PUB 180-4)",
      outputBits: 160,
      outputChars: 40,
    },
    sha256: {
      name: "SHA-256",
      description: "Secure Hash Algorithm 2 (FIPS PUB 180-4)",
      outputBits: 256,
      outputChars: 64,
    },
    sha512: {
      name: "SHA-512",
      description: "Secure Hash Algorithm 2 (FIPS PUB 180-4)",
      outputBits: 512,
      outputChars: 128,
    },
    "sha3-256": {
      name: "SHA3-256",
      description: "Secure Hash Algorithm 3 (FIPS PUB 202)",
      outputBits: 256,
      outputChars: 64,
    },
    "sha3-512": {
      name: "SHA3-512",
      description: "Secure Hash Algorithm 3 (FIPS PUB 202)",
      outputBits: 512,
      outputChars: 128,
    },
  };

  private static getWorker(): Worker {
    if (!this.workerInstance) {
      const worker = new Worker(
        new URL("./workers/hashWorker.ts", import.meta.url),
        { type: "module" }
      );
      worker.onmessage = (event: MessageEvent<HashTaskResponse>) => {
        this.handleMessage(event.data);
      };
      worker.onerror = (event: ErrorEvent) => {
        event.preventDefault();
        this.handleWorkerFailure(event.message || "Unknown worker error");
      };
      this.workerInstance = worker;
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
    if (!resolver) return;

    if (type === "success" && typeof result === "string") {
      resolver.resolve(result);
    } else {
      resolver.reject(new Error(error || "Unknown hashing failure"));
    }

    this.cleanupTask(id);
  }

  private static handleWorkerFailure(message: string): void {
    const error = new Error(`Worker execution failed: ${message}`);
    this.workerInstance?.terminate();
    this.workerInstance = null;

    for (const [id, resolver] of this.pendingResolvers) {
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
    return `hash_task_${Date.now()}_${this.sequenceId}`;
  }

  private static dispatch(
    request: HashTaskRequest,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.pendingResolvers.set(request.id, { resolve, reject });
      if (onProgress) this.progressHandlers.set(request.id, onProgress);

      try {
        this.getWorker().postMessage(request);
      } catch (error) {
        this.cleanupTask(request.id);
        reject(error instanceof Error ? error : new Error("Unable to start hashing worker"));
      }
    });
  }

  public static cancelPendingTasks(): void {
    if (this.pendingResolvers.size === 0) return;

    this.workerInstance?.terminate();
    this.workerInstance = null;
    const error = new DOMException("Hashing operation cancelled", "AbortError");

    for (const [id, resolver] of this.pendingResolvers) {
      resolver.reject(error);
      this.cleanupTask(id);
    }
  }

  public static hashText(algorithm: HashAlgorithm, input: string): Promise<string> {
    if (!input) return Promise.resolve("");

    return this.dispatch({
      id: this.nextId(),
      type: "hashText",
      algorithm,
      payload: input,
    });
  }

  public static hashFile(
    algorithm: HashAlgorithm,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    if (!file) return Promise.resolve("");

    return this.dispatch(
      {
        id: this.nextId(),
        type: "hashFile",
        algorithm,
        payload: file,
      },
      onProgress
    );
  }

  public static getMetadata(algorithm: HashAlgorithm): AlgorithmMetadata {
    return this.METADATA[algorithm];
  }
}
