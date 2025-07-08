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
| `npm run preview` | Preview production build |
| `npm run type-check` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

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
├── netlify.toml           # Netlify deployment config
├── vercel.json            # Vercel deployment config
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
- **Testing**: Built-in type checking and linting
- **CI/CD**: GitHub Actions for automated testing and deployment

## 🎨 Design System

### Color Palette

The application features a carefully crafted color system optimized for both light and dark themes:

#### Light Theme
- **Primary**: Blue 600 (#2563eb) - Main brand color
- **Background**: White (#ffffff) - Clean, minimal background
- **Surface**: Gray 50 (#f8fafc) - Card and component backgrounds
- **Text**: Gray 900 (#111827) - High contrast text
- **Border**: Gray 200 (#e5e7eb) - Subtle borders and dividers

#### Dark Theme
- **Primary**: Blue 400 (#60a5fa) - Accessible brand color
- **Background**: Dark 900 (#0f172a) - Deep, comfortable background
- **Surface**: Dark 800 (#1e293b) - Elevated component backgrounds
- **Text**: Gray 100 (#f3f4f6) - High contrast text
- **Border**: Dark 700 (#334155) - Subtle borders and dividers

### Typography

- **Font Family**: Inter (sans-serif) for UI, JetBrains Mono for code
- **Font Weights**: 300, 400, 500, 600, 700
- **Line Heights**: 150% for body text, 120% for headings
- **Font Features**: Ligatures and contextual alternates enabled

### Spacing System

Consistent 8px spacing system throughout the application:
- **Base unit**: 8px
- **Common spacings**: 8px, 16px, 24px, 32px, 48px, 64px
- **Component padding**: Multiples of 8px
- **Grid gaps**: 16px, 24px, 32px

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

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. **Deploy**: Automatic deployments on push to main branch

### Netlify

1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Build Settings**: Pre-configured in `netlify.toml`
3. **Deploy**: Automatic deployments with optimized configuration

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting provider
```

### Performance Optimizations

- **Code Splitting**: Vendor, crypto, and UI chunks
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and font optimization
- **Compression**: Gzip/Brotli compression support
- **Caching**: Aggressive caching for static assets
- **Bundle Analysis**: Optimized chunk sizes

## 🔧 Configuration

### Environment Variables

No environment variables are required for basic functionality. The application runs entirely client-side.

### Build Configuration

The build is optimized for performance and security:

```javascript
// vite.config.ts highlights
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          crypto: ['crypto-js'],
          ui: ['lucide-react', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
});
```

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

### Third-Party Licenses

- **React**: MIT License - Copyright (c) Meta Platforms, Inc.
- **TypeScript**: Apache License 2.0 - Copyright (c) Microsoft Corporation
- **Tailwind CSS**: MIT License - Copyright (c) Tailwind Labs, Inc.
- **Vite**: MIT License - Copyright (c) 2019-present, Yuxi (Evan) You
- **crypto-js**: MIT License - Copyright (c) 2009-2013 Jeff Mott

## 👨‍💻 Author

**Domi Adiwijaya (@Elcapitanoe)**
- Email: [domy.adiwijaya@gmail.com](mailto:domy.adiwijaya@gmail.com)
- GitHub: [@Elcapitanoe](https://github.com/Elcapitanoe)
- Website: [File Hasher V2](https://file-hasher-v2.vercel.app)

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

## 🔄 Changelog

### Version 2.0.0 (Current)
- ✨ Complete rewrite with modern React and TypeScript
- 🎨 New responsive design with dark/light theme support
- ⚡ Improved performance with streaming hash calculation
- 🔒 Enhanced security and privacy features
- ♿ Better accessibility and mobile support
- 🛠️ Comprehensive error handling and validation
- 📱 Progressive Web App capabilities
- 🚀 Optimized build and deployment configuration

### Roadmap
- 🔮 Additional hash algorithms (SHA-3, BLAKE2)
- 📊 Batch file processing
- 🎯 File integrity verification
- 📱 Offline PWA functionality
- 🌐 Internationalization support

## 🆘 Support

### Getting Help

1. **Documentation**: Check this README and inline code comments
2. **Issues**: Search existing [GitHub Issues](https://github.com/Elcapitanoe/File-Hasher-V2/issues)
3. **New Issue**: Create a detailed issue report
4. **Contact**: Reach out to [Domi Adiwijaya](mailto:domy.adiwijaya@gmail.com)

### Reporting Issues

When reporting issues, please include:
- Browser and OS information
- Steps to reproduce the issue
- Expected vs actual behavior
- File types and sizes (if applicable)
- Console error messages
- Screenshots (if helpful)

---

<div align="center">
  <p>Made by <a href="https://github.com/Elcapitanoe">Domi Adiwijaya (@Elcapitanoe)</a></p>
  <p>⭐ Star this repository if you find it helpful!</p>
  <p>🔒 Your privacy is our priority - all processing happens locally in your browser</p>
</div>