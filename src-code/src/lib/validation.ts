import { ContactFormData } from '@/types/contact';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 2000;
const MIN_MESSAGE_LENGTH = 10;

export interface ValidationResult {
  valid: boolean;
  data?: ContactFormData;
  error?: string;
}

// Initialize DOMPurify for server-side use
let purify: ReturnType<typeof createDOMPurify>;
try {
  const window = new JSDOM('').window;
  purify = createDOMPurify(window as any);
} catch {
  // Fallback if DOMPurify initialization fails
  purify = null as any;
}

/**
 * Sanitize text by removing HTML tags and encoding entities
 * Uses DOMPurify for robust HTML sanitization with regex fallback
 */
function sanitizeText(text: string): string {
  if (purify) {
    try {
      // Use DOMPurify to strip all HTML tags and attributes
      // This prevents XSS attacks more effectively than regex
      const sanitized = purify.sanitize(text, {
        ALLOWED_TAGS: [], // No HTML tags allowed
        ALLOWED_ATTR: [], // No attributes allowed
        KEEP_CONTENT: true, // Keep text content
      });
      return sanitized.trim();
    } catch {
      // Fall through to regex-based sanitization if DOMPurify fails
    }
  }
  
  // Fallback: Enhanced regex-based sanitization
  // More robust than original but simpler than DOMPurify
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]+>/g, '') // Remove all HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/&#x?[0-9a-f]+;/gi, '') // Remove HTML entities (basic)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Validate and sanitize contact form data
 */
export function validateContactForm(input: {
  name: string;
  email: string;
  message: string;
}): ValidationResult {
  // Sanitize inputs
  const name = sanitizeText(input.name);
  const email = input.email.trim().toLowerCase();
  const message = sanitizeText(input.message);

  // Validate name
  if (!name || name.length === 0) {
    return { valid: false, error: 'Name is required' };
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { valid: false, error: `Name must be less than ${MAX_NAME_LENGTH} characters` };
  }

  // Validate email
  if (!email || email.length === 0) {
    return { valid: false, error: 'Email is required' };
  }
  if (!isValidEmail(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Validate message
  if (!message || message.length === 0) {
    return { valid: false, error: 'Message is required' };
  }
  if (message.length < MIN_MESSAGE_LENGTH) {
    return { valid: false, error: `Message must be at least ${MIN_MESSAGE_LENGTH} characters` };
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, error: `Message must be less than ${MAX_MESSAGE_LENGTH} characters` };
  }

  return {
    valid: true,
    data: { name, email, message },
  };
}
