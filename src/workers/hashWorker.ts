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

self.onmessage = async (e: MessageEvent<HashMessage>) => {
  const { id, type, algorithm, payload } = e.data;

  try {
    if (type === "hashText") {
      const result = await processText(algorithm, payload as string);
      self.postMessage({ id, type: "success", result });
    } else if (type === "hashFile") {
      await processFile(id, algorithm, payload as File);
    }
  } catch (error) {
    self.postMessage({ id, type: "error", error: (error as Error).message });
  }
};

async function processText(algorithm: HashAlgorithm, text: string): Promise<string> {
  // Use Web Crypto API where possible for blazing speed on text
  if (algorithm === "sha1" || algorithm === "sha256" || algorithm === "sha512") {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(
      algorithm === "sha1" ? "SHA-1" : algorithm === "sha256" ? "SHA-256" : "SHA-512",
      data
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Fallback to CryptoJS for MD5 and SHA3
  switch (algorithm) {
    case "md5":
      return CryptoJS.MD5(text).toString();
    case "sha3-256":
      return CryptoJS.SHA3(text, { outputLength: 256 }).toString();
    case "sha3-512":
      return CryptoJS.SHA3(text, { outputLength: 512 }).toString();
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }
}

async function processFile(id: string, algorithm: HashAlgorithm, file: File): Promise<void> {
  // We use CryptoJS progressive hashing for files to allow chunking and progress reporting
  const algo = createCryptoJSAlgo(algorithm);
  const chunkSize = 2 * 1024 * 1024; // 2MB chunks
  let offset = 0;

  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize);
    const arrayBuffer = await chunk.arrayBuffer();
    const wordArray = arrayBufferToWordArray(arrayBuffer);
    
    algo.update(wordArray);
    
    offset += chunkSize;
    const progress = Math.min(100, Math.round((offset / file.size) * 100));
    
    self.postMessage({ id, type: "progress", progress });
  }

  const hash = algo.finalize().toString(CryptoJS.enc.Hex);
  self.postMessage({ id, type: "success", result: hash });
}

function createCryptoJSAlgo(algorithm: HashAlgorithm) {
  switch (algorithm) {
    case "md5": return CryptoJS.algo.MD5.create();
    case "sha1": return CryptoJS.algo.SHA1.create();
    case "sha256": return CryptoJS.algo.SHA256.create();
    case "sha512": return CryptoJS.algo.SHA512.create();
    case "sha3-256": return CryptoJS.algo.SHA3.create({ outputLength: 256 });
    case "sha3-512": return CryptoJS.algo.SHA3.create({ outputLength: 512 });
    default: throw new Error(`Unsupported algorithm: ${algorithm}`);
  }
}

function arrayBufferToWordArray(arrayBuffer: ArrayBuffer) {
  const u8 = new Uint8Array(arrayBuffer);
  const words: number[] = [];
  for (let i = 0; i < u8.length; i += 4) {
    words.push(
      (u8[i] << 24) |
      (u8[i + 1] << 16) |
      (u8[i + 2] << 8) |
      (u8[i + 3])
    );
  }
  return CryptoJS.lib.WordArray.create(words, u8.length);
}
