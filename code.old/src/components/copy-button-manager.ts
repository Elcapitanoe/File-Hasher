import { copyToClipboard } from '../utils/clipboard';

export class CopyButtonManager {
  public setupCopyButtons(): void {
    const copyButtons = document.querySelectorAll<HTMLButtonElement>('.copy-btn');
    
    copyButtons.forEach(btn => {
      // Remove existing listeners to prevent duplicates
      const newBtn = btn.cloneNode(true) as HTMLButtonElement;
      btn.parentNode?.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', async () => {
        await this.handleCopyClick(newBtn);
      });
    });
  }

  private async handleCopyClick(button: HTMLButtonElement): Promise<void> {
    const hashValue = button.getAttribute('data-hash');
    if (!hashValue) return;

    const icon = button.querySelector('i');
    if (!icon) return;

    const originalClass = icon.className;
    const hashLabel = this.getHashLabel(button);
    
    try {
      const success = await copyToClipboard(hashValue);
      
      if (success) {
        this.showCopySuccess(button, icon, originalClass, hashLabel);
      } else {
        this.showCopyError(button, icon, originalClass, hashLabel);
      }
    } catch (error) {
      console.error('Copy failed:', error);
      this.showCopyError(button, icon, originalClass, hashLabel);
    }
  }

  private getHashLabel(button: HTMLButtonElement): string {
    const hashItem = button.closest('.hash-item');
    const hashLabel = hashItem?.querySelector('.hash-label');
    return hashLabel?.textContent || 'hash';
  }

  private showCopySuccess(
    button: HTMLButtonElement,
    icon: HTMLElement,
    originalClass: string,
    hashLabel: string
  ): void {
    icon.className = 'bi bi-check';
    button.title = 'Copied!';
    
    setTimeout(() => {
      icon.className = originalClass;
      button.title = `Copy ${hashLabel} hash to clipboard`;
    }, 2000);
  }

  private showCopyError(
    button: HTMLButtonElement,
    icon: HTMLElement,
    originalClass: string,
    hashLabel: string
  ): void {
    icon.className = 'bi bi-x';
    button.title = 'Copy failed';
    
    setTimeout(() => {
      icon.className = originalClass;
      button.title = `Copy ${hashLabel} hash to clipboard`;
    }, 2000);
  }
}