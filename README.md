# File Hasher

Small browser-based checksum tool for text and local files. Hashing stays in the browser and runs in a Web Worker.

## Supported algorithms

| Algorithm | Digest | Hex output |
| --- | ---: | ---: |
| MD5 | 128 bits | 32 characters |
| SHA-1 | 160 bits | 40 characters |
| SHA-256 | 256 bits | 64 characters |
| SHA-512 | 512 bits | 128 characters |
| SHA3-256 | 256 bits | 64 characters |
| SHA3-512 | 512 bits | 128 characters |

SHA3 uses the standardized SHA-3 functions, not the legacy Keccak variants.

MD5 and SHA-1 are kept for legacy checksum comparison. Do not use them for security-sensitive verification.

## Implementation

The worker uses [`@noble/hashes`](https://github.com/paulmillr/noble-hashes). Text is encoded as UTF-8. Files are read with `File.slice()` in 4 MiB chunks, so the whole file is not loaded at once.

Changing the input cancels pending work by terminating the current worker.

## Project structure

```text
File-Hasher/
├── public/                     # Static assets
├── src/
│   ├── components/              # UI components
│   ├── workers/                 # Hashing worker
│   ├── hashGenerator.ts         # Worker dispatcher
│   ├── main.ts                  # Application entry point
│   └── style.css                # Styles and theme tokens
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── Dockerfile
├── netlify.toml
├── vercel.json
└── wrangler.toml
```

## Requirements

- Node.js `20.19.x` or `>=22.12.0`
- npm `>=10.0.0`

## Development

```bash
npm ci
npm run dev
```

## Production build

```bash
npm run build
```

Output is written to `dist/`. Preview it with:

```bash
npm run preview
```

## Deployment

The included `vercel.json`, `netlify.toml`, `wrangler.toml`, and `Dockerfile` cover static deployment. Use `npm run build` and publish `dist/`.
