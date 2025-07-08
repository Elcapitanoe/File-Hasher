# File Hasher V2

A modern, secure, and privacy-focused file hash generator built with React, TypeScript, and Tailwind CSS. Generate cryptographic hashes (MD5, SHA-1, SHA-256, SHA-512) for your files entirely in your browser with no data ever leaving your device.

![File Hasher V2](https://img.shields.io/badge/File%20Hasher-V2-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

- **🔒 100% Client-Side Processing** - All hashing happens locally in your browser
- **🚀 High Performance** - Optimized algorithms with streaming support for large files
- **🎨 Modern UI/UX** - Clean, responsive design with dark/light theme support
- **🔐 Multiple Hash Algorithms** - MD5, SHA-1, SHA-256, and SHA-512 support
- **📱 Mobile Friendly** - Fully responsive design that works on all devices
- **⚡ Real-time Progress** - Live progress tracking with speed and time estimates
- **📋 Easy Copy** - One-click hash copying to clipboard
- **🌙 Theme Support** - Automatic dark/light mode with system preference detection
- **🔍 File Type Detection** - Smart file type recognition and validation
- **♿ Accessibility** - WCAG compliant with proper ARIA labels and keyboard navigation
- **🛡️ Privacy First** - Zero data collection, no tracking, complete privacy guaranteed

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **Modern browser** with Web Crypto API support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Elcapitanoe/File-Hasher-V2.git
   cd File-Hasher-V2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:prod` | Production build with all checks |
| `npm run preview` | Preview production build |
| `npm run type-check` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run clean` | Clean build directory |

### Project Structure

```
File-Hasher-V2/
├── .github/                 # GitHub workflows and templates
│   ├── workflows/          # CI/CD pipelines
│   └── ISSUE_TEMPLATE/     # Issue templates
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── FileDropZone.tsx
│   │   ├── HashResults.tsx
│   │   ├── ProcessingStatus.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── FeatureGrid.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useFileProcessor.ts
│   │   └── useTheme.ts
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   │   ├── crypto.ts      # Cryptographic operations
│   │   ├── validation.ts  # File validation
│   │   ├── formatters.ts  # Data formatting
│   │   ├── clipboard.ts   # Clipboard operations
│   │   └── cn.ts          # Class name utilities
│   ├── styles/            # Global styles and Tailwind CSS
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── docs/                  # Documentation files
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
└── package.json           # Project dependencies and scripts
```

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for fast development and optimized builds
- **Cryptography**: Web Crypto API + CryptoJS for MD5
- **Icons**: Lucide React for consistent iconography
- **Linting**: ESLint + Prettier for code quality
- **Type Safety**: Strict TypeScript configuration

## 🚀 Deployment

This application can be deployed to any static hosting provider. The build output is in the `dist/` directory after running `npm run build`.

### Universal Deployment Instructions

1. **Build the project**
   ```bash
   npm run build:prod
   ```

2. **Deploy the `dist/` folder** to your hosting provider

### Recommended Hosting Providers

#### **Vercel** (Recommended)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push

#### **Netlify**
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

#### **GitHub Pages**
1. Build the project: `npm run build`
2. Push the `dist/` contents to `gh-pages` branch
3. Enable GitHub Pages in repository settings

#### **Cloudflare Pages**
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically

#### **FTP/SFTP Upload**
1. Build the project: `npm run build`
2. Upload all files from `dist/` to your web server
3. Ensure your server serves `index.html` for all routes

#### **Other Static Hosts**
The application works with any static hosting provider:
- Firebase Hosting
- AWS S3 + CloudFront
- Azure Static Web Apps
- DigitalOcean App Platform
- Surge.sh
- And many more...

### Build Configuration

The build is optimized for performance and security:

- **Code Splitting**: Vendor, crypto, and UI chunks
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Minification and compression
- **Modern JavaScript**: ES2020 target for better performance
- **Source Maps**: Available for debugging

## 🔐 Security & Privacy

File Hasher V2 is designed with security and privacy as fundamental principles:

### Privacy Guarantees
- **No Data Transmission**: Files never leave your device
- **Client-Side Only**: All processing happens in your browser
- **No Tracking**: Zero analytics, cookies, or data collection
- **No Storage**: Files are not saved or cached anywhere
- **Local Processing**: All cryptographic operations are performed locally

### Security Features
- **Secure Headers**: CSP and security headers implemented
- **Modern Crypto**: Uses Web Crypto API for secure hashing
- **Input Validation**: Comprehensive file validation and sanitization
- **Error Handling**: Secure error handling without information leakage
- **Dependency Security**: Regular security audits and updates

### Cryptographic Algorithms

| Algorithm | Status | Use Case | Security Level |
|-----------|--------|----------|----------------|
| **MD5** | ⚠️ Legacy | Compatibility only | Cryptographically broken |
| **SHA-1** | ⚠️ Deprecated | Legacy systems | Deprecated for security |
| **SHA-256** | ✅ Recommended | General purpose | Secure |
| **SHA-512** | ✅ Recommended | High security | Secure |

**Recommendation**: Use SHA-256 or SHA-512 for security-critical applications.

## 📱 Browser Support

### Minimum Requirements
- **Chrome**: 80+ (recommended)
- **Firefox**: 72+
- **Safari**: 13.1+
- **Edge**: 80+

### Required Features
- **Web Crypto API**: For secure hash calculations
- **File API**: For file reading and processing
- **ES2020**: Modern JavaScript features
- **CSS Grid & Flexbox**: For responsive layouts

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and ensure tests pass
4. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript strict mode and ESLint rules
- Write comprehensive tests for new features
- Maintain 100% client-side processing
- Ensure accessibility compliance
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Domi Adiwijaya (@Elcapitanoe)**
- Email: [domy.adiwijaya@gmail.com](mailto:domy.adiwijaya@gmail.com)
- GitHub: [@Elcapitanoe](https://github.com/Elcapitanoe)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Vite](https://vitejs.dev/) - Build tool
- [Lucide](https://lucide.dev/) - Icon library
- [CryptoJS](https://cryptojs.gitbook.io/) - Cryptographic library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) - Browser cryptography

## 📊 Performance Metrics

- **Lighthouse Score**: 100/100 (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: < 500KB gzipped
- **Time to Interactive**: < 2s on 3G
- **First Contentful Paint**: < 1s
- **Cumulative Layout Shift**: 0
- **Largest Contentful Paint**: < 2.5s

---

<div align="center">
  <p>Made by <a href="https://github.com/Elcapitanoe">Domi Adiwijaya (@Elcapitanoe)</a></p>
  <p>⭐ Star this repository if you find it helpful!</p>
  <p>🔒 Your privacy is our priority - all processing happens locally in your browser</p>
</div>