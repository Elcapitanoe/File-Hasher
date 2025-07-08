# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions of File Hasher V2:

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 2.x.x   | :white_check_mark: | Active development |
| 1.x.x   | :x:                | End of life |

## Security Model

File Hasher V2 is designed with security and privacy as core principles:

### Client-Side Only Processing
- **No server communication**: All file processing happens entirely in your browser
- **No data transmission**: Files, file contents, and hash results never leave your device
- **Local storage only**: Theme preferences and settings are stored locally
- **No analytics**: Zero tracking, cookies, or data collection

### Cryptographic Implementation
- **Web Crypto API**: Uses browser-native cryptographic implementations when available
- **Fallback libraries**: crypto-js for algorithms not supported by Web Crypto API (MD5)
- **Standard algorithms**: MD5, SHA-1, SHA-256, SHA-512 using industry-standard implementations
- **No custom crypto**: We do not implement custom cryptographic algorithms

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### 1. Do Not Create Public Issues
**Please do not report security vulnerabilities through public GitHub issues.**

### 2. Contact Information
Send security reports to: **[domy.adiwijaya@gmail.com](mailto:domy.adiwijaya@gmail.com)**

Include "SECURITY" in the subject line.

### 3. Required Information
Please include the following information in your report:

- **Description**: Clear description of the vulnerability
- **Impact**: Potential impact and attack scenarios
- **Reproduction**: Step-by-step instructions to reproduce the issue
- **Environment**: Browser, OS, and version information
- **Files**: Any proof-of-concept files or code (if safe to share)
- **Timeline**: Any time constraints or public disclosure plans

### 4. Response Timeline
- **Initial response**: Within 48 hours
- **Vulnerability assessment**: Within 7 days
- **Fix development**: Timeline depends on severity and complexity
- **Public disclosure**: Coordinated with reporter after fix is available

## Security Best Practices

### For Users
- **Keep browsers updated**: Ensure you're using the latest browser version
- **Verify hashes**: Cross-check important hash results with other tools
- **Secure environment**: Use the application on trusted devices and networks
- **File safety**: Only process files from trusted sources

### For Developers
- **Dependency updates**: Regularly update all dependencies
- **Security scanning**: Use automated tools to scan for vulnerabilities
- **Code review**: All changes undergo security-focused code review
- **Input validation**: Validate all user inputs and file selections
- **Error handling**: Avoid exposing sensitive information in error messages

## Known Security Considerations

### Browser Limitations
- **Memory constraints**: Large files may cause browser memory issues
- **Implementation differences**: Cryptographic implementations may vary between browsers
- **Side-channel attacks**: Browser-based crypto may be vulnerable to timing attacks

### Algorithm Security
- **MD5**: Cryptographically broken, provided for compatibility only
- **SHA-1**: Deprecated for security applications, use SHA-256 or higher
- **SHA-256/512**: Currently secure for most applications

### Recommendations
- **Use SHA-256 or SHA-512** for security-critical applications
- **Verify results** with multiple tools for important files
- **Understand limitations** of browser-based cryptographic operations

## Security Updates

### Notification Process
Security updates will be communicated through:
- **GitHub Security Advisories**
- **Release notes** with security tags
- **README updates** for critical issues

### Update Policy
- **Critical vulnerabilities**: Immediate patch release
- **High severity**: Patch within 7 days
- **Medium/Low severity**: Included in next regular release

## Vulnerability Disclosure Policy

### Coordinated Disclosure
We follow responsible disclosure practices:

1. **Private reporting** to maintainers
2. **Collaborative investigation** and fix development
3. **Coordinated public disclosure** after fix is available
4. **Credit to reporters** (if desired)

### Public Disclosure Timeline
- **Critical**: 90 days maximum
- **High**: 120 days maximum
- **Medium/Low**: 180 days maximum

Extensions may be granted for complex issues requiring significant development effort.

## Security Tools and Practices

### Automated Security
- **Dependabot**: Automated dependency vulnerability scanning
- **GitHub Security Advisories**: Vulnerability database monitoring
- **ESLint Security Rules**: Static analysis for common security issues
- **TypeScript**: Type safety to prevent common vulnerabilities

### Manual Security Review
- **Code review**: All changes reviewed for security implications
- **Dependency audit**: Regular manual review of dependencies
- **Threat modeling**: Periodic assessment of attack vectors
- **Penetration testing**: Informal security testing of new features

## Compliance and Standards

### Standards Followed
- **OWASP**: Web Application Security Project guidelines
- **NIST**: Cryptographic standards and recommendations
- **RFC Standards**: Cryptographic algorithm implementations
- **W3C Security**: Web platform security best practices

### Privacy Compliance
- **GDPR Ready**: No personal data collection or processing
- **CCPA Compliant**: No data sale or sharing
- **Privacy by Design**: Built-in privacy protections

## Contact Information

### Security Team
- **Primary Contact**: [Domi Adiwijaya (@Elcapitanoe)](https://github.com/Elcapitanoe)
- **Email**: [domy.adiwijaya@gmail.com](mailto:domy.adiwijaya@gmail.com)
- **Response Time**: 48 hours maximum

### General Security Questions
For general security questions or discussions:
- **GitHub Discussions**: Use the Security category
- **GitHub Issues**: For non-sensitive security improvements

---

**Thank you for helping keep File Hasher V2 secure!**

Last updated: January 2025