# File Hasher

Client-side cryptographic hash generator built with TypeScript and Vite. Computes digests locally in the browser using Web Crypto API and Web Workers with streaming chunk processing.

## Supported Algorithms

| Algorithm | Standard / Specification | Output Size | Engine |
| :--- | :--- | :--- | :--- |
| **MD5** | RFC 1321 | 128 bits (32 hex characters) | CryptoJS (Streamed) |
| **SHA-1** | FIPS PUB 180-4 | 160 bits (40 hex characters) | Web Crypto API / CryptoJS |
| **SHA-256** | FIPS PUB 180-4 | 256 bits (64 hex characters) | Web Crypto API / CryptoJS |
| **SHA-512** | FIPS PUB 180-4 | 512 bits (128 hex characters) | Web Crypto API / CryptoJS |
| **SHA3-256** | FIPS PUB 202 (Keccak) | 256 bits (64 hex characters) | CryptoJS (Streamed) |
| **SHA3-512** | FIPS PUB 202 (Keccak) | 512 bits (128 hex characters) | CryptoJS (Streamed) |

## Architecture

- **Execution Isolation**: Offloaded to dedicated Web Workers to ensure main UI thread remains responsive during large file calculations.
- **Memory Management**: File uploads are processed in 4MB chunks via sequential ArrayBuffer streaming instead of loading entire files into memory.
- **Hardware Acceleration**: Text hashing uses the native Web Crypto API (`crypto.subtle`) where supported.
- **Offline & Private**: Zero network telemetry. All hashing occurs strictly in-memory within the client runtime.

## Project Structure

```
File-Hasher/
├── public/                 # Static assets
├── src/
│   ├── components/         # UI components (FileUpload, HashCard, InputSection, ThemeManager)
│   ├── workers/            # Web Worker for background digest processing
│   ├── hashGenerator.ts    # HashEngine controller and task dispatcher
│   ├── main.ts             # Application bootstrapping and lifecycle
│   └── style.css           # Design system tokens and styling
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite bundler configuration
```

## Getting Started

### Prerequisites

- Node.js >= 20.x
- npm >= 10.x

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

The output bundle will be generated in `dist/`.

### Preview Build

```bash
npm run preview
```

## Deployment Targets

Configurations are included for static hosting platforms:

- **Cloudflare Pages**: `wrangler.toml`
- **Vercel**: `vercel.json`
- **Netlify**: `netlify.toml`
- **Docker**: `Dockerfile`

## License

MIT License. See [LICENSE](LICENSE) for details.
