/**
 * Input sanitization utilities for XSS prevention
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * Use this for any user-generated content that will be rendered as HTML
 */
export function sanitizeHtml(dirty: string): string {
  // For server-side, we'll use a simple regex-based approach
  // For client-side, use DOMPurify
  return dirty
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize user input for database storage
 * Trims whitespace and removes null bytes
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/\0/g, '');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize filename to prevent directory traversal
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9.-]/gi, '_')
    .replace(/\.{2,}/g, '.')
    .toLowerCase();
}
