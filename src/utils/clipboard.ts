/**
 * Copy text to clipboard with fallback support
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  
  try {
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    return fallbackCopyToClipboard(text);
  } catch (error) {
    console.warn('Clipboard API failed, trying fallback:', error);
    return fallbackCopyToClipboard(text);
  }
}

/**
 * Fallback clipboard implementation
 */
function fallbackCopyToClipboard(text: string): boolean {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText = `
      position: fixed;
      top: -9999px;
      left: -9999px;
      opacity: 0;
      pointer-events: none;
      width: 1px;
      height: 1px;
    `;
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.error('Fallback copy failed:', error);
    return false;
  }
}