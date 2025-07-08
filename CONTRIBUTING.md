# Contributing to File Hasher V2

Thank you for your interest in contributing to File Hasher V2! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/File-Hasher-V2.git
   cd File-Hasher-V2
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🎯 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear description** of the issue
- **Steps to reproduce** the behavior
- **Expected vs actual behavior**
- **Browser and OS information**
- **File types and sizes** that cause issues (if applicable)
- **Screenshots or error messages** (if applicable)

### Suggesting Features

Feature suggestions are welcome! Please:

- **Check existing issues** for similar suggestions
- **Provide clear use cases** for the feature
- **Explain the expected behavior**
- **Consider security implications** for file processing features

### Code Contributions

#### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   ```bash
   npm run type-check
   npm run lint
   npm run format:check
   npm run build
   ```

4. **Commit your changes**:
   ```bash
   git commit -m "feat: add new hash algorithm support"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

#### Coding Standards

- **TypeScript**: Use strict typing, avoid `any` types
- **ESLint**: Follow the configured rules (run `npm run lint`)
- **Prettier**: Format code consistently (run `npm run format`)
- **Naming**: Use descriptive names for variables, functions, and components
- **Comments**: Add JSDoc comments for public APIs and complex logic

#### Code Style Guidelines

```typescript
// ✅ Good: Descriptive names and proper typing
interface HashCalculationOptions {
  readonly algorithm: HashAlgorithm;
  readonly chunkSize?: number;
}

async function calculateFileHash(
  file: File,
  options: HashCalculationOptions
): Promise<string> {
  // Implementation
}

// ❌ Bad: Vague names and loose typing
function calc(f: any, opts?: any): any {
  // Implementation
}
```

#### Component Guidelines

- **Single Responsibility**: Each component should have one clear purpose
- **Props Interface**: Define clear TypeScript interfaces for props
- **Error Boundaries**: Handle errors gracefully
- **Accessibility**: Include proper ARIA labels and keyboard navigation
- **Performance**: Use React.memo() for expensive components

#### Security Considerations

- **Client-Side Only**: All processing must remain in the browser
- **Input Validation**: Validate all user inputs and file selections
- **Error Handling**: Never expose sensitive information in error messages
- **Dependencies**: Keep dependencies minimal and regularly updated

## 🧪 Testing

### Running Tests

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format checking
npm run format:check

# Build verification
npm run build
```

### Testing Guidelines

- **Test file processing** with various file types and sizes
- **Test error conditions** (invalid files, network issues, etc.)
- **Test accessibility** with screen readers and keyboard navigation
- **Test performance** with large files
- **Test across browsers** (Chrome, Firefox, Safari, Edge)

## 📝 Documentation

### Code Documentation

- **JSDoc comments** for all public functions and interfaces
- **README updates** for new features or setup changes
- **Type definitions** should be self-documenting
- **Inline comments** for complex algorithms or business logic

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add SHA-3 hash algorithm support
fix: resolve memory leak in large file processing
docs: update installation instructions
style: improve button hover animations
refactor: extract hash calculation utilities
test: add unit tests for file validation
chore: update dependencies to latest versions
```

## 🔧 Development Environment

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **Modern browser** with Web Crypto API support

### Recommended Tools

- **VS Code** with TypeScript and ESLint extensions
- **React Developer Tools** browser extension
- **Git** for version control

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── ...
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── styles/             # Global styles and Tailwind CSS
└── App.tsx             # Main application component
```

## 🚀 Deployment

### Build Process

```bash
# Production build
npm run build

# Preview build locally
npm run preview
```

### Deployment Targets

- **Vercel**: Automatic deployment from main branch
- **Netlify**: Configuration in `netlify.toml`
- **GitHub Pages**: Static site deployment

## 🤝 Community

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and community chat
- **Documentation**: Check the README and code comments

### Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page

## 📋 Pull Request Checklist

Before submitting a pull request, ensure:

- [ ] Code follows the style guidelines
- [ ] TypeScript compilation passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Build succeeds (`npm run build`)
- [ ] Changes are tested in multiple browsers
- [ ] Documentation is updated (if needed)
- [ ] Commit messages follow conventional format
- [ ] PR description clearly explains the changes

## 📄 License

By contributing to File Hasher V2, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Thank you for contributing to File Hasher V2! Your efforts help make file hashing more accessible and secure for everyone.

---

**Questions?** Feel free to reach out by creating an issue or contacting [Domi Adiwijaya (@Elcapitanoe)](https://github.com/Elcapitanoe).