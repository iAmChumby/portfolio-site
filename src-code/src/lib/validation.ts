import { ContactFormData } from '@/types/contact';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 2000;
const MIN_MESSAGE_LENGTH = 10;

export interface ValidationResult {
  valid: boolean;
  data?: ContactFormData;
  error?: string;
}

/**
 * Strip HTML tags and trim whitespace
 */
function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
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
