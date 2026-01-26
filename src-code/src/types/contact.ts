export interface ContactFormInput {
  name: string;
  email: string;
  message: string;
  turnstileToken: string;
  geolocation?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface TurnstileResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

export interface EmailResult {
  success: boolean;
  notificationSent: boolean;
  confirmationSent: boolean;
  error?: string;
}

export interface SheetsLogEntry {
  timestamp: string;
  name: string;
  email: string;
  message: string;
  ipAddress: string;
  geolocation: string;
}

export interface ContactAPIResponse {
  success: boolean;
  message: string;
}

export interface ContactAPIError {
  error: string;
  details?: string;
}
