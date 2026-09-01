import CryptoJS from "crypto-js";

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
    if (type === "hashText") {
      const result = await processText(algorithm, payload as string);
      self.postMessage({ id, type: "success", result });
    } else if (type === "hashFile") {
      await processFile(id, algorithm, payload as File);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Processing error";
    self.postMessage({ id, type: "error", error: message });
  }
};

async function processText(algorithm: HashAlgorithm, text: string): Promise<string> {
  if (algorithm === "sha1" || algorithm === "sha256" || algorithm === "sha512") {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const algoName = algorithm === "sha1" ? "SHA-1" : algorithm === "sha256" ? "SHA-256" : "SHA-512";
    const hashBuffer = await crypto.subtle.digest(algoName, data);
    return bufferToHex(hashBuffer);
  }

  switch (algorithm) {
    case "md5":
      return CryptoJS.MD5(text).toString(CryptoJS.enc.Hex);
    case "sha3-256":
      return CryptoJS.SHA3(text, { outputLength: 256 }).toString(CryptoJS.enc.Hex);
    case "sha3-512":
      return CryptoJS.SHA3(text, { outputLength: 512 }).toString(CryptoJS.enc.Hex);
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }
}

async function processFile(
  id: string,
  algorithm: HashAlgorithm,
  file: File
): Promise<void> {
  const hasher = createHasher(algorithm);
  let offset = 0;
  const totalSize = file.size;

  while (offset < totalSize) {
    const sliceEnd = Math.min(offset + CHUNK_SIZE, totalSize);
    const chunk = file.slice(offset, sliceEnd);
    const arrayBuffer = await chunk.arrayBuffer();
    const wordArray = arrayBufferToWordArray(arrayBuffer);

    hasher.update(wordArray);
    offset = sliceEnd;

    const progress = totalSize > 0 ? Math.round((offset / totalSize) * 100) : 100;
    self.postMessage({ id, type: "progress", progress });
  }

  const result = hasher.finalize().toString(CryptoJS.enc.Hex);
  self.postMessage({ id, type: "success", result });
}

function createHasher(algorithm: HashAlgorithm) {
  switch (algorithm) {
    case "md5":
      return CryptoJS.algo.MD5.create();
    case "sha1":
      return CryptoJS.algo.SHA1.create();
    case "sha256":
      return CryptoJS.algo.SHA256.create();
    case "sha512":
      return CryptoJS.algo.SHA512.create();
    case "sha3-256":
      return CryptoJS.algo.SHA3.create({ outputLength: 256 });
    case "sha3-512":
      return CryptoJS.algo.SHA3.create({ outputLength: 512 });
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }
}

function bufferToHex(buffer: ArrayBuffer): string {
  const view = new DataView(buffer);
  let hex = "";
  for (let i = 0; i < view.byteLength; i += 4) {
    if (i + 4 <= view.byteLength) {
      hex += view.getUint32(i).toString(16).padStart(8, "0");
    } else {
      for (let j = i; j < view.byteLength; j++) {
        hex += view.getUint8(j).toString(16).padStart(2, "0");
      }
    }
  }
  return hex;
}

function arrayBufferToWordArray(arrayBuffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer);
  const words: number[] = [];
  for (let i = 0; i < uint8Array.length; i += 4) {
    words.push(
      (uint8Array[i] << 24) |
      (uint8Array[i + 1] << 16) |
      (uint8Array[i + 2] << 8) |
      (uint8Array[i + 3] ?? 0)
    );
  }
  return CryptoJS.lib.WordArray.create(words, uint8Array.length);
}
