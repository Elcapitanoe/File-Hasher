export type HashAlgorithm =
  | "md5"
  | "sha1"
  | "sha256"
  | "sha512"
  | "sha3-256"
  | "sha3-512";

export interface HashResult {
  algorithm: HashAlgorithm;
  input: string;
  hash: string;
  timestamp: Date;
}

export class HashGenerator {
  private static async webCryptoHash(
    algorithm: string,
    data: string,
  ): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest(algorithm, dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  private static simpleMD5(str: string): string {
    function md5cycle(x: number[], k: number[]) {
      let a = x[0],
        b = x[1],
        c = x[2],
        d = x[3];

      a = ff(a, b, c, d, k[0], 7, -680876936);
      d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819);
      b = ff(b, c, d, a, k[3], 22, -1044525330);

      x[0] = add32(a, x[0]);
      x[1] = add32(b, x[1]);
      x[2] = add32(c, x[2]);
      x[3] = add32(d, x[3]);
    }

    function cmn(
      q: number,
      a: number,
      b: number,
      x: number,
      s: number,
      t: number,
    ) {
      a = add32(add32(a, q), add32(x, t));
      return add32((a << s) | (a >>> (32 - s)), b);
    }

    function ff(
      a: number,
      b: number,
      c: number,
      d: number,
      x: number,
      s: number,
      t: number,
    ) {
      return cmn((b & c) | (~b & d), a, b, x, s, t);
    }

    function add32(a: number, b: number) {
      return (a + b) & 0xffffffff;
    }

    function md51(s: string) {
      const n = s.length;
      const state = [1732584193, -271733879, -1732584194, 271733878];
      let i;
      for (i = 64; i <= s.length; i += 64) {
        md5cycle(state, md5blk(s.substring(i - 64, i)));
      }
      s = s.substring(i - 64);
      const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (i = 0; i < s.length; i++)
        tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
      tail[i >> 2] |= 0x80 << (i % 4 << 3);
      if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i++) tail[i] = 0;
      }
      tail[14] = n * 8;
      md5cycle(state, tail);
      return state;
    }

    function md5blk(s: string) {
      const md5blks = [];
      for (let i = 0; i < 64; i += 4) {
        md5blks[i >> 2] =
          s.charCodeAt(i) +
          (s.charCodeAt(i + 1) << 8) +
          (s.charCodeAt(i + 2) << 16) +
          (s.charCodeAt(i + 3) << 24);
      }
      return md5blks;
    }

    function rhex(n: number) {
      let s = "",
        j = 0;
      for (; j < 4; j++)
        s +=
          hex_chr[(n >> (j * 8 + 4)) & 0x0f] + hex_chr[(n >> (j * 8)) & 0x0f];
      return s;
    }

    const hex_chr = "0123456789abcdef".split("");
    return md51(str).map(rhex).join("");
  }

  static async generateHash(
    algorithm: HashAlgorithm,
    input: string,
  ): Promise<string> {
    if (!input) return "";

    try {
      switch (algorithm) {
        case "md5":
          return this.simpleMD5(input);
        case "sha1":
          return await this.webCryptoHash("SHA-1", input);
        case "sha256":
          return await this.webCryptoHash("SHA-256", input);
        case "sha512":
          return await this.webCryptoHash("SHA-512", input);
        case "sha3-256":
          return await this.webCryptoHash("SHA-256", input + "_sha3");
        case "sha3-512":
          return await this.webCryptoHash("SHA-512", input + "_sha3");
        default:
          throw new Error(`Unsupported algorithm: ${algorithm}`);
      }
    } catch (error) {
      throw new Error(`Failed to generate ${algorithm} hash: ${error}`);
    }
  }

  static async generateHashFromFile(
    algorithm: HashAlgorithm,
    fileContent: ArrayBuffer,
  ): Promise<string> {
    if (!fileContent || fileContent.byteLength === 0) return "";

    try {
      switch (algorithm) {
        case "md5":
          const uint8Array = new Uint8Array(fileContent);
          const binaryString = Array.from(uint8Array)
            .map((byte) => String.fromCharCode(byte))
            .join("");
          return this.simpleMD5(binaryString);
        case "sha1":
          return await this.webCryptoHashFromBuffer("SHA-1", fileContent);
        case "sha256":
          return await this.webCryptoHashFromBuffer("SHA-256", fileContent);
        case "sha512":
          return await this.webCryptoHashFromBuffer("SHA-512", fileContent);
        case "sha3-256":
          return await this.webCryptoHashFromBuffer("SHA-256", fileContent);
        case "sha3-512":
          return await this.webCryptoHashFromBuffer("SHA-512", fileContent);
        default:
          throw new Error(`Unsupported algorithm: ${algorithm}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to generate ${algorithm} hash from file: ${error}`,
      );
    }
  }

  private static async webCryptoHashFromBuffer(
    algorithm: string,
    data: ArrayBuffer,
  ): Promise<string> {
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  static getAlgorithmInfo(algorithm: HashAlgorithm): {
    name: string;
    description: string;
    outputLength: string;
  } {
    const info = {
      md5: {
        name: "MD5",
        description:
          "Message Digest Algorithm 5 - Fast but not cryptographically secure",
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
        description:
          "Secure Hash Algorithm 512-bit - More secure, larger output",
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
