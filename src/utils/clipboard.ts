/**
 * Copy text to clipboard with comprehensive fallback support
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) {
    console.warn('Attempted to copy empty text to clipboard');
    return false;
  }
  
  try {
    // Modern clipboard API (preferred method)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers or non-secure contexts
    return fallbackCopyToClipboard(text);
  } catch (error) {
    console.warn('Clipboard API failed, trying fallback:', error);
    return fallbackCopyToClipboard(text);
  }
}

/**
 * Fallback clipboard implementation using document.execCommand
 */
function fallbackCopyToClipboard(text: string): boolean {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Style the textarea to be invisible but functional
    Object.assign(textArea.style, {
      position: 'fixed',
      top: '-9999px',
      left: '-9999px',
      opacity: '0',
      pointerEvents: 'none',
      width: '1px',
      height: '1px',
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      background: 'transparent',
    });
    
    document.body.appendChild(textArea);
    
    // Select and copy the text
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, text.length);
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.error('Fallback copy failed:', error);
    return false;
  }
}

/**
 * Check if clipboard API is available
 */
export function isClipboardSupported(): boolean {
  return !!(navigator.clipboard || document.execCommand);
}

/**
 * Read text from clipboard (if supported)
 */
export async function readFromClipboard(): Promise<string | null> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      return await navigator.clipboard.readText();
    }
    
    // No fallback for reading clipboard in older browsers
    console.warn('Clipboard read not supported in this browser');
    return null;
  } catch (error) {
    console.error('Failed to read from clipboard:', error);
    return null;
  }
}