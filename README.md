# File Hasher

A browser-based hash generator built with TypeScript and Vite. Text and file contents are hashed locally in a dedicated Web Worker; files are processed in 4 MiB chunks so the application does not need to read an entire file into memory.

## Supported algorithms

| Algorithm | Standard | Output size | Notes |
| :--- | :--- | :--- | :--- |
| MD5 | RFC 1321 | 128 bits / 32 hex characters | Legacy compatibility only. Not suitable for security-sensitive use. |
| SHA-1 | FIPS PUB 180-4 | 160 bits / 40 hex characters | Legacy compatibility only. Not suitable for collision-resistant security use. |
| SHA-256 | FIPS PUB 180-4 | 256 bits / 64 hex characters | SHA-2 family |
| SHA-512 | FIPS PUB 180-4 | 512 bits / 128 hex characters | SHA-2 family |
| SHA3-256 | FIPS 202 | 256 bits / 64 hex characters | Standard SHA-3, not legacy Keccak-256 |
| SHA3-512 | FIPS 202 | 512 bits / 128 hex characters | Standard SHA-3, not legacy Keccak-512 |

## Implementation

Hashing runs in a dedicated Web Worker and uses incremental digest updates for file chunks of 4 MiB. SHA-3 uses the standardized FIPS 202 algorithms. There is no server upload or telemetry: the contents being hashed remain in the browser.

MD5 and SHA-1 remain available for legacy checksum comparison only. Do not use either to protect sensitive data or to verify data against an attacker who can deliberately construct collisions.

## Requirements

- Node.js 20.19.x or >= 22.12.0
- npm >= 10.0.0

## Install and run

```bash
npm ci
npm run dev
```

Build the production site and serve it locally for inspection with:

```bash
npm run build
npm run preview
```

The build output is written to `dist/`.

## Project structure

```text
File-Hasher/
├── public/                 # Static assets
├── src/
│   ├── components/         # UI components
│   ├── workers/            # Background hashing worker
│   ├── hashGenerator.ts    # Worker task dispatcher and metadata
│   ├── main.ts             # Application entry point
│   └── style.css           # UI styles
├── .github/workflows/      # CI and release workflows
├── Dockerfile
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── wrangler.toml
```

## Deployment

Static-hosting configuration is included for Cloudflare Pages (`wrangler.toml`), Vercel (`vercel.json`) and Netlify (`netlify.toml`). A multi-stage `Dockerfile` builds the application and serves the static output with Nginx.

## License

MIT. See [LICENSE](LICENSE).
