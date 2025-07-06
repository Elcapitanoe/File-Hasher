import type { ElementId } from '../types';

/**
 * Shorthand for document.getElementById with type safety and error checking
 */
export function getElementById<T extends HTMLElement = HTMLElement>(
  elementId: ElementId
): T | null {
  const element = document.getElementById(elementId) as T | null;
  if (!element) {
    console.warn(`Element with ID '${elementId}' not found`);
  }
  return element;
}

/**
 * Escape HTML to prevent XSS attacks
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Add CSS class with animation support
 */
export function addAnimationClass(
  element: HTMLElement,
  className: string,
  duration = 500
): void {
  element.classList.add('animate__animated', className);
  setTimeout(() => {
    element.classList.remove('animate__animated', className);
  }, duration);
}

/**
 * Create a ripple effect on button click
 */
export function createRipple(button: HTMLElement, event: MouseEvent): void {
  // Remove existing ripples
  const existingRipples = button.querySelectorAll('.ripple');
  existingRipples.forEach(ripple => ripple.remove());
  
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const rect = button.getBoundingClientRect();
  
  circle.style.cssText = `
    width: ${diameter}px;
    height: ${diameter}px;
    left: ${event.clientX - rect.left - radius}px;
    top: ${event.clientY - rect.top - radius}px;
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  `;
  
  circle.classList.add('ripple');
  
  // Ensure button has relative positioning
  if (getComputedStyle(button).position === 'static') {
    button.style.position = 'relative';
  }
  
  button.style.overflow = 'hidden';
  button.appendChild(circle);
  
  // Clean up after animation
  setTimeout(() => {
    if (circle.parentNode) {
      circle.remove();
    }
  }, 600);
}