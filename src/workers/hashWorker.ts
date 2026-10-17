import { md5, sha1 } from "@noble/hashes/legacy.js";
import { sha256, sha512 } from "@noble/hashes/sha2.js";
import { sha3_256, sha3_512 } from "@noble/hashes/sha3.js";
import { bytesToHex } from "@noble/hashes/utils.js";

export type HashAlgorithm =
  | "md5"
  | "sha1"
  | "sha256"
  | "sha512"
  | "sha3-256"
  | "sha3-512";

interface HashMessage {
  id: string;
  type: "hashText" | "hashFile";
  algorithm: HashAlgorithm;
  payload: string | File;
}

const CHUNK_SIZE = 4 * 1024 * 1024;

self.onmessage = async (event: MessageEvent<HashMessage>) => {
  const { id, type, algorithm, payload } = event.data;

  try {
    if (type === "hashText" && typeof payload === "string") {
      const result = hashText(algorithm, payload);
      self.postMessage({ id, type: "success", result });
      return;
    }

    if (type === "hashFile" && payload instanceof File) {
      await hashFile(id, algorithm, payload);
      return;
    }

    throw new Error("Invalid hashing task payload");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Processing error";
    self.postMessage({ id, type: "error", error: message });
  }
};

function hashText(algorithm: HashAlgorithm, text: string): string {
  const hasher = createHasher(algorithm);
  hasher.update(new TextEncoder().encode(text));
  return bytesToHex(hasher.digest());
}

async function hashFile(
  id: string,
  algorithm: HashAlgorithm,
  file: File
): Promise<void> {
  const hasher = createHasher(algorithm);
  let offset = 0;
  const totalSize = file.size;

  while (offset < totalSize) {
    const sliceEnd = Math.min(offset + CHUNK_SIZE, totalSize);
    const chunk = new Uint8Array(await file.slice(offset, sliceEnd).arrayBuffer());
    hasher.update(chunk);
    offset = sliceEnd;

    self.postMessage({
      id,
      type: "progress",
      progress: Math.round((offset / totalSize) * 100),
    });
  }

  self.postMessage({ id, type: "success", result: bytesToHex(hasher.digest()) });
}

function createHasher(algorithm: HashAlgorithm) {
  switch (algorithm) {
    case "md5":
      return md5.create();
    case "sha1":
      return sha1.create();
    case "sha256":
      return sha256.create();
    case "sha512":
      return sha512.create();
    case "sha3-256":
      return sha3_256.create();
    case "sha3-512":
      return sha3_512.create();
    default: {
      const unsupported: never = algorithm;
      throw new Error(`Unsupported algorithm: ${unsupported}`);
    }
  }
}
