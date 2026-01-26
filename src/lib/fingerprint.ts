/**
 * Browser fingerprinting utility for user identification
 * Generates a consistent fingerprint based on browser characteristics
 */

const FINGERPRINT_STORAGE_KEY = 'portfolio_fingerprint';

/**
 * Simple hash function for fingerprint
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generate browser fingerprint
 */
function generateFingerprint(): string {
  if (typeof window === 'undefined') {
    // Server-side: return a placeholder (shouldn't happen in client components)
    return 'server';
  }

  const components: string[] = [];

  // User agent
  components.push(navigator.userAgent || '');

  // Screen resolution
  components.push(`${screen.width}x${screen.height}`);

  // Color depth
  components.push(`${screen.colorDepth}`);

  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Language
  components.push(navigator.language || '');

  // Platform
  components.push(navigator.platform || '');

  // Hardware concurrency (CPU cores)
  components.push(`${navigator.hardwareConcurrency || 0}`);

  // Canvas fingerprint (if available)
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Portfolio fingerprint', 2, 2);
      components.push(canvas.toDataURL());
    }
  } catch {
    // Canvas fingerprinting not available
  }

  // Combine all components
  const fingerprintString = components.join('|');

  // Hash for privacy
  return hashString(fingerprintString);
}

/**
 * Get or create browser fingerprint
 * Stores in localStorage for persistence across sessions
 */
export function getFingerprint(): string {
  if (typeof window === 'undefined') {
    throw new Error('getFingerprint() can only be called on the client side');
  }

  // Try to get existing fingerprint from localStorage
  try {
    const stored = localStorage.getItem(FINGERPRINT_STORAGE_KEY);
    if (stored) {
      return stored;
    }
  } catch {
    // localStorage not available (private browsing, etc.)
  }

  // Generate new fingerprint
  const fingerprint = generateFingerprint();

  // Store in localStorage
  try {
    localStorage.setItem(FINGERPRINT_STORAGE_KEY, fingerprint);
  } catch {
    // localStorage not available, but we can still use the fingerprint
  }

  return fingerprint;
}
