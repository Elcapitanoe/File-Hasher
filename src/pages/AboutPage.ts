export class AboutPage {
  private element: HTMLElement;

  constructor() {
    this.element = this.createElement();
  }

  private createElement(): HTMLElement {
    const page = document.createElement("div");
    page.className = "page-container about-page";
    page.innerHTML = `
      <div class="page-content">
        <header class="page-header">
          <button class="back-button" id="backToMain">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
            Back to File Hasher
          </button>
        </header>

        <main class="page-main">
          <div class="hero-section">
            <div class="hero-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h1>About File Hasher</h1>
            <p class="hero-subtitle">A simple, secure, and privacy-focused hash generation tool</p>
          </div>

          <div class="content-sections">
            <section class="content-section">
              <h2>What is File Hasher?</h2>
              <p>
                File Hasher is a client-side web application designed to generate cryptographic hashes 
                for both text input and files. Whether you're a developer verifying file integrity, 
                a security professional checking checksums, or simply curious about cryptographic hashing, 
                this tool provides a fast and reliable way to generate hashes using industry-standard algorithms.
              </p>
              <p>
                The application supports six popular hashing algorithms: MD5, SHA-1, SHA-256, SHA-512, 
                SHA-3 256, and SHA-3 512. Each algorithm serves different purposes, from legacy compatibility 
                (MD5, SHA-1) to modern security standards (SHA-256, SHA-512, SHA-3).
              </p>
            </section>

            <section class="content-section">
              <h2>Why File Hasher?</h2>
              <div class="feature-grid">
                <div class="feature-card">
                  <div class="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <h3>Privacy First</h3>
                  <p>All processing happens locally in your browser. No data is ever sent to external servers.</p>
                </div>
                <div class="feature-card">
                  <div class="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                  </div>
                  <h3>User Friendly</h3>
                  <p>Clean, intuitive interface with drag-and-drop file support and instant hash generation.</p>
                </div>
                <div class="feature-card">
                  <div class="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>
                  </div>
                  <h3>Lightning Fast</h3>
                  <p>Optimized algorithms and modern web technologies ensure quick hash generation.</p>
                </div>
                <div class="feature-card">
                  <div class="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                      <line x1="4" y1="22" x2="4" y2="15"></line>
                    </svg>
                  </div>
                  <h3>Open Source</h3>
                  <p>Transparent, auditable code available on GitHub for community review and contribution.</p>
                </div>
              </div>
            </section>

            <section class="content-section">
              <h2>About the Creator</h2>
              <div class="creator-info">
                <div class="creator-text">
                  <p>
                    File Hasher was created by <strong>Domi Adiwijaya</strong> (GitHub: 
                    <a href="https://github.com/Elcapitanoe" target="_blank" rel="noopener noreferrer" class="creator-link">@Elcapitanoe</a>), 
                    a passionate developer focused on creating useful, privacy-respecting web tools.
                  </p>
                  <p>
                    The motivation behind this project stems from the need for a simple, trustworthy hash generation 
                    tool that doesn't compromise user privacy. Many online hash generators require uploading files 
                    to remote servers, which raises security concerns. File Hasher solves this by performing all 
                    operations locally, ensuring your sensitive data never leaves your device.
                  </p>
                </div>
              </div>
            </section>

            <section class="content-section">
              <h2>Technical Details</h2>
              <div class="tech-details">
                <div class="tech-item">
                  <h4>Built With</h4>
                  <ul>
                    <li>TypeScript for type-safe development</li>
                    <li>Vite for fast build tooling</li>
                    <li>Web Crypto API for secure hash generation</li>
                    <li>Custom MD5 implementation for legacy support</li>
                  </ul>
                </div>
                <div class="tech-item">
                  <h4>Supported Algorithms</h4>
                  <ul>
                    <li><strong>MD5:</strong> 128-bit legacy hash (not cryptographically secure)</li>
                    <li><strong>SHA-1:</strong> 160-bit hash (deprecated for security)</li>
                    <li><strong>SHA-256:</strong> 256-bit secure hash (recommended)</li>
                    <li><strong>SHA-512:</strong> 512-bit secure hash (high security)</li>
                    <li><strong>SHA-3 256/512:</strong> Latest NIST standard hashes</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="content-section">
              <h2>Use Cases</h2>
              <div class="use-cases">
                <div class="use-case">
                  <h4>🔍 File Integrity Verification</h4>
                  <p>Verify that downloaded files haven't been corrupted or tampered with by comparing their hashes.</p>
                </div>
                <div class="use-case">
                  <h4>🔐 Password Hashing</h4>
                  <p>Generate hashes for passwords or sensitive strings (though remember to use proper salting in production).</p>
                </div>
                <div class="use-case">
                  <h4>📋 Checksum Generation</h4>
                  <p>Create checksums for files before sharing or archiving to ensure data integrity.</p>
                </div>
                <div class="use-case">
                  <h4>🧪 Development & Testing</h4>
                  <p>Quick hash generation for development workflows, testing, and debugging purposes.</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    `;

    this.setupEventListeners(page);
    return page;
  }

  private setupEventListeners(page: HTMLElement): void {
    const backButton = page.querySelector("#backToMain") as HTMLButtonElement;
    backButton.addEventListener("click", () => {
      this.hide();
    });
  }

  show(): void {
    document.body.appendChild(this.element);
    document.body.style.overflow = "hidden";
  }

  hide(): void {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    document.body.style.overflow = "";
  }

  getElement(): HTMLElement {
    return this.element;
  }
}
