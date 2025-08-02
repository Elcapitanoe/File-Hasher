export class ErrorPage {
  private element: HTMLElement;
  private errorCode: number;
  private errorTitle: string;
  private errorMessage: string;

  constructor(errorCode: number = 404) {
    this.errorCode = errorCode;
    this.setErrorContent();
    this.element = this.createElement();
  }

  private setErrorContent(): void {
    switch (this.errorCode) {
      case 404:
        this.errorTitle = "Page Not Found";
        this.errorMessage = "The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.";
        break;
      case 402:
        this.errorTitle = "Payment Required";
        this.errorMessage = "This feature requires payment to access. Please check your subscription status or contact support.";
        break;
      case 403:
        this.errorTitle = "Access Forbidden";
        this.errorMessage = "You don't have permission to access this resource. Please check your credentials or contact an administrator.";
        break;
      case 500:
        this.errorTitle = "Internal Server Error";
        this.errorMessage = "Something went wrong on our end. Please try again later or contact support if the problem persists.";
        break;
      case 503:
        this.errorTitle = "Service Unavailable";
        this.errorMessage = "The service is temporarily unavailable. Please try again in a few minutes.";
        break;
      default:
        this.errorTitle = "Something Went Wrong";
        this.errorMessage = "An unexpected error occurred. Please try again or contact support if the problem continues.";
    }
  }

  private createElement(): HTMLElement {
    const page = document.createElement("div");
    page.className = "page-container error-page";
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
          <div class="error-hero">
            <div class="error-code">${this.errorCode}</div>
            <div class="error-icon">
              ${this.getErrorIcon()}
            </div>
            <h1 class="error-title">${this.errorTitle}</h1>
            <p class="error-description">${this.errorMessage}</p>
            
            <div class="error-actions">
              <button class="primary-action-btn" id="goHome">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9,22 9,12 15,12 15,22"></polyline>
                </svg>
                Go to Homepage
              </button>
              <button class="secondary-action-btn" id="goBack">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5"></path>
                  <path d="M12 19l-7-7 7-7"></path>
                </svg>
                Go Back
              </button>
            </div>
          </div>

          <div class="error-suggestions">
            <h3>What can you do?</h3>
            <div class="suggestion-grid">
              <div class="suggestion-card">
                <div class="suggestion-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h4>Use File Hasher</h4>
                <p>Generate secure hashes for your files and text using our main tool.</p>
              </div>
              <div class="suggestion-card">
                <div class="suggestion-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                  </svg>
                </div>
                <h4>Check the URL</h4>
                <p>Make sure you've entered the correct web address in your browser.</p>
              </div>
              <div class="suggestion-card">
                <div class="suggestion-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </div>
                <h4>Contact Support</h4>
                <p>If you need help, visit our GitHub repository to report issues or get assistance.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    `;

    this.setupEventListeners(page);
    return page;
  }

  private getErrorIcon(): string {
    switch (this.errorCode) {
      case 404:
        return `
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        `;
      case 402:
        return `
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="5" width="20" height="14" rx="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
          </svg>
        `;
      case 403:
        return `
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        `;
      case 500:
        return `
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        `;
      case 503:
        return `
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6"></path>
            <path d="M1 12h6m6 0h6"></path>
          </svg>
        `;
      default:
        return `
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        `;
    }
  }

  private setupEventListeners(page: HTMLElement): void {
    const backButton = page.querySelector("#backToMain") as HTMLButtonElement;
    const goHomeButton = page.querySelector("#goHome") as HTMLButtonElement;
    const goBackButton = page.querySelector("#goBack") as HTMLButtonElement;

    backButton.addEventListener("click", () => {
      this.hide();
    });

    goHomeButton.addEventListener("click", () => {
      this.hide();
    });

    goBackButton.addEventListener("click", () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        this.hide();
      }
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

  static show404(): void {
    const errorPage = new ErrorPage(404);
    errorPage.show();
  }

  static show402(): void {
    const errorPage = new ErrorPage(402);
    errorPage.show();
  }

  static show500(): void {
    const errorPage = new ErrorPage(500);
    errorPage.show();
  }
}